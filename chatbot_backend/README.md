# ⚡ Chatbot Backend (FastAPI & LangGraph Engine)

The backend service for the **Multimodal AI Assistant**. Powered by **FastAPI**, **LangGraph**, **Google Gemini 2.0 Flash**, and **PostgreSQL**, this service handles user authentication, real-time NDJSON response streaming, multimodal file parsing, and stateful agent graph execution.

---

## 🛠️ Architecture & Core Components

- **LangGraph StateGraph Engine (`main.py`)**:
  - `call_model`: Invokes `ChatGoogleGenerativeAI` with Gemini 2.0 Flash model.
  - `summarize_conversation`: Automatically summarizes older chat history when context exceeds 20 messages, trimming message arrays to prevent token limit breaches.
  - `ToolNode`: Built-in tools framework capable of binding custom Python tool functions (e.g., `search_web`).
- **PostgreSQL Async Checkpointing**:
  - Uses `AsyncPostgresSaver` backed by `psycopg_pool.AsyncConnectionPool` for checkpointing state graph history per thread.
- **Multimodal File Extraction (`process_files`)**:
  - Extracts raw text content from uploaded **PDFs (`PyPDF2`)**, **Microsoft Word (`python-docx`)**, **PowerPoint (`python-pptx`)**, and text files before passing them into the LLM context.
- **Database & Auth (`db.py`, `service.py`)**:
  - SQLAlchemy 2.0 ORM with PostgreSQL database mapping (`users` and `chat_table` tables).
  - Bcrypt password hashing (`passlib`) and JWT token creation (`python-jose`).
  - HTTP-Only, Secure, SameSite cookie session management.

---

## 📋 Environment Variables

Create a `.env` file inside `chatbot_backend/`:

```env
GEMINI_API_KEY="your_google_gemini_api_key"
DB_URI="postgresql://username:password@localhost:5432/database_name"
ALLOWED_ORIGINS="http://localhost:3000"
```

---

## 🚀 Quick Start

### 1. Setup Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate environment
# On Windows (PowerShell):
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate
```

### 2. Install Dependencies

Using standard `pip`:
```bash
pip install -r requirements.txt
```

Or using `uv`:
```bash
uv sync
```

### 3. Run Database Migrations / Table Creation

Ensure PostgreSQL is running and `DB_URI` in `.env` is accessible. The app automatically initializes `AsyncPostgresSaver` tables on startup.

### 4. Start Development Server

```bash
uvicorn src.chatbot_backend.main:app --reload --port 8000
```

Access Interactive API Documentation (Swagger UI): `http://localhost:8000/docs`

---

## 📡 Key Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Health check & system initialization status |
| `/auth/signup` | `POST` | Register a new user |
| `/auth/login` | `POST` | Authenticate user & set session cookies |
| `/auth/logout` | `GET` | Log out user & delete auth cookies |
| `/guest_login` | `GET` | Guest trial login route |
| `/new_chat_stream` | `POST` | Start a new chat, auto-generate title, stream response |
| `/chat_stream` | `POST` | Send message in existing thread & stream response |
| `/all_chats` | `GET` | Fetch all chat threads for logged-in user |
| `/chat/history/{thread_id}`| `GET` | Fetch chat message history for specific thread |
| `/rename_chat` | `GET` | Rename thread title |
| `/delete_chat` | `GET` | Delete chat thread |
