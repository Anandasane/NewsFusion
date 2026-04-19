import json
import os
import re
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

def clean_text(text):
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)

    tokens = text.split()

    filtered = [
        word for word in tokens
        if word not in ENGLISH_STOP_WORDS and len(word) > 2
    ]

    return " ".join(filtered)

def preprocess():
    if not os.path.exists("data/articles.json"):
        print("❌ articles.json not found. Run scraper first.")
        return

    with open("data/articles.json", encoding="utf-8") as f:
        articles = json.load(f)

    for article in articles:
        article["cleaned"] = clean_text(article.get("summary", ""))

    with open("data/articles.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=4, ensure_ascii=False)

    print("✅ Preprocessing completed (NLTK removed).")

if __name__ == "__main__":
    preprocess()