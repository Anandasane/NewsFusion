from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from app.db.db import QuizAttempt
from app.services.current_affairs import CurrentAffairsService
from app.services.recommender import Recommender


class QuizService:
    def __init__(self, recommender: Recommender, current_affairs_service: CurrentAffairsService):
        self.recommender = recommender
        self.current_affairs_service = current_affairs_service

    def get_quiz(self, db: Session, user_id: str, count: int = 5) -> dict:
        difficulty = self._recommended_difficulty(db, user_id)
        seed_articles = self.recommender.get_personalized_or_trending(user_id=user_id, base_id=0, count=count)
        questions = []

        for article in seed_articles[:count]:
            current_affairs = self.current_affairs_service.build_current_affairs(article)
            mcq = current_affairs.mcqs[min(1, len(current_affairs.mcqs) - 1)]
            questions.append(
                {
                    "article_id": article["id"],
                    "question": mcq["question"],
                    "options": mcq["options"],
                    "topic": current_affairs.topic,
                    "difficulty": difficulty,
                }
            )

        return {
            "user_id": user_id,
            "generated_at": datetime.utcnow(),
            "recommended_difficulty": difficulty,
            "questions": questions,
        }

    def submit_quiz(self, db: Session, user_id: str, answers: list[dict]) -> dict:
        difficulty = self._recommended_difficulty(db, user_id)
        results = []
        correct_count = 0
        topic_counts: dict[str, list[bool]] = {}

        for answer in answers:
            article = self.recommender.get_article(answer["article_id"])
            if not article:
                continue

            current_affairs = self.current_affairs_service.build_current_affairs(article)
            mcq = current_affairs.mcqs[min(1, len(current_affairs.mcqs) - 1)]
            is_correct = answer["selected_answer"].upper() == mcq["correct_answer"]
            correct_count += int(is_correct)
            topic_counts.setdefault(current_affairs.topic, []).append(is_correct)
            results.append(
                {
                    "article_id": article["id"],
                    "selected_answer": answer["selected_answer"].upper(),
                    "correct_answer": mcq["correct_answer"],
                    "is_correct": is_correct,
                    "explanation": mcq["explanation"],
                    "topic": current_affairs.topic,
                }
            )

        total_questions = len(results)
        accuracy = round((correct_count / total_questions) * 100, 2) if total_questions else 0.0
        dominant_topic = max(topic_counts, key=lambda topic: len(topic_counts[topic]), default="General")

        attempt = QuizAttempt(
            user_id=user_id,
            score=correct_count,
            total_questions=total_questions,
            topic=dominant_topic,
            difficulty=difficulty,
            accuracy=accuracy,
        )
        db.add(attempt)
        db.commit()

        return {
            "score": correct_count,
            "total_questions": total_questions,
            "accuracy": accuracy,
            "difficulty": difficulty,
            "results": results,
        }

    def _recommended_difficulty(self, db: Session, user_id: str) -> str:
        attempts = (
            db.query(QuizAttempt)
            .filter(QuizAttempt.user_id == user_id)
            .order_by(QuizAttempt.timestamp.desc())
            .limit(5)
            .all()
        )

        if not attempts:
            return "easy"

        average_accuracy = sum(item.accuracy for item in attempts) / len(attempts)
        if average_accuracy >= 80:
            return "hard"
        if average_accuracy >= 55:
            return "medium"
        return "easy"
