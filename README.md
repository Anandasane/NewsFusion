# NewsFusion

NewsFusion is a production-style AI news and current affairs platform for exam aspirants. It combines RSS-backed news ingestion, TF-IDF recommendation, exam-focused current affairs generation, adaptive quiz flows, analytics, notes, and PDF export in a React + FastAPI stack.

## What is included

- Hybrid recommendation engine: `0.7 * content + 0.3 * user behavior`
- Current affairs engine: summary, key points, MCQs, explanations, topic classification
- Trending engine with engagement scoring and safe cold-start fallback
- Quiz mode with adaptive difficulty and score tracking
- Analytics dashboard for interactions, quiz accuracy, streak, and topic mastery
- Notes support and daily digest PDF export
- Windows-friendly local setup with SQLite by default and PostgreSQL-ready config

## Folder structure

```text
newsfusion/
|-- app/
|   |-- api/
|   |   |-- main.py
|   |   |-- routes.py
|   |   `-- schemas.py
|   |-- core/
|   |   `-- config.py
|   |-- db/
|   |   `-- db.py
|   `-- services/
|       |-- analytics.py
|       |-- current_affairs.py
|       |-- data_loader.py
|       |-- genai.py
|       |-- pdf_export.py
|       |-- quiz.py
|       |-- recommender.py
|       `-- trending.py
|-- data/
|   `-- articles.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|-- .env.example
|-- main.py
`-- requirements.txt
```

## Backend endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/` | GET | Health check |
| `/health` | GET | Health check alias |
| `/articles` | GET | List stored articles |
| `/recommend/{user_id}/{article_id}` | GET | Personalized feed |
| `/interact` | POST | Track click, like, save |
| `/trending` | GET | Trending stories |
| `/current-affairs/{article_id}` | GET | Summary, key points, MCQs |
| `/daily-digest` | GET | Daily revision digest |
| `/quiz/{user_id}` | GET | Adaptive quiz |
| `/quiz/submit` | POST | Evaluate quiz answers |
| `/user-stats/{user_id}` | GET | Analytics dashboard data |
| `/notes/{user_id}` | GET | User notes |
| `/notes` | POST | Create or update notes |
| `/export/pdf/{user_id}` | GET | Download digest PDF |

## Local setup on Windows

### Backend

```powershell
cd "d:\machine learning\NewsFusion\newsfusion"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.api.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```powershell
cd "d:\machine learning\NewsFusion\newsfusion\frontend"
npm install
npm run dev
```

Open `http://localhost:4173`.

## Environment variables

```env
DATABASE_URL=sqlite:///news.db
CORS_ORIGINS=http://localhost:4173,http://127.0.0.1:4173
HF_SUMMARY_MODEL=sshleifer/distilbart-cnn-12-6
ENABLE_TRANSFORMERS=false
```

`ENABLE_TRANSFORMERS=false` keeps summarization lightweight and CPU-safe. Turn it on only if you want to load a local Hugging Face summarizer.

## Deployment guide

### Frontend

- Deploy `frontend/` to Vercel.
- Set the API base URL in the frontend service layer if your backend is hosted elsewhere.

### Backend

- Deploy FastAPI to Render, Railway, or another Python host.
- Switch `DATABASE_URL` to PostgreSQL for production.
- Allow your deployed frontend domain in `CORS_ORIGINS`.

## Final presentation line

NewsFusion is a production-ready AI-powered news and current affairs platform that combines recommendation systems, GenAI, and adaptive learning to deliver personalized exam preparation.
