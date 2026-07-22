# 🚀 Multimodal AI Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.6.6-FF6F61?style=for-the-badge)](https://www.langchain.com/langgraph)
[![Gemini 2.0](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

A full-stack, enterprise-grade **Multimodal AI Chat Assistant** inspired by ChatGPT and Google Gemini. Built with a modern **Next.js 15** frontend and a robust **FastAPI** backend, it features real-time NDJSON token streaming, stateful agent workflows powered by **LangGraph**, document parsing capabilities (PDF, DOCX, PPTX, TXT), and persistent database checkpointing via **PostgreSQL**.

---

## 🌟 Key Features

- 🖼️ **Multimodal & Document Processing**: Upload and query complex documents including **PDFs**, **Microsoft Word (`.docx`)**, **PowerPoint (`.pptx`)**, and **plain text files**. Text is extracted on the fly and injected seamlessly into the Gemini prompt context.
- ⚡ **Real-Time Token Streaming**: High-performance Server-Sent Event (NDJSON) streaming yields immediate typewriter-style responses with zero noticeable latency.
- 🧠 **LangGraph Stateful Agent Architecture**:
  - **Context-Aware Memory**: Persistent state tracking across user sessions using thread identifiers.
  - **Automated Conversation Summarization**: Automatically condenses earlier message turns once conversation length exceeds 20 messages, preventing context window limits while preserving key chat details.
  - **Tool Binding & Execution**: Integrated agentic capabilities with web search and custom function calling nodes.
- 💾 **PostgreSQL Async Checkpointing**: Uses `AsyncPostgresSaver` and asynchronous connection pools (`psycopg3`) to store graph checkpoints directly in database tables.
- 🔐 **Secure Authentication & Session Management**:
  - Custom JWT-based authentication (`python-jose`) with bcrypt password hashing (`passlib`).
  - Secure HTTP-Only cookie handling across cross-origin environments.
  - **1-Click Guest Login**: Instant trial mode access for guest users without requiring formal account creation.
- 🎨 **Modern ChatGPT-Style Responsive UI**:
  - Sleek dark-mode interface built with Next.js 15 (App Router), React 19, and Tailwind CSS v4.
  - Markdown parsing (`react-markdown`) with syntax highlighting (`react-syntax-highlighter`) for code blocks.
  - Sidebar for chat history management (create, rename, delete, switch threads).

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User / Browser]) <-->|HTTP / Cookie Auth| Frontend[Next.js 15 App Router]
    Frontend <-->|Streaming SSE / NDJSON| Backend[FastAPI Backend Engine]
    
    subgraph FastAPI Backend
        AuthService[JWT & Auth Service]
        FileProcessor[Document Parser - PyPDF2 / Docx / PPTX]
        LangGraphEngine[LangGraph StateGraph Engine]
    end

    Backend --> AuthService
    Backend --> FileProcessor
    Backend --> LangGraphEngine

    LangGraphEngine <-->|Async Checkpoint Saver| Postgres[(PostgreSQL DB - User & Thread State)]
    LangGraphEngine <-->|LangChain API| Gemini[Google Gemini 2.0 Flash Model]
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15.5 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Radix UI Primitives, Lucide Icons |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, LangChain, LangGraph, Pydantic |
| **AI / LLM** | Google Gemini 2.0 Flash (`langchain-google-genai`) |
| **Document Processing** | PyPDF2, python-docx, python-pptx |
| **Database & Persistence**| PostgreSQL, SQLAlchemy 2.0 ORM, `psycopg3` Async Pool, `langgraph-checkpoint-postgres` |
| **Security & Auth** | JWT (`python-jose`), Passlib (bcrypt), HTTP-Only Cookies, CORS |

---

## 📁 Repository Structure

```
multimodal-ai-assistant/
├── chatbot_backend/          # FastAPI backend service
│   ├── src/
│   │   └── chatbot_backend/
│   │       ├── main.py       # FastAPI application, streaming routes & LangGraph workflow
│   │       ├── db.py         # SQLAlchemy database models & session generator
│   │       └── service.py    # Authentication, password hashing & JWT handling
│   ├── pyproject.toml        # Dependencies & build configuration (uv / hatchling)
│   ├── requirements.txt      # Python dependencies manifest
│   ├── .env.example          # Sample backend environment configuration
│   └── README.md             # Backend detailed documentation
│
└── chatbot_frontend/         # Next.js 15 web interface
    ├── src/
    │   ├── app/              # Next.js App Router (auth, chat routes, layouts)
    │   ├── components/       # Reusable UI components & dialogs
    │   └── middleware.ts     # Edge authentication routing middleware
    ├── package.json          # Dependencies & npm scripts
    ├── next.config.ts        # Next.js configuration
    └── README.md             # Frontend detailed documentation
```

---

## 🚦 Getting Started

### Prerequisites

- **Python**: `3.11+`
- **Node.js**: `18.x` or `20.x+` (npm included)
- **Database**: Running PostgreSQL instance
- **API Key**: [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd chatbot_backend
   ```

2. **Create & activate a virtual environment**:
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

4. **Environment Variables**:
   Create a `.env` file in `chatbot_backend/` based on `.env.example`:
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key"
   DB_URI="postgresql://username:password@localhost:5432/your_database_name"
   ALLOWED_ORIGINS="http://localhost:3000"
   ```

5. **Start the FastAPI Development Server**:
   ```bash
   uvicorn src.chatbot_backend.main:app --reload --port 8000
   ```
   The backend API will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd chatbot_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Ensure `NEXT_PUBLIC_BACKEND_URL` is set in your `.env.local` or environment (defaults to `http://localhost:8000` if configured).

4. **Run the Next.js Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register a new user account |
| `POST` | `/auth/login` | Authenticate user and receive HTTP-Only cookie |
| `GET` | `/guest_login` | Instant 1-click guest authentication |
| `GET` | `/auth/logout` | Clear user cookies and end session |
| `POST` | `/new_chat_stream` | Initialize a new chat thread, upload files, and stream response |
| `POST` | `/chat_stream` | Continue existing thread streaming with optional attachments |
| `GET` | `/all_chats` | Retrieve all chat history threads for authenticated user |
| `GET` | `/chat/history/{thread_id}` | Fetch full message history for a specific thread |
| `GET` | `/rename_chat` | Rename a chat thread title |
| `GET` | `/delete_chat` | Delete a chat thread and associated data |

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
