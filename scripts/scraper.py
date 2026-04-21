import feedparser
import json
import os

RSS_FEEDS = [
    "http://feeds.bbci.co.uk/news/rss.xml",
    "http://rss.cnn.com/rss/edition.rss"
]

def fetch_articles():
    articles = []

    for url in RSS_FEEDS:
        feed = feedparser.parse(url)

        for entry in feed.entries:
            summary = entry.get("summary", entry.get("description", entry.get("title", "")))

            articles.append({
                "title": entry.get("title", ""),
                "summary": summary,
                "link": entry.get("link", "")
            })

    os.makedirs("data", exist_ok=True)

    with open("data/articles.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=4, ensure_ascii=False)

    print("✅ Articles scraped")

if __name__ == "__main__":
    fetch_articles()