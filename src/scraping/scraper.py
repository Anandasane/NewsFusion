import feedparser
import json

RSS_FEEDS = [
    "http://feeds.bbci.co.uk/news/rss.xml",
    "http://rss.cnn.com/rss/edition.rss"
]

def fetch_articles():
    articles = []

    for url in RSS_FEEDS:
        feed = feedparser.parse(url)

        for entry in feed.entries:
            # SAFELY extract summary/description
            summary = ""

            if "summary" in entry:
                summary = entry.summary
            elif "description" in entry:
                summary = entry.description
            else:
                summary = entry.title  # fallback

            articles.append({
                "title": entry.title if "title" in entry else "",
                "summary": summary,
                "link": entry.link if "link" in entry else ""
            })

    # Ensure data folder exists
    import os
    os.makedirs("data", exist_ok=True)

    with open("data/articles.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=4, ensure_ascii=False)

    print(f"✅ Saved {len(articles)} articles.")

if __name__ == "__main__":
    fetch_articles()

