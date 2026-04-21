from datetime import datetime, timedelta
from collections import defaultdict

from sqlalchemy.orm import Session

from app.db.db import Interaction
from app.services.recommender import Recommender

ACTION_SCORE = {
    "click": 1.0,
    "like": 2.0,
    "save": 3.0,
}


class TrendingService:

    def __init__(self, recommender: Recommender):
        self.recommender = recommender

    def get_trending(self, db: Session, window_hours: int = 72, limit: int = 10) -> list[dict]:
        cutoff = datetime.utcnow() - timedelta(hours=window_hours)
        rows = (
            db.query(Interaction)
            .filter(Interaction.timestamp >= cutoff)
            .all()
        )

        scores = defaultdict(float)
        metrics = defaultdict(lambda: {"views": 0, "likes": 0, "saves": 0, "last_interaction": datetime.min})

        for interaction in rows:
            article_id = interaction.article_id
            score = ACTION_SCORE.get(interaction.action, 0)
            scores[article_id] += score
            entry = metrics[article_id]
            if interaction.action == "click":
                entry["views"] += 1
            elif interaction.action == "like":
                entry["likes"] += 1
            elif interaction.action == "save":
                entry["saves"] += 1

            if interaction.timestamp > entry["last_interaction"]:
                entry["last_interaction"] = interaction.timestamp

        ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        trending_articles = []

        if not ranked:
            for article in self.recommender.get_articles()[:limit]:
                result = dict(article)
                result.update(
                    {
                        "score": 0.0,
                        "views": 0,
                        "likes": 0,
                        "saves": 0,
                        "last_interaction": datetime.utcnow(),
                    }
                )
                trending_articles.append(result)
            return trending_articles

        for article_id, score in ranked[:limit]:
            article = self.recommender.store.get_article(article_id)
            if not article:
                continue
            result = dict(article)
            result["score"] = float(round(score, 3))
            result.update(metrics[article_id])
            trending_articles.append(result)

        return trending_articles
