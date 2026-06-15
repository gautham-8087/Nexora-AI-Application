# Nexora AI - Conversational Research & Search Platform

> **Search Smarter. Understand Deeper.**

Nexora AI is a SaaS-grade AI-powered research and search platform. Users can enter natural language queries and receive summarized research-backed answers with citation references.

---

## Technical Stack & Architecture

Nexora AI is designed using **Clean Architecture** principles and a modular service layer, keeping domain logic decoupled from external integrations.

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript, TSX
- **Search Engine**: SearXNG (Self-hosted via Docker)
- **Local LLM**: Ollama (Supporting Qwen3.6 / Qwen2.5 / cloud models)

```
/clone
  /backend
    /src
      /core
        /entities       # Core entity structures (SearchQueryRecord, ChatMessage)
        /interfaces     # Service provider interfaces (ISearch, IExtraction, ISummarize)
      /services         # Pluggable service implementations (SearXNG, Extraction, Ollama)
      /controllers      # Request mapping & validation
      /routes           # Route specifications (search, auth)
      app.ts            # Application configurations
      server.ts         # Server entry point
  /frontend
    /src
      /app              # Next.js 15 App Router views and layouts
      /components       # Reusable React components (Navbar, AuthModal, SearchBar, AnswerCard, etc.)
      /context          # React Context (SearchContext, ThemeContext)
      /types            # TypeScript declarations
  /searxng              # Local SearXNG settings override files
```

---

## Key Features

### 1. Conversational Prompt Branching (ChatGPT/Gemini/Claude Style)
- **Inline Prompt Editing**: Click the Pencil icon next to any user message to edit your query.
- **Path Forking & Branching**: Modifying a query splits the conversation history into a new branch. The backend clones the message history up to the edited point and queries new search results.
- **Version Pagination Selector**: Toggles sibling versions next to branched queries (e.g. `< 1 / 2 >`) to view alternative response trajectories in real-time.

### 2. Full-Stack User Authentication
- **Auth Modal Popup**: Complete interactive drawer for account Sign In and Sign Up.
- **Mock Token Session Persistence**: Restores user sessions via `localStorage` headers automatically.
- **Profile Menus**: Display account details and sign-out controls when active.

### 3. Live Web Search Scrapers (SearXNG)
- Integrates a self-hosted **SearXNG** Docker container to query and crawl live web citation references (URL links, site favicons, snippets, and page text).

### 4. Smart Web Snippet Synthesis Fallback
- If your local Ollama LLM is offline or downloading, the backend automatically compiles direct insights from SearXNG search result snippets into a custom markdown summary. You get real, accurate answers to your exact questions immediately.

---

## Backend APIs

### `POST /api/search`
Executes search, crawl extraction, and LLM summarization. Supports thread histories and prompt branching.
- **Request Body:**
  ```json
  {
    "query": "latest AI agent developments",
    "threadId": "optional-existing-thread-id",
    "editMessageIndex": 0 // optional to trigger branch
  }
  ```

### `POST /api/search/switch-path`
Switches active path index branch in a thread history.

### `POST /api/auth/register`
Registers a new user name, email, and password.

### `POST /api/auth/login`
Authenticates email and password credentials.

### `GET /api/auth/me`
Fetches active user profile from authorization Bearer header.

---

## Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- Docker Desktop (for running SearXNG)

### 1. Start SearXNG via Docker
Launch the self-hosted SearXNG search engine container with JSON format support:
```bash
docker run -d -p 8080:8080 --name searxng -v ./searxng:/etc/searxng searxng/searxng
```

### 2. Start the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   *The backend runs on port `5001`. Verification endpoints listen at `http://localhost:5001/api`.*

### 3. Connect Local LLM (Ollama)
1. Download Ollama from [ollama.com](https://ollama.com).
2. Start Ollama and download the model configured in your `.env` (defaults to `qwen3.6` / `qwen2.5`):
   ```bash
   ollama run qwen3.6
   ```

### 4. Start the Frontend Client
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   *The client boots on port `3000`. Navigate to `http://localhost:3000` to start searching.*

---

## Git Commit & Deploy Commands

Initialize and push local commits to your remote repository:
```bash
git remote add origin https://github.com/gautham-8087/Nexora-AI-Application.git
git push -u origin main
```
