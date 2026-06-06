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
    <div className="flex absolute -top-8 left-2 items-center gap-2 text-gray-400 text-sm mb-3">
      <Brain className="w-4 h-4 animate-pulse" />
      <span>Thinking</span>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-0"/>
        <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-150"/>
        <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-300"/>
      </div>
    </div>
  )
}

export default function Messages({ messages,selectedModel }: MessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {messages.map((msg, index) => {

return(
        <div key={index} className={`${msg.role==="ai"?"":""} relative group flex gap-4 ${msg.role === "human" ? "justify-end" : "justify-start"}`}>
          {msg.role === "ai" && (
            <div className="hidden md:block flex-shrink-0 fixe top-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
          )}

          <div className="flex flex-col relative md:max-w-[80%] max-w-[95%]">
            {msg.role === "ai" && msg.streaming && selectedModel=== "Reasoning" && (
               <ThinkingIndicator />
            )}

            <div
              className={`break-words break-all whitespace-pre-wrap rounded-2xl px-6 py-5 ${
                msg.role === "human"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white mlauto shadow-lg"
                  : "bg-gradient-to-br from-gray-800/80 to-gray-900/60 text-gray-100 backdrop-blur-sm border border-gray-700/50 shadow-xl"
              }`}
            >
              {msg.role === "ai" ? (
                <div className="break-words">
                  <MarkdownRenderer content={msg.content} isStreaming={msg.streaming} />
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words leading-7">{msg.content}</div>
              )}
            </div>

            {!msg.streaming && <MessageActions content={msg.content} isHuman={msg.role === "human"} />}
          </div>

          {msg.role === "human" && (
            <div className="hidden md:block flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>
      )})}
    </div>
  )
}
