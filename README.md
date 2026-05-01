# ⚡ Lumina — AI-Powered Search Engine

> A Perplexity AI clone built with React + Flask + Claude AI + SerpAPI

![Lumina](https://img.shields.io/badge/AI-Claude%20Sonnet-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Flask-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 🗂 Project Structure

```
lumina/
├── frontend/                   # React.js app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── MessageBubble.jsx   # Chat bubbles with markdown
│   │   │   ├── SearchBar.jsx       # Input with suggestions
│   │   │   ├── SourcesPanel.jsx    # Cited sources grid
│   │   │   ├── Sidebar.jsx         # History sidebar
│   │   │   ├── ThinkingDots.jsx    # Loading animation
│   │   │   └── HeroEmpty.jsx       # Landing state
│   │   ├── hooks/
│   │   │   └── useSearch.js        # Search state + API calls
│   │   ├── utils/
│   │   │   └── api.js              # Axios API client
│   │   ├── styles/
│   │   │   └── globals.css         # Custom fonts + animations
│   │   ├── App.jsx                 # Root component
│   │   └── index.js
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── package.json
│
├── backend/                    # Flask API server
│   ├── app.py                  # Main Flask app
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🧠 AI Answers | Claude Sonnet with full reasoning |
| 🌐 Live Web Search | SerpAPI — top 6 Google results |
| 📎 Citations | Numbered inline source references |
| 💬 Chat History | Multi-turn conversation context |
| 🌙 Dark/Light Mode | Persisted to localStorage |
| 📋 Copy Answers | One-click clipboard copy |
| 🔍 Follow-up Questions | Full conversational context |
| 📱 Responsive | Mobile + desktop |

---

## 🚀 Quick Start (Local Dev)

### Step 1 — Clone

```bash
git clone https://github.com/your-username/lumina.git
cd lumina
```

### Step 2 — Backend Setup

```bash
cd backend

# Copy env file and fill in your keys
cp .env.example .env

# Install dependencies
pip install -r requirements.txt

# Start Flask dev server
python app.py
# Server runs at http://localhost:5000
```

### Step 3 — Frontend Setup

```bash
cd frontend

# Copy env file
cp .env.example .env
# Edit REACT_APP_API_URL=http://localhost:5000

# Install dependencies
npm install

# Start React dev server
npm start
# App runs at http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
ANTHROPIC_API_KEY=sk-ant-...        # https://console.anthropic.com
SERPAPI_KEY=...                     # https://serpapi.com/manage-api-key
FLASK_ENV=development
PORT=5000
```

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/search` | Main search — returns answer + sources |
| GET | `/api/conversations` | List recent conversations |
| GET | `/api/conversation/:id` | Get single conversation |
| DELETE | `/api/conversation/:id` | Delete conversation |
| GET | `/api/health` | Health check |

### POST `/api/search` — Request

```json
{
  "query": "What is quantum entanglement?",
  "conversation_id": "optional-uuid-for-follow-ups"
}
```

### POST `/api/search` — Response

```json
{
  "answer": "Quantum entanglement is... [1][2]",
  "sources": [
    {
      "title": "Quantum Entanglement Explained",
      "link": "https://example.com/quantum",
      "snippet": "Brief description...",
      "source": "example.com"
    }
  ],
  "conversation_id": "abc-123",
  "timestamp": "2024-11-10T12:00:00Z"
}
```

---

## ☁️ Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend

# Edit vercel.json — update backend URL
# "destination": "https://YOUR-BACKEND.onrender.com/api/$1"

# Deploy
vercel --prod
```

Set these env vars in Vercel dashboard:
- `REACT_APP_API_URL` = your Render backend URL

---

### Backend → Render

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo → select `backend/` as root
4. Settings:
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2`
5. Add env vars:
   - `ANTHROPIC_API_KEY`
   - `SERPAPI_KEY`
   - `FLASK_ENV=production`

---

### Docker (Optional)

```bash
# Build and run both services
docker-compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 🏗 Architecture

```
User → React Frontend
         ↓ POST /api/search
       Flask Backend
         ├── SerpAPI → Google Search Results (top 6)
         └── Anthropic API (Claude Sonnet)
              ↑ System prompt includes search snippets
              ↑ Full conversation history
              → Cited, markdown answer
         ↓
       { answer, sources, conversation_id }
         ↓
       React renders markdown + sources grid
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Markdown | react-markdown + remark-gfm |
| HTTP | Axios |
| Backend | Python Flask, Flask-CORS |
| AI | Anthropic Claude Sonnet |
| Search | SerpAPI (Google) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🔧 Customization

### Switch AI model

In `backend/app.py`:
```python
model="claude-sonnet-4-20250514"  # Change to claude-opus-4 for more power
```

### Change number of search results

```python
"num": 6,  # In search_web() — increase up to 10
```

### Add persistent database

Replace the in-memory `conversations` dict with MongoDB:

```python
from pymongo import MongoClient
client = MongoClient(os.getenv("MONGO_URI"))
db = client.lumina
conversations_col = db.conversations
```

---

## 🧪 Testing the API

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the latest news in AI?"}'
```

---

## 📝 License

MIT — free to use and modify.

---

Built with ❤️ using Claude AI
