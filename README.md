# 🚀 Multimodal AI Assistant — Enterprise Conversational Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.6.6-FF6F61?style=for-the-badge)](https://www.langchain.com/langgraph)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Latest-000000?style=for-the-badge)](https://ui.shadcn.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**Multimodal AI Assistant** is a high-performance, full-stack conversational intelligence platform inspired by enterprise AI workspace environments like ChatGPT and Google Gemini. Powered by a **Next.js 15 (Turbopack)** frontend with **Shadcn UI** components and a high-throughput **FastAPI** backend, it features NDJSON token streaming, stateful agentic workflows orchestrated via **LangGraph**, in-memory multi-format document ingestion (PPTX, DOCX, XLSX, PDF, Images, Code), and persistent thread checkpointing backed by **PostgreSQL**.

---

## 🖼️ Application Interface Gallery

### 1. Main Multimodal AI Architect Workspace
![Multimodal AI Architect Workspace](frontend/public/hero-dashboard-preview.png)

### 2. Document Analysis & Agentic Reasoning Chat Session
![Document Summary & Reasoning Chat](frontend/public/document-reasoning-chat.png)

### 3. Authentication & Access Portal
![Authentication Portal](frontend/public/login-auth-view.png)

---

## 🌟 Key Architectural Capabilities

- 📄 **Stateless In-Memory Multi-Format Ingestion**: Upload up to 10 files per message including **PowerPoint (`.pptx`)**, **Word (`.docx`)**, **Excel (`.xlsx`)**, **PDFs**, **Images (Vision)**, and **Source Code files**. Files are parsed directly in RAM via `io.BytesIO` and injected into the Gemini context window without disk I/O latency.
- ⚡ **Real-Time Event Streaming**: Asynchronous HTTP streaming using `StreamingResponse` and NDJSON event generators yields low-latency token streaming with instant cancellation handling.
- 🧠 **LangGraph Stateful Agent Architecture**:
  - **Thread-Level Checkpointing**: Stateful conversation tracking backed by `AsyncPostgresSaver` and connection pools (`psycopg_pool`).
  - **Automatic Context Summarization**: Automatically condenses thread history when messages exceed limits, preserving LLM context windows while keeping memory intact.
  - **Dual Model Selection**: Dynamically switch between **Standard Fast Model** and **Reasoning Deep Model** for step-by-step analytical reasoning.
- 🔐 **Cross-Origin Session Security & 1-Click Guest Trial**:
  - Stateful JWT authentication with bcrypt password hashing (`passlib`).
  - HTTP-Only `SameSite=None` secure cookie handling supporting cross-domain deployments (`vercel.app`).
  - **1-Click Guest Mode**: Instant trial access generating temporary UUID guest profiles without registration friction.
- 🎨 **Enterprise Dark Obsidian UI (Shadcn UI & Tailwind CSS v4)**:
  - Custom dark theme with cyan/slate accents and ambient lighting mesh.
  - **Official Shadcn UI Sidebar**: Icon rail collapsing (`collapsible="icon"`) with tooltips and zero layout shifts.
  - Custom Markdown renderer with Prism syntax highlighting for code blocks.

---

## 🏗️ High-Level System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER / CLIENT                           │
│                 (React 19 / Shadcn UI / Tailwind CSS v4)                │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTP-Only Cookies & SSE Streaming
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 15 FRONTEND APP ROUTER                      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Async NDJSON Event Stream
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND INFRASTRUCTURE                      │
│      (Auth Engine / PyPDF2 / Docx / PPTX / OpenPyXL Ingestion)         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Stateful Flow Dispatch
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   LANGGRAPH STATEGRAPH WORKFLOW                        │
│   (Conversation Node ➔ Tool Execution Node ➔ Summarizer Node)          │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │                               │
                   ▼                               ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│   POSTGRESQL DATABASE             │ │   GOOGLE GEMINI 2.0 FLASH API    │
│   (Async Checkpoint Saver Memory) │ │   (Multimodal LLM Inference)     │
└───────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 📊 Database Schema (PostgreSQL & SQLAlchemy)

```
+------------------------------------+        +------------------------------------+
|               User                 |        |               Chats                |
+------------------------------------+        +------------------------------------+
| id (PK, String/UUID)               |<------1| thread_id (PK, String/UUID)       |
| email (Unique, String)             |       | user_id (FK -> User.id)            |
| name (String, Nullable)            |        | chat_name (String)                 |
| hashed_password (String)           |        | created_at (Timestamp)             |
| created_at (Timestamp)             |        +------------------------------------+
+------------------------------------+                          |
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
├── backend/                          # FastAPI backend service
│   ├── src/
│   │   └── backend/
│   │       ├── main.py               # FastAPI application, streaming endpoints & LangGraph graph
│   │       ├── db.py                 # SQLAlchemy models (User, Chats) & PostgreSQL pool
│   │       └── service.py            # JWT authentication & user services
│   ├── pyproject.toml                # Build manifest
│   └── requirements.txt              # Backend dependencies
│
└── frontend/                         # Next.js 15 web application
    ├── src/
    │   ├── app/                      # Next.js App Router (auth pages, chat UI, API rewrites)
    │   └── components/               # Shadcn UI primitives, TopBar & Markdown renderer
    ├── public/                       # Screenshots & branding assets
    │   ├── hero-dashboard-preview.png# Main workspace screenshot
    │   ├── document-reasoning-chat.png# Document chat screenshot
    │   ├── login-auth-view.png       # Auth form screenshot
    │   └── logo.svg
    ├── package.json                  # Frontend dependencies
    └── next.config.ts                # Next.js configuration & API proxies
```

---

## 🛠️ Local Development Setup

### Prerequisites
- **Python**: `3.11+`
- **Node.js**: `18.x` or `20.x+`
- **Database**: Running PostgreSQL instance
- **API Key**: [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Backend Setup (FastAPI & LangGraph)

1. **Navigate to backend directory**:
   ```bash
   cd backend
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
   Create a `.env` file in `backend/`:
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key"
   GEMINI_MODEL="gemini-2.0-flash"
   DB_URI="postgresql://username:password@localhost:5432/your_database_name"
   ALLOWED_ORIGINS="http://localhost:3000"
   ```

5. **Start FastAPI Backend Engine**:
   ```bash
   uvicorn src.backend.main:app --reload --port 8000
   ```
   The backend runs at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup (Next.js 15)

1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in `frontend/`:
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
| `POST` | `/auth/signup` | Register user account with name, email, and password |
| `POST` | `/auth/login` | Authenticate user and receive HTTP-Only cookie |
| `GET` | `/guest_login` | Instant 1-click guest authentication session |
| `GET` | `/auth/logout` | Clear user cookies and terminate session |
| `POST` | `/new_chat_stream` | Initialize new thread, upload up to 10 files, stream AI response |
| `POST` | `/chat_stream` | Continue streaming message turn with optional file attachments |
| `GET` | `/all_chats` | Retrieve all chat history threads for user |
| `GET` | `/chat/history/{thread_id}` | Fetch full message history for specific thread |
| `GET` | `/rename_chat` | Rename chat thread title |
| `GET` | `/delete_chat` | Delete chat thread and associated data |
