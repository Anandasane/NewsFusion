import json
from sklearn.metrics.pairwise import cosine_similarity
from src.database.db import SessionLocal, UserInteraction

class HybridRecommender:
    def __init__(self, content_model):
        self.content_model = content_model

    def get_user_history(self, user_id):
        db = SessionLocal()
        interactions = db.query(UserInteraction).filter_by(user_id=user_id).all()
        db.close()
        return [i.article_id for i in interactions]

    def recommend(self, user_id, base_article_id, top_n=5):
        content_scores = cosine_similarity(
            self.content_model.matrix[base_article_id],
            self.content_model.matrix
        ).flatten()

        user_history = self.get_user_history(user_id)

        # Boost articles similar to user's past reads
        for article_id in user_history:
            content_scores += cosine_similarity(
                self.content_model.matrix[article_id],
                self.content_model.matrix
            ).flatten()

        similar_indices = content_scores.argsort()[-top_n-1:-1][::-1]

        return [self.content_model.articles[i] for i in similar_indices]