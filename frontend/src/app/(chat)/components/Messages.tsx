"use client"

import { User, Bot, Brain } from "lucide-react"
import MarkdownRenderer from "@/components/ui/markdown-renderer"
import MessageActions from "@/components/ui/message-actions"

interface Message {
  role: "human" | "ai" | "system"
  content: string
  streaming?: boolean
}

interface MessagesProps {
  messages: Message[]
  selectedModel?: string
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full w-fit">
      <Brain className="size-3.5 text-cyan-400 animate-pulse" />
      <span>Reasoning & Analyzing...</span>
      <div className="flex gap-1 items-center ml-1">
        <div className="size-1 bg-cyan-400 rounded-full animate-bounce" />
        <div className="size-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
        <div className="size-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  )
}

export default function Messages({ messages, selectedModel }: MessagesProps) {
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
