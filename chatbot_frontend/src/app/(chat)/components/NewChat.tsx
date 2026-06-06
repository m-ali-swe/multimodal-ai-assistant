"use client"
import { Sparkles } from "lucide-react"

export default function NewChat() {
  return (
    <div className="text-center overflow-hidden md:py-10 flex flex-col items-center justify-center min-h-full">
      <div className="space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 mx-auto">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="md:text-6xl sm:text-5xl text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          Hi, I am an AI assistant!
        </h1>
        <div className="px-5 md:px-0 sm:text-lg md:text-lg text-md text-gray-400 max-w-md mx-auto leading-relaxed">
          How can I help you today? Ask me anything and I&apos;ll provide detailed responses.
        </div>
      </div>
    </div>
  )
}
