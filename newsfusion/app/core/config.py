from pathlib import Path

from pydantic_settings import BaseSettings

ROOT_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    database_url: str = "sqlite:///news.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    hf_summary_model: str = "sshleifer/distilbart-cnn-12-6"
    enable_transformers: bool = False
    api_prefix: str = "/api"
    default_recommendation_count: int = 6

    class Config:
        env_file = ROOT_DIR / ".env"
        env_file_encoding = "utf-8"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
