from fastapi import FastAPI
from src.models.content_model import ContentRecommender
from src.models.hybrid_model import HybridRecommender
from src.database.db import init_db, SessionLocal, UserInteraction

app = FastAPI()

# Initialize DB
init_db()

content_model = ContentRecommender()
hybrid_model = HybridRecommender(content_model)

@app.get("/")
def home():
    return {"message": "News Recommendation API running"}

@app.post("/interact")
def interact(user_id: str, article_id: int):
    db = SessionLocal()
    interaction = UserInteraction(user_id=user_id, article_id=article_id)
    db.add(interaction)
    db.commit()
    db.close()

    return {"message": "Interaction stored"}

@app.get("/recommend/{user_id}/{article_id}")
def recommend(user_id: str, article_id: int):
    recs = hybrid_model.recommend(user_id, article_id)
    return {"recommendations": recs}