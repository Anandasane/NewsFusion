import json
import re
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    tokens = text.split()

    return " ".join([
        word for word in tokens
        if word not in ENGLISH_STOP_WORDS and len(word) > 2
    ])

def preprocess():
    with open("data/articles.json", encoding="utf-8") as f:
        articles = json.load(f)

    for a in articles:
        a["cleaned"] = clean_text(a.get("summary", ""))

    with open("data/articles.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=4)

    print("✅ Preprocessing done")

if __name__ == "__main__":
    preprocess()