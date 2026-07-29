"use client"

import { User, Bot, Brain, FileText } from "lucide-react"
import MarkdownRenderer from "@/components/ui/markdown-renderer"
import MessageActions from "@/components/ui/message-actions"

export interface AttachedFile {
  name: string
  type?: string
  size?: number
}

export interface Message {
  role: "human" | "ai" | "system"
  content: string
  streaming?: boolean
  attachments?: AttachedFile[]
}

interface MessagesProps {
  messages: Message[]
  selectedModel?: string
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full w-fit">
      <Brain className="size-3.5 text-cyan-400 animate-pulse" />
      <span>Reasoning & Analyzing</span>
      <div className="flex gap-1 items-center ml-1">
        <div className="size-1 bg-cyan-400 rounded-full animate-bounce" />
        <div className="size-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
        <div className="size-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  )
}

export default function Messages({ messages, selectedModel }: MessagesProps) {
  const getAttachmentBadge = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || ""
    switch (ext) {
      case "pdf":
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">PDF</span>
      case "docx":
      case "doc":
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">DOCX</span>
      case "xlsx":
      case "xls":
      case "csv":
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">XLSX</span>
      case "pptx":
      case "ppt":
        return <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">PPTX</span>
      case "png":
      case "jpg":
      case "jpeg":
      case "webp":
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">IMG</span>
      default:
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">{ext.toUpperCase() || "FILE"}</span>
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {messages.map((msg, index) => {
        const isHuman = msg.role === "human"

        return (
          <div
            key={index}
            className={`group flex gap-3 sm:gap-4 ${
              isHuman ? "justify-end" : "justify-start"
            }`}
          >
            {/* Generic Chatbot Avatar */}
            {!isHuman && (
              <div className="flex-shrink-0 mt-0.5">
                <div className="size-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md text-cyan-400">
                  <Bot className="size-4" />
                </div>
              </div>
            )}

            {/* Message Bubble Container */}
            <div className={`flex flex-col relative max-w-[90%] sm:max-w-[85%] ${isHuman ? "items-end" : "items-start"}`}>
              {!isHuman && msg.streaming && selectedModel === "Reasoning" && (!msg.content || msg.content.length < 50) && (
                <ThinkingIndicator />
              )}

              <div
                className={`break-words whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm ${
                  isHuman
                    ? "bg-slate-800 border border-slate-700/80 text-white shadow-lg"
                    : "bg-slate-900/90 border border-slate-800/80 text-slate-100 backdrop-blur-xl shadow-xl"
                }`}
              >
                {/* Render Attached Files inside Human Message */}
                {isHuman && msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2.5 pb-2.5 border-b border-slate-700/60">
                    {msg.attachments.map((file, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 shadow-sm"
                      >
                        <FileText className="size-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[160px] font-medium text-xs text-white">{file.name}</span>
                        {getAttachmentBadge(file.name)}
                      </div>
                    ))}
                  </div>
                )}

                {!isHuman ? (
                  <div className="break-words">
                    <MarkdownRenderer content={msg.content} isStreaming={msg.streaming} />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</div>
                )}
              </div>

              {!msg.streaming && <MessageActions content={msg.content} isHuman={isHuman} />}
            </div>

            {/* User Avatar */}
            {isHuman && (
              <div className="flex-shrink-0 mt-0.5">
                <div className="size-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shadow-md text-cyan-400">
                  <User className="size-4" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
