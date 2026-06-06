"use client"
import { useState, useEffect, useRef } from "react"
import { useChats } from "../context/ChatContext"
import Messages from "./Messages"
import Input from "./Input"
import NewChat from "./NewChat"
import TopBar from "@/components/ui/top-bar"

interface Message {
  role: "human" | "ai" | "system"
  content: string
  streaming?:boolean
}

interface ChatProps{
threadId: string|null
initialMessages:Message[]
}

export default function Chat({ threadId, initialMessages }:ChatProps) {
  const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [])
  const [currentThreadId, setCurrentThreadId] = useState(threadId)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Simple")
  const [streamStatus, setStreamStatus] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { setChats } = useChats()
  const controllerRef = useRef<AbortController | null>(null)
  
  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1]

    if (last.role === "human" || (last.role === "ai" && last.streaming && last.content === "")) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
  }

  const sendMessage = async (formData:FormData) => {
    controllerRef.current = new AbortController()
    const signal = controllerRef.current.signal
    setMessages((prev) => [...prev, { role: "human", content: formData.get("query") as string }])
    setMessages((prev) => [...prev, { role: "ai", content: "", streaming: true }])
    setIsLoading(true)
    setStreamStatus("")

    let url

    if (currentThreadId) {
      formData.append("thread_id", currentThreadId)
      // url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat_stream`
      url = `/api/chat_stream`
    } else {
      // url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/new_chat_stream`
      url = `/api/new_chat_stream`
    }

    const body = formData
    try {
      const response = await fetch(url, {
        method: "POST",
        body: body,
        ...(formData ? {} : { headers: { "Content-Type": "application/json" } }),
        credentials: "include",
        signal,
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder("utf-8")

      let streamedText = ""

      if (!reader) {
        throw new Error("No response body to read from.")
      }

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")
        const jsonParts = []

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (line && line.trim().length > 0) {
            jsonParts.push(line)
          }
        }

        for (const part of jsonParts) {
          try {
            const data = JSON.parse(part)

            if (data.type === "init") {
              const newThreadId = data.thread_id
              window.history.replaceState({}, "", `/chat/${newThreadId}`)
              setCurrentThreadId(newThreadId)
            } else if (data.type === "content") {
              streamedText += data.response
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1]
                if (lastMessage.streaming) {
                  return [...prev.slice(0, -1), { ...lastMessage, content: streamedText }]
                }
                return [...prev, { role: "ai", content: streamedText }]
              })
            } else if (data.type === "final") {
              const newChatName = data.chat_name
              const newThreadId = data.thread_id
              setChats((prev:Array<{id:number;thread_id:string;chat_name:string}>) => {
                if (prev.find((c) => c.thread_id === newThreadId)) return prev
                return [...prev, { id: Date.now(), thread_id: newThreadId, chat_name: newChatName }]
              })
            }
          } catch (parseError) {
            console.log("JSON parse error:", parseError)
          }
        }
      }
      setStreamStatus("Response completed")
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setStreamStatus("Response stopped")
      } else {
        console.error("Streaming failed:", error)
        setMessages((prev) => [...prev.slice(0, -1), { role: "ai", content: "Error: Could not get a response." }])
        setStreamStatus("Response failed")
      }
    } finally {
      setIsLoading(false)
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage && lastMessage.streaming) {
          return [...prev.slice(0, -1), { ...lastMessage, streaming: false }]
        }
        return prev
      })
      setTimeout(() => setStreamStatus(""), 3000)
    }
  }

  const stopStream = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      <TopBar selectedModel={selectedModel} onModelChange={handleModelChange} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {currentThreadId === null ? <NewChat /> : <Messages messages={messages} selectedModel={selectedModel} />}
        {streamStatus && (
          <div className="px-6 pb-2">
            <div className="text-center text-sm text-gray-400 bg-gray-800/50 rounded-lg py-2 px-4 backdrop-blur-sm">
              {streamStatus}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-700/50 bg-gray-900/40 backdrop-blur-md">
        <Input onSendMessage={sendMessage} isLoading={isLoading} onStopStream={stopStream} />
      </div>
    </div>
  )
}
