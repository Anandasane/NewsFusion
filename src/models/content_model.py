import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ContentRecommender:
    def __init__(self):
        with open("data/articles.json") as f:
            self.articles = json.load(f)

        self.texts = [a["cleaned"] for a in self.articles]

        self.vectorizer = TfidfVectorizer()
        self.matrix = self.vectorizer.fit_transform(self.texts)

    def recommend(self, index, top_n=5):
        similarity = cosine_similarity(self.matrix[index], self.matrix).flatten()
        similar_indices = similarity.argsort()[-top_n-1:-1][::-1]

        return [self.articles[i] for i in similar_indices]