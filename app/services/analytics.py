from __future__ import annotations

from collections import Counter, defaultdict
from datetime import date

from sqlalchemy.orm import Session

from app.db.db import Interaction, QuizAttempt
from app.services.current_affairs import CurrentAffairsService
from app.services.recommender import Recommender


class AnalyticsService:
    def __init__(self, recommender: Recommender, current_affairs_service: CurrentAffairsService):
        self.recommender = recommender
        self.current_affairs_service = current_affairs_service

    def get_user_stats(self, db: Session, user_id: str) -> dict:
        interactions = db.query(Interaction).filter(Interaction.user_id == user_id).all()
        quizzes = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()

        action_counts = Counter(interaction.action for interaction in interactions)
        topic_buckets: dict[str, list[float]] = defaultdict(list)
        attempt_counts: dict[str, int] = defaultdict(int)

        for quiz in quizzes:
            topic_buckets[quiz.topic].append(float(quiz.accuracy))
            attempt_counts[quiz.topic] += 1

        topic_performance = [
            {
                "topic": topic,
                "accuracy": round(sum(scores) / len(scores), 2),
                "attempts": attempt_counts[topic],
            }
            for topic, scores in sorted(topic_buckets.items())
        ]

        strongest_topic = max(topic_performance, key=lambda item: item["accuracy"], default={"topic": "N/A"})["topic"]
        weakest_topic = min(topic_performance, key=lambda item: item["accuracy"], default={"topic": "N/A"})["topic"]

        streak_days = self._calculate_streak(interactions, quizzes)
        average_accuracy = round(
            sum(quiz.accuracy for quiz in quizzes) / len(quizzes),
            2,
        ) if quizzes else 0.0

        return {
            "user_id": user_id,
            "total_interactions": len(interactions),
            "clicks": action_counts.get("click", 0),
            "likes": action_counts.get("like", 0),
            "saves": action_counts.get("save", 0),
            "quizzes_taken": len(quizzes),
            "average_accuracy": average_accuracy,
            "streak_days": streak_days,
            "strongest_topic": strongest_topic,
            "weakest_topic": weakest_topic,
            "topic_performance": topic_performance,
        }

    def _calculate_streak(self, interactions: list[Interaction], quizzes: list[QuizAttempt]) -> int:
        active_dates = {
            item.timestamp.date()
            for item in [*interactions, *quizzes]
            if getattr(item, "timestamp", None)
        }

        if not active_dates:
            return 0

        streak = 0
        current = max(active_dates)
        while current in active_dates:
            streak += 1
            current = date.fromordinal(current.toordinal() - 1)
        return streak
