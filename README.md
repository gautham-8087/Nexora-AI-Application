# Nexora AI - Conversational Research & Search Platform

> **Search Smarter. Understand Deeper.**

Nexora AI is a SaaS-grade AI-powered research and search platform. Users can enter natural language queries and receive summarized research-backed answers with citation references.

---

## Architecture Overview

Nexora AI is designed using **Clean Architecture** principles and a modular service layer, keeping domain logic decoupled from external integrations.

```
/clone
  /backend
    /src
      /core
        /entities       # Core entity structures (SearchQueryRecord, SourceReference)
        /interfaces     # Service provider interfaces (ISearch, IExtraction, ISummarize)
      /services         # Pluggable service implementations (Search, Extraction, Summarize)
      /controllers      # Request mapping & validation
      /routes           # Route specifications
      app.ts            # Application configurations
      server.ts         # Server entry point
  /frontend
    /src
      /app              # Next.js 15 App Router views and layouts
      /components       # Reusable React components (Navbar, SearchBar, AnswerCard, etc.)
      /context          # React Context (SearchContext, ThemeContext)
      /types            # TypeScript declarations
```

### Pluggable Integration Architecture
The backend isolates third-party API dependencies inside the `src/services` folder using abstract core interfaces:
- **`ISearchService`**: Abstract search indexer. Currently simulates web searches (easily pluggable for **SearXNG** later).
- **`IExtractionService`**: Abstract page content reader. Currently simulates HTML body crawlers (easily pluggable for **Firecrawl** later).
- **`ISummarizationService`**: Abstract LLM response generator. Currently synthesizes structured answers with citation tags (easily pluggable for **Ollama** later).

---

## Backend APIs

### `POST /api/search`
Executes search, crawl extraction, and LLM summarization.
- **Request Body:**
  ```json
  {
    "query": "latest AI agent developments"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "nex_1781498800000_abc123",
    "query": "latest AI agent developments",
    "answer": "### Recent Milestones in AI Agent Orchestration...",
    "sources": [
      {
        "title": "State of AI Agents: 2026 Developer Survey",
        "url": "https://nexora.ai/research/state-of-ai-agents-2026",
        "snippet": "Recent industry telemetry reports..."
      }
    ],
    "relatedQuestions": [
      "What are autonomous AI agents?",
      "How do AI agents work?"
    ],
    "stats": {
      "searchTime": 250,
      "resultsCount": 4
    },
    "createdAt": "2026-06-15T04:39:19.000Z"
  }
  ```

### `GET /api/history`
Retrieves a list of recent research threads.

### `GET /api/search/:id`
Retrieves the details of a specific thread by ID.

---

## Frontend Features

- **Next.js 15 & React:** Utilizes TypeScript, modern App Router architecture, and strict typing.
- **Framer Motion:** Smooth sliding transitions for thread history draw drawers and spring physics for the theme switch toggle.
- **Tailwind CSS v4.0:** Clean dark design system featuring custom Outfit and Inter typography and glassmorphic card borders.
- **Interactive Citations:** Clicking inline citation indexes (e.g. `[1]`) triggers spring scrolling and highlights the referenced web source card.
- **Robust Theme Control:** Restructures dark/light modes using class toggles on the document element, cached in localStorage to prevent hydration flicker.

---

## Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend API
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
   *The backend will boot on port `5001`. Verification endpoints will be listening at `http://localhost:5001/api`.*

### 2. Start the Frontend Client
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the client development server:
   ```bash
   npm run dev
   ```
   *The client will boot on port `3000`. Navigate to `http://localhost:3000` to interact with the search engine dashboard.*
