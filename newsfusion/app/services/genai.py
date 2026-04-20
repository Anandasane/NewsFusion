from __future__ import annotations

import re
from functools import lru_cache

from app.core.config import settings

_SUMMARIZER_LOAD_ERROR = None


@lru_cache(maxsize=1)
def get_optional_summarizer():
    global _SUMMARIZER_LOAD_ERROR

    if not settings.enable_transformers:
        return None

    try:
        from transformers import pipeline

        return pipeline(
            "summarization",
            model=settings.hf_summary_model,
            device=-1,
        )
    except Exception as exc:
        _SUMMARIZER_LOAD_ERROR = str(exc)
        return None


def _sentences(text: str) -> list[str]:
    chunks = re.split(r"(?<=[.!?])\s+", text.strip())
    return [chunk.strip() for chunk in chunks if chunk.strip()]


def generate_summary(text: str) -> str:
    if not text:
        return ""

    stripped = text.strip()
    if len(stripped) < 80:
        return stripped

    summarizer = get_optional_summarizer()
    if summarizer is not None:
        try:
            result = summarizer(stripped[:1200], max_length=90, min_length=35, do_sample=False)
            summary = result[0]["summary_text"].strip()
            if summary:
                return summary
        except Exception:
            pass

    sentences = _sentences(stripped)
    if not sentences:
        return stripped[:220]

    return " ".join(sentences[:2])[:280]


def generate_key_points(text: str, max_points: int = 4) -> list[str]:
    if not text:
        return []

    sentences = _sentences(text)
    if sentences:
        return [sentence[:180] for sentence in sentences[:max_points]]

    segments = [segment.strip() for segment in text.split(",") if segment.strip()]
    return segments[:max_points]
