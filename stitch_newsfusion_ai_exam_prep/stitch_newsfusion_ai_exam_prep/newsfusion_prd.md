# NewsFusion – MASTER PRD
(AI News + Current Affairs + Exam Prep Platform)

## 1. PRODUCT OVERVIEW
**Product Name:** NewsFusion  
**Type:** AI-Powered News + Current Affairs Learning Platform  
**Platform:** Web App (React + FastAPI)

### Objective
To build a production-ready intelligent system that:
* Recommends personalized news
* Converts news into exam-ready content
* Helps government exam aspirants (UPSC, SSC, Banking, etc.) prepare efficiently

### Product Vision
“Transform real-time news into structured knowledge, personalized learning, and exam-ready insights.”

## 2. TARGET USERS
* **Primary:** UPSC, MPSC, SSC, Banking aspirants
* **Secondary:** General news readers, Students

## 3. CORE MODULES
### MODULE 1: NEWS ENGINE
* RSS-based scraping
* Metadata extraction (Title, Summary, Link, Timestamp)

### MODULE 2: NLP PROCESSING
* Text cleaning, Stopword removal, TF-IDF / embeddings

### MODULE 3: RECOMMENDATION SYSTEM
* Hybrid Model: 0.7 × Content + 0.3 × User Behavior

### MODULE 4: USER MODELING
* Track Clicks, Likes, Saves, Quiz performance

### MODULE 5: TRENDING ENGINE
* Most viewed, Most liked, Time-decay ranking

### MODULE 6: CURRENT AFFAIRS ENGINE
* **AI Summary:** Short, exam-focused
* **Key Points:** Bullet-based facts
* **MCQ Generator:** 1 correct, 3 distractors + Explanation
* **Topic Classification:** Polity, Economy, Science & Tech, Environment, IR
* **Daily Digest:** Top 5 articles + MCQs
* **Quiz Mode:** Daily quiz with difficulty adaptation

### MODULE 7: ANALYTICS
* Accuracy %, Topic-wise performance, Weak/strong areas, Daily streak

### MODULE 8: NOTES SYSTEM
* Bookmarks, Save notes, Revision lists

### MODULE 9: PDF EXPORT
* Daily current affairs PDF (Summary, Key points, MCQs)

### MODULE 10: FRONTEND (REACT)
* **Pages:** Home Feed, Personalized Feed, Trending, Exam Prep Mode, Analytics Dashboard
* **UI Requirements:** Dark theme, Responsive, Smooth animations, Grid layout

## 4. TECH STACK
* **Frontend:** React + Vite + Tailwind
* **Backend:** FastAPI
* **ML/GenAI:** Scikit-learn, HuggingFace Transformers
* **Database:** SQLite → PostgreSQL

## 5. DESIGN REQUIREMENTS
* **Dark theme UI**
* **Card-based layout**
* **Quiz interface**
* **Dashboard with charts**
