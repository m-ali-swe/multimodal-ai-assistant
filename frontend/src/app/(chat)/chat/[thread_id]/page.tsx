"use client";
import React, { use, useEffect, useState } from 'react';
import Chat from '../../components/Chat';

interface ChatPageProps{
  params:Promise<{
    thread_id:string
  }>
}

export default function ChatPage({ params }:ChatPageProps) {
  const resolvedParams=use(params)
  const { thread_id } = resolvedParams;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!thread_id) return;
      setIsLoading(true);
      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/history/${thread_id}`,{
        const response = await fetch(`/api/chat/history/${thread_id}`,{
          credentials:"include"
        });
        const data = await response.json();
        setMessages(data.messages);
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
      <div className="flex justify-center items-center h-screen">
        <p>Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Chat threadId={thread_id} initialMessages={messages} />
    </div>
  );
}

