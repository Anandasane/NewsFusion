from fastapi import FastAPI
from src.models.content_model import ContentRecommender

app = FastAPI()
model = ContentRecommender()

@app.get("/")
def home():
    return {"message": "News Recommendation API running"}

@app.get("/recommend/{article_id}")
def recommend(article_id: int):
    recs = model.recommend(article_id)
    return {"recommendations": recs}