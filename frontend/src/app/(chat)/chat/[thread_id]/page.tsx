"use client";
import React, { use, useEffect, useState } from "react";
import Chat from "../../components/Chat";
import { Loader2 } from "lucide-react";

interface ChatPageProps {
  params: Promise<{
    thread_id: string
  }>
}

export default function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = use(params);
  const { thread_id } = resolvedParams;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!thread_id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chat/history/${thread_id}`, {
          credentials: "include"
        });
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [thread_id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#090D17] text-slate-400 gap-2 font-mono text-xs">
        <Loader2 className="size-5 animate-spin text-cyan-400" />
        <span>Loading workspace thread...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#090D17]">
      <Chat threadId={thread_id} initialMessages={messages} />
    </div>
  );
}
