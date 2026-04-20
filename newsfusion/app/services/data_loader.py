import json
import re
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS


def clean_text(text: str) -> str:
    if not text:
        return ""

    normalized = text.lower()
    normalized = re.sub(r"https?://\S+", " ", normalized)
    normalized = re.sub(r"[^a-z0-9\s]", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized).strip()

    tokens = [token for token in normalized.split() if token not in ENGLISH_STOP_WORDS]
    return " ".join(tokens)


def normalize_source(link: str) -> str:
    try:
        parsed = urlparse(link)
        host = parsed.netloc.lower().replace("www.", "")
        return host or "unknown"
    except Exception:
        return "unknown"


class ArticleStore:
    def __init__(self, path: Path):
        self.path = Path(path)
        self.articles = self._load_articles()

    def _load_articles(self) -> list[dict[str, Any]]:
        if not self.path.exists():
            raise FileNotFoundError(f"Article dataset not found: {self.path}")

        with self.path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)

        articles = []
        seen_links: set[str] = set()
        for idx, item in enumerate(data):
            title = item.get("title", "")
            summary = item.get("summary", "") or title
            link = item.get("link", "")
            published = item.get("published", item.get("updated", ""))
            source = item.get("source", normalize_source(link))

            if not title and not summary:
                continue

            dedupe_key = (link or title).strip().lower()
            if dedupe_key in seen_links:
                continue
            seen_links.add(dedupe_key)

            cleaned = item.get("cleaned") or clean_text(f"{title} {summary}")
            if not cleaned:
                continue

            articles.append(
                {
                    "id": len(articles),
                    "title": title,
                    "summary": summary,
                    "link": link,
                    "source": source,
                    "published": published,
                    "cleaned": cleaned,
                }
            )
        return articles

    def get_article(self, article_id: int) -> dict[str, Any]:
        return next((item for item in self.articles if item["id"] == article_id), None)

    def get_all_articles(self) -> list[dict[str, Any]]:
        return self.articles
