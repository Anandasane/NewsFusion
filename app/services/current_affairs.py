from __future__ import annotations

from dataclasses import dataclass

from app.services.genai import generate_key_points, generate_summary

TOPIC_KEYWORDS = {
    "Polity": {"parliament", "election", "supreme", "constitution", "court", "law", "government"},
    "Economy": {"economy", "bank", "inflation", "trade", "market", "budget", "tax"},
    "Science & Tech": {"science", "technology", "ai", "space", "research", "chip", "digital"},
    "Environment": {"climate", "forest", "wildlife", "environment", "pollution", "rainfall", "energy"},
    "IR": {"india", "china", "us", "uk", "russia", "summit", "diplomatic", "international"},
}


@dataclass
class CurrentAffairsPack:
    article_id: int
    topic: str
    summary: str
    key_points: list[str]
    mcqs: list[dict]


class CurrentAffairsService:
    def classify_topic(self, article: dict) -> str:
        text = f"{article.get('title', '')} {article.get('summary', '')}".lower()
        best_topic = "Polity"
        best_score = -1

        for topic, keywords in TOPIC_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in text)
            if score > best_score:
                best_topic = topic
                best_score = score

        return best_topic if best_score > 0 else "Science & Tech"

    def build_current_affairs(self, article: dict) -> CurrentAffairsPack:
        topic = self.classify_topic(article)
        source_text = article.get("summary") or article.get("title") or ""
        summary = generate_summary(source_text)
        key_points = generate_key_points(source_text, max_points=4)
        mcqs = self._build_mcqs(article, topic, key_points)
        return CurrentAffairsPack(
            article_id=article["id"],
            topic=topic,
            summary=summary,
            key_points=key_points,
            mcqs=mcqs,
        )

    def _build_mcqs(self, article: dict, topic: str, key_points: list[str]) -> list[dict]:
        title = article.get("title", "this development")
        source = article.get("source", "news reports")
        published = article.get("published") or "recent reports"
        point = key_points[0] if key_points else article.get("summary", title)

        return [
            {
                "question": f"Which topic area best matches the article '{title[:70]}'?",
                "options": [
                    {"key": "A", "text": topic},
                    {"key": "B", "text": "Sports"},
                    {"key": "C", "text": "Art & Culture"},
                    {"key": "D", "text": "Geography"},
                ],
                "correct_answer": "A",
                "explanation": f"The article content aligns with {topic} based on its subject matter and keywords.",
                "topic": topic,
                "difficulty": "easy",
            },
            {
                "question": f"What is the most exam-relevant takeaway from this report by {source}?",
                "options": [
                    {"key": "A", "text": point[:120]},
                    {"key": "B", "text": "It is mainly about celebrity interviews."},
                    {"key": "C", "text": "It focuses only on sports fixtures."},
                    {"key": "D", "text": "It is a fictional editorial with no public impact."},
                ],
                "correct_answer": "A",
                "explanation": "The first option captures the core fact or consequence highlighted in the article.",
                "topic": topic,
                "difficulty": "medium",
            },
            {
                "question": f"When should aspirants place this event in revision notes?",
                "options": [
                    {"key": "A", "text": f"As part of {published} current affairs revision."},
                    {"key": "B", "text": "Only during ancient history preparation."},
                    {"key": "C", "text": "Only for sports current affairs."},
                    {"key": "D", "text": "It is not relevant for revision."},
                ],
                "correct_answer": "A",
                "explanation": "The report belongs in contemporary current affairs revision tied to its publication window.",
                "topic": topic,
                "difficulty": "medium",
            },
        ]
