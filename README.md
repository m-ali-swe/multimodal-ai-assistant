# 🚀 Multimodal AI Assistant — Full-Stack Conversational Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.6.6-FF6F61?style=for-the-badge)](https://www.langchain.com/langgraph)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)



---

## 🌟 Key Architectural Capabilities

- 📄 **Stateless In-Memory Document Ingestion**: Upload and query complex documents including **PDFs**, **Microsoft Word (`.docx`)**, **PowerPoint (`.pptx`)**, and **plain text files**. Binary streams are extracted in memory via `io.BytesIO` and injected directly into the Gemini prompt context without disk I/O latency.
- ⚡ **Real-Time Event Streaming**: Asynchronous HTTP streaming using `StreamingResponse` and NDJSON event generators yields low-latency, typewriter-style token streaming with instant client cancellation handling.
- 🧠 **LangGraph Stateful Agent Architecture**:
  - **Thread-Level Checkpointing**: Stateful conversation tracking backed by `AsyncPostgresSaver` and asynchronous connection pools (`psycopg_pool`).
  - **Automatic Context Summarization**: Automatically condenses earlier message turns once thread history exceeds 20 messages, pruning state via `RemoveMessage` primitives to preserve LLM token limits while keeping long-term memory intact.
  - **Agentic Tool Execution**: Dynamic node routing based on model tool calls (e.g. real-time web search integration).
- 🔐 **Cross-Origin Session Security & 1-Click Guest Trial**:
  - Stateful JWT authentication with bcrypt password hashing (`passlib`).
  - HTTP-Only `SameSite=None` secure cookie handling supporting cross-domain deployments (`vercel.app`).
  - **1-Click Guest Mode**: Generates temporary UUID guest profiles for instant trial access without registration friction.
- 🎨 **ChatGPT-Style Next.js 15 UI**:
  - Responsive dark-mode interface built with Next.js 15 App Router, React 19, and Tailwind CSS v4.
  - Full Markdown rendering (`react-markdown`) with syntax highlighting (`react-syntax-highlighter`) for code blocks.
  - Dynamic sidebar for managing active threads (create, rename, delete, switch histories).

---

## 🏗️ High-Level System Architecture

The platform separates frontend user experience from agent execution, enabling independent scaling of the Next.js presentation layer and the FastAPI LangGraph execution engine.

```mermaid
graph TD
    UserClient["🌐 User Browser"] <-->|HTTP-Only Cookies & CORS| NextFrontend["Frontend (Next.js 15 App Router + React 19)"]
    NextFrontend <-->|Streaming SSE / NDJSON Event Stream| FastAPIEngine["Backend Engine (FastAPI + Uvicorn)"]

    subgraph FastAPI Backend Architecture ["⚡ FastAPI Backend Infrastructure"]
        FastAPIEngine --> AuthModule["Auth & Cookie Service (JWT + Passlib)"]
        FastAPIEngine --> FileParser["Document Parsing Engine (PyPDF2 / Docx / PPTX)"]
        FastAPIEngine --> LangGraphCore["LangGraph StateGraph Engine"]

        subgraph LangGraph Nodes ["🧠 LangGraph Execution Pipeline"]
            LangGraphCore --> CallModelNode["Conversation Node (Call Model)"]
            CallModelNode --> ConditionalRoute{"Should Continue?"}
            ConditionalRoute -->|Tool Call| ToolNode["Tool Execution Node (Web Search)"]
            ConditionalRoute -->|> 20 Messages| SummarizeNode["Summarizer Node (RemoveMessage)"]
            ToolNode --> CallModelNode
            SummarizeNode --> EndNode["End Node"]
        end
    end

    LangGraphCore <-->|Async Checkpoint Saver| PostgresDB[("PostgreSQL Database\n(User Sessions & Thread States)")]
    CallModelNode <-->|LangChain API| GeminiAPI["Google Gemini 3.5 Flash API"]
```

---

## ⚡ Engineering Challenges & Technical Solutions

### 1. Low-Latency NDJSON Token Streaming with Client Cancellation
* **Challenge**: Standard HTTP response buffering delays AI responses until the entire model output is generated, causing poor UX during long explanations.
* **Solution**: Implemented an async event generator wrapped in FastAPI's `StreamingResponse(media_type="application/x-ndjson")`. The server streams JSON event chunks (`{"type": "content", "response": "..."}`) using LangGraph's `astream_events(version="v2")`. Client disconnects trigger an `asyncio.CancelledError` handler to gracefully abort active Gemini API calls and prevent background resource leaks.

### 2. Context Window Optimization via LangGraph Message Pruning
* **Challenge**: Extended chat sessions accumulate high token counts, exceeding context windows and increasing LLM API costs.
* **Solution**: Designed a conditional routing node `should_continue` inside the LangGraph workflow. When thread length exceeds 20 messages, execution automatically diverts to a `summarize_conversation` node. The node invokes Gemini to generate a concise summary of prior context, prepends the summary as a `SystemMessage`, and emits `RemoveMessage` instructions to prune historical messages from PostgreSQL memory while preserving conversation context.

### 3. In-Memory Document Ingestion without Disk I/O Bottlenecks
* **Challenge**: Uploading large multi-format files (PDF, Word, PPTX) to server disk drives creates I/O bottlenecks and file system cleanup requirements in serverless or containerized environments.
* **Solution**: Developed an in-memory document parsing engine (`process_files`). Incoming `UploadFile` streams are processed directly in RAM via `io.BytesIO`. `PyPDF2`, `python-docx`, and `python-pptx` extract text elements synchronously, formatting extracted text blocks into structured prompt parts that are appended directly to the `HumanMessage` payload.

### 4. Cross-Origin HTTP-Only Cookie Authentication
* **Challenge**: Browsers block third-party authentication cookies across separate frontend (`vercel.app`) and backend origins.
* **Solution**: Standardized JWT session token delivery using `JSONResponse.set_cookie()` with `httponly=True`, `secure=True`, and `samesite="none"`. Configured FastAPI `CORSMiddleware` with explicit `allow_origins` parsing, enabling seamless cookie persistence across cross-domain environments.

---

## 📊 Database & Payload Schemas

### Relational Schema (PostgreSQL & SQLAlchemy)

```
+------------------------------------+        +------------------------------------+
|               User                 |        |               Chats                |
+------------------------------------+        +------------------------------------+
| id (PK, String/UUID)               |<------1| thread_id (PK, String/UUID)       |
| email (Unique, String)             |       | user_id (FK -> User.id)            |
| hashed_password (String)           |        | chat_name (String)                 |
| created_at (Timestamp)             |        | created_at (Timestamp)             |
+------------------------------------+        +------------------------------------+
                                                                |
                                                                | 1:N
                                                                v
                                              +------------------------------------+
                                              |       checkpoints (LangGraph)      |
                                              +------------------------------------+
                                              | thread_id (String)                 |
                                              | checkpoint_id (String)             |
                                              | parent_checkpoint_id (String)      |
                                              | type (String)                      |
                                              | checkpoint (Bytea/JSONB)           |
                                              +------------------------------------+
```

---

## 📁 Repository Structure

```
multimodal-ai-assistant/
├── chatbot_backend/                  # FastAPI backend service
│   ├── src/
│   │   └── chatbot_backend/
│   │       ├── main.py               # FastAPI application, streaming endpoints & LangGraph workflow
│   │       ├── db.py                 # SQLAlchemy models, PostgreSQL pool & session generator
│   │       └── service.py            # JWT generation, password hashing & user services
│   ├── pyproject.toml                # Dependencies & build manifest (uv / hatchling)
│   ├── requirements.txt              # Backend requirements manifest
│   └── .env.example                  # Backend environment variable template
│
└── chatbot_frontend/                 # Next.js 15 web application
    ├── src/
    │   ├── app/                      # Next.js App Router (auth pages, chat UI, API clients)
    │   └── components/               # UI components & Markdown parsers
    ├── package.json                  # Dependencies & npm scripts
    └── next.config.ts                # Next.js configuration
```

---

## 🛠️ Local Development & Deployment Setup

### Prerequisites
- **Python**: `3.11+`
- **Node.js**: `18.x` or `20.x+`
- **Database**: Running PostgreSQL instance
- **API Key**: [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Backend Setup (FastAPI & LangGraph)

1. **Navigate to backend directory**:
   ```bash
   cd chatbot_backend
   ```

2. **Create & activate virtual environment**:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in `chatbot_backend/` based on `.env.example`:
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key"
   GEMINI_MODEL="gemini-2.0-flash"
   DB_URI="postgresql://username:password@localhost:5432/your_database_name"
   ALLOWED_ORIGINS="http://localhost:3000"
   ```

5. **Start FastAPI Backend Engine**:
   ```bash
   uvicorn src.chatbot_backend.main:app --reload --port 8000
   ```
   The backend API will run at `http://localhost:8000`. API documentation at `http://localhost:8000/docs`.

---

### 2. Frontend Setup (Next.js 15)

1. **Navigate to frontend directory**:
   ```bash
   cd ../chatbot_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in `chatbot_frontend/`:
   ```env
   NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
   ```

4. **Start Next.js Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Reference Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register a new user account with hashed password |
| `POST` | `/auth/login` | Authenticate user and receive HTTP-Only cookie |
| `GET` | `/guest_login` | Instant 1-click guest authentication session |
| `GET` | `/auth/logout` | Clear user cookies and end session |
| `POST` | `/new_chat_stream` | Initialize a new chat thread, upload files, and stream response |
| `POST` | `/chat_stream` | Continue existing thread streaming with optional attachments |
| `GET` | `/all_chats` | Retrieve all chat history threads for authenticated user |
| `GET` | `/chat/history/{thread_id}` | Fetch full message history for a specific thread |
| `GET` | `/rename_chat` | Rename a chat thread title |
| `GET` | `/delete_chat` | Delete a chat thread and associated data |
