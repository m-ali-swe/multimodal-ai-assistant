# 🎨 Chatbot Frontend (Next.js 15 UI)

The frontend web application for the **Multimodal AI Assistant**, built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It offers a polished ChatGPT/Gemini-style interface with real-time response streaming, file uploads, conversation history management, and dark-mode styling.

---

## 🌟 Features & Highlights

- **Next.js 15 App Router Architecture**: Uses modern layout routes, middleware authentication checks, and modular client/server components.
- **Real-Time NDJSON Stream Consumption**: Reads NDJSON chunks via `fetch` and `ReadableStream` to display AI text responses dynamically with real-time auto-scrolling.
- **Rich Media & Code Formatting**:
  - Full Markdown rendering with `react-markdown` and `rehype-raw`.
  - Syntax highlighted code snippets using `react-syntax-highlighter` (prism theme).
- **File Attachment Support**: Attach PDFs, Word Documents, PowerPoint slides, and text files directly inside the input prompt bar.
- **Sidebar & Thread History**:
  - Dynamically load, rename, delete, and switch between saved conversation threads.
  - Auto-scrolling and automatic title generation for new chats.
- **Authentication & Middleware**:
  - Secure authentication flow supporting Login, Signup, and 1-Click Guest Login.
  - Edge middleware (`middleware.ts`) enforcing authenticated route protection.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5 (App Router with Turbopack)
- **UI & Styling**: React 19, Tailwind CSS v4, Radix UI Primitives (Dropdowns, Dialogs, Tooltips, Avatars), Lucide Icons
- **Markdown & Code**: `react-markdown`, `rehype-raw`, `react-syntax-highlighter`
- **State & Cookies**: React Context API (`ChatContext`), `js-cookie`

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in `chatbot_frontend/`:

```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
```

*(Note: Ensure your FastAPI backend is running on port 8000 or update `NEXT_PUBLIC_BACKEND_URL` accordingly).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
chatbot_frontend/
├── src/
│   ├── app/
│   │   ├── (chat)/            # Main chat interface layout and routes
│   │   │   ├── chat/          # Thread specific chat page
│   │   │   ├── components/    # Chat UI components (Chat, Sidenav, Input, Messages)
│   │   │   └── context/       # Global ChatContext state manager
│   │   ├── auth/              # Auth pages (login, signup)
│   │   ├── globals.css        # Global CSS styles & Tailwind directives
│   │   └── layout.tsx         # Root app layout
│   └── middleware.ts          # Authentication middleware
├── components.json            # Shadcn / Radix UI component config
├── next.config.ts             # Next.js configuration
└── package.json               # Package manifest
```
