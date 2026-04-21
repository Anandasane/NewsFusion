from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ActionType(str, Enum):
    click = "click"
    like = "like"
    save = "save"


class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    summary: str
    link: str
    source: Optional[str] = None
    published: Optional[str] = None
    cleaned: str


class RecommendationResponse(ArticleResponse):
    score: float
    ai_summary: str


class KeyPointResponse(BaseModel):
    point: str


class McqOptionResponse(BaseModel):
    key: str
    text: str


class McqResponse(BaseModel):
    question: str
    options: list[McqOptionResponse]
    correct_answer: str
    explanation: str
    topic: str
    difficulty: str


class CurrentAffairsResponse(BaseModel):
    article_id: int
    topic: str
    summary: str
    key_points: list[str]
    mcqs: list[McqResponse]


class DailyDigestItemResponse(BaseModel):
    article: ArticleResponse
    current_affairs: CurrentAffairsResponse


class DailyDigestResponse(BaseModel):
    generated_at: datetime
    items: list[DailyDigestItemResponse]


class InteractionRequest(BaseModel):
    user_id: str = Field(..., min_length=2, max_length=64)
    article_id: int = Field(..., ge=0)
    action: ActionType


class TrendingResponse(ArticleResponse):
    score: float
    views: int
    likes: int
    saves: int
    last_interaction: datetime


class QuizQuestionResponse(BaseModel):
    article_id: int
    question: str
    options: list[McqOptionResponse]
    topic: str
    difficulty: str


class QuizResponse(BaseModel):
    user_id: str
    generated_at: datetime
    recommended_difficulty: str
    questions: list[QuizQuestionResponse]


class QuizAnswerRequest(BaseModel):
    article_id: int
    selected_answer: str = Field(..., min_length=1, max_length=1)


class QuizSubmitRequest(BaseModel):
    user_id: str = Field(..., min_length=2, max_length=64)
    answers: list[QuizAnswerRequest]


class QuizResultItemResponse(BaseModel):
    article_id: int
    selected_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str
    topic: str


class QuizSubmitResponse(BaseModel):
    score: int
    total_questions: int
    accuracy: float
    difficulty: str
    results: list[QuizResultItemResponse]


class TopicPerformanceResponse(BaseModel):
    topic: str
    accuracy: float
    attempts: int


class UserStatsResponse(BaseModel):
    user_id: str
    total_interactions: int
    clicks: int
    likes: int
    saves: int
    quizzes_taken: int
    average_accuracy: float
    streak_days: int
    strongest_topic: str
    weakest_topic: str
    topic_performance: list[TopicPerformanceResponse]


class NoteRequest(BaseModel):
    user_id: str = Field(..., min_length=2, max_length=64)
    article_id: int = Field(..., ge=0)
    note: str = Field(..., min_length=1, max_length=2000)


class NoteResponse(BaseModel):
    id: int
    user_id: str
    article_id: int
    note: str
    created_at: datetime
    updated_at: datetime
