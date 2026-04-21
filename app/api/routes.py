from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.api.schemas import (
    ArticleResponse,
    CurrentAffairsResponse,
    DailyDigestResponse,
    InteractionRequest,
    NoteRequest,
    NoteResponse,
    QuizResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    RecommendationResponse,
    TrendingResponse,
    UserStatsResponse,
)
from app.db.db import Interaction, UserNote, get_db
from app.services.analytics import AnalyticsService
from app.services.current_affairs import CurrentAffairsService
from app.services.genai import generate_summary
from app.services.pdf_export import build_digest_pdf
from app.services.quiz import QuizService
from app.services.recommender import Recommender
from app.services.trending import TrendingService

router = APIRouter()
recommender = Recommender()
current_affairs_service = CurrentAffairsService()
trending_service = TrendingService(recommender)
analytics_service = AnalyticsService(recommender, current_affairs_service)
quiz_service = QuizService(recommender, current_affairs_service)


@router.get("/", summary="Health check")
@router.get("/health", summary="Health check")
def health():
    return {
        "status": "ok",
        "service": "NewsFusion API",
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/articles", response_model=List[ArticleResponse], summary="List all articles")
def list_articles(limit: int = Query(20, ge=5, le=50), offset: int = Query(0, ge=0)):
    articles = recommender.get_articles()
    return articles[offset : offset + limit]


@router.get("/recommend/{user_id}/{article_id}", response_model=List[RecommendationResponse], summary="Personalized recommendations")
def recommend(user_id: str, article_id: int, count: int = Query(6, ge=3, le=12)):
    articles = recommender.get_personalized_or_trending(user_id=user_id, base_id=article_id, count=count)
    for article in articles:
        article["ai_summary"] = generate_summary(article.get("summary", article.get("title", "")))
    return articles


@router.post("/interact", summary="Track user interaction")
def interact(payload: InteractionRequest, db: Session = Depends(get_db)):
    if payload.action not in {"click", "like", "save"}:
        raise HTTPException(status_code=400, detail="action must be click, like, or save")

    interaction = Interaction(
        user_id=payload.user_id,
        article_id=payload.article_id,
        action=payload.action,
        timestamp=datetime.utcnow(),
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return {"message": "interaction recorded", "interaction_id": interaction.id}


@router.get("/trending", response_model=List[TrendingResponse], summary="Get trending articles")
def trending(window_hours: int = Query(72, ge=1, le=168), limit: int = Query(10, ge=5, le=30), db: Session = Depends(get_db)):
    results = trending_service.get_trending(db=db, window_hours=window_hours, limit=limit)
    return results


@router.get("/current-affairs/{article_id}", response_model=CurrentAffairsResponse, summary="Generate exam-focused current affairs")
def current_affairs(article_id: int):
    article = recommender.get_article(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="article not found")

    pack = current_affairs_service.build_current_affairs(article)
    return {
        "article_id": pack.article_id,
        "topic": pack.topic,
        "summary": pack.summary,
        "key_points": pack.key_points,
        "mcqs": pack.mcqs,
    }


@router.get("/daily-digest", response_model=DailyDigestResponse, summary="Top daily digest for exam preparation")
def daily_digest(limit: int = Query(5, ge=3, le=10)):
    items = []
    for article in recommender.get_articles()[:limit]:
        pack = current_affairs_service.build_current_affairs(article)
        items.append(
            {
                "article": article,
                "current_affairs": {
                    "article_id": pack.article_id,
                    "topic": pack.topic,
                    "summary": pack.summary,
                    "key_points": pack.key_points,
                    "mcqs": pack.mcqs,
                },
            }
        )

    return {
        "generated_at": datetime.utcnow(),
        "items": items,
    }


@router.get("/user-stats/{user_id}", response_model=UserStatsResponse, summary="User analytics dashboard")
def user_stats(user_id: str, db: Session = Depends(get_db)):
    return analytics_service.get_user_stats(db=db, user_id=user_id)


@router.get("/quiz/{user_id}", response_model=QuizResponse, summary="Generate adaptive quiz")
def quiz(user_id: str, count: int = Query(5, ge=3, le=10), db: Session = Depends(get_db)):
    return quiz_service.get_quiz(db=db, user_id=user_id, count=count)


@router.post("/quiz/submit", response_model=QuizSubmitResponse, summary="Submit quiz answers")
def submit_quiz(payload: QuizSubmitRequest, db: Session = Depends(get_db)):
    if not payload.answers:
        raise HTTPException(status_code=400, detail="answers are required")
    return quiz_service.submit_quiz(
        db=db,
        user_id=payload.user_id,
        answers=[answer.model_dump() for answer in payload.answers],
    )


@router.get("/export/pdf/{user_id}", summary="Export daily digest as PDF")
def export_pdf(user_id: str):
    digest = daily_digest(limit=5)
    pdf_bytes = build_digest_pdf(user_id=user_id, digest=digest)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="newsfusion-digest-{user_id}.pdf"'},
    )


@router.get("/notes/{user_id}", response_model=List[NoteResponse], summary="List user notes")
def list_notes(user_id: str, db: Session = Depends(get_db)):
    notes = db.query(UserNote).filter(UserNote.user_id == user_id).order_by(UserNote.updated_at.desc()).all()
    return notes


@router.post("/notes", response_model=NoteResponse, summary="Create or update note")
def upsert_note(payload: NoteRequest, db: Session = Depends(get_db)):
    article = recommender.get_article(payload.article_id)
    if not article:
        raise HTTPException(status_code=404, detail="article not found")

    note = (
        db.query(UserNote)
        .filter(UserNote.user_id == payload.user_id, UserNote.article_id == payload.article_id)
        .first()
    )

    if note is None:
        note = UserNote(
            user_id=payload.user_id,
            article_id=payload.article_id,
            note=payload.note,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(note)
    else:
        note.note = payload.note
        note.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(note)
    return note
