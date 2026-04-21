from pathlib import Path
from typing import List, Optional

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.db.db import SessionLocal, Interaction
from app.services.data_loader import ArticleStore

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data" / "articles.json"

class Recommender:

    def __init__(self):
        self.store = ArticleStore(DATA_PATH)
        self.articles = self.store.articles
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=2500)
        self.matrix = self.vectorizer.fit_transform([a["cleaned"] for a in self.articles])

    def get_article(self, article_id: int) -> Optional[dict]:
        return self.store.get_article(article_id)

    def _load_user_history(self, user_id: str) -> List[Interaction]:
        db = SessionLocal()
        interactions = db.query(Interaction).filter(Interaction.user_id == user_id).all()
        db.close()
        return interactions

    def _build_user_profile(self, interactions: List[Interaction]) -> Optional[np.ndarray]:
        if not interactions:
            return None

        weighted_ids: list[int] = []
        weights = {"click": 1, "like": 2, "save": 3}
        for interaction in interactions:
            if 0 <= interaction.article_id < len(self.articles):
                weighted_ids.extend([interaction.article_id] * weights.get(interaction.action, 1))

        article_ids = weighted_ids
        if not article_ids:
            return None

        texts = [self.articles[article_id]["cleaned"] for article_id in article_ids]
        combined_text = " ".join(texts)
        return self.vectorizer.transform([combined_text])

    def recommend(self, user_id: str, base_id: int, count: int = 6):
        if base_id < 0 or base_id >= len(self.articles):
            base_id = 0

        base_vector = self.matrix[base_id]
        content_similarity = cosine_similarity(base_vector, self.matrix).flatten()

        interactions = self._load_user_history(user_id)
        profile_vector = self._build_user_profile(interactions)
        user_similarity = cosine_similarity(profile_vector, self.matrix).flatten() if profile_vector is not None else np.zeros_like(content_similarity)

        scores = 0.7 * content_similarity + 0.3 * user_similarity
        if float(scores.max()) <= 0:
            return self._fallback_articles(base_id=base_id, count=count)

        ranked = np.argsort(scores)[::-1]

        recommendations = []
        for idx in ranked:
            if idx == base_id:
                continue
            article = dict(self.articles[idx])
            article["score"] = float(round(scores[idx], 5))
            recommendations.append(article)
            if len(recommendations) >= count:
                break

        return recommendations

    def get_personalized_or_trending(self, user_id: str, base_id: int, count: int = 6) -> list[dict]:
        interactions = self._load_user_history(user_id)
        if interactions:
            return self.recommend(user_id=user_id, base_id=base_id, count=count)

        return self._fallback_articles(base_id=base_id, count=count)

    def _fallback_articles(self, base_id: int, count: int) -> list[dict]:
        fallback = []
        for article in self.articles:
            if article["id"] == base_id:
                continue
            item = dict(article)
            item["score"] = 0.0
            fallback.append(item)
            if len(fallback) >= count:
                break
        return fallback

    def get_articles(self):
        return self.store.get_all_articles()
