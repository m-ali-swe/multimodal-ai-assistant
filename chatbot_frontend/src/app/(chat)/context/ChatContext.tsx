"use client"
import React, { createContext, useContext, useEffect, useState,ReactNode  } from 'react'

interface userInfo{
  email?:string
  user_id?:number
  total_chats?:number
}

interface ChatContextType {
  chats: Message[];
  setChats: React.Dispatch<React.SetStateAction<Message[]>>;
  userInfo: userInfo;
}

interface Message{
  id:number
  thread_id:string
  chat_name:string
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default function ChatProvider({children}: {children: ReactNode}) {
  const [chats, setChats] = useState<Message[]>([])
  const [userInfo, setUserInfo] = useState<userInfo>({})

    useEffect(() => {
        const fetchChats=async()=>{
            try {
                const res = await fetch(`/api/all_chats`,{
                  credentials:"include"
                });
                const data = await res.json();
                console.log("Data inside chatContext : ",data)
                setChats(data.chats || []);
                setUserInfo({email:data.user_email,user_id:data.user_id,total_chats:data.total_chats})
            } catch (err) {
                console.error("Failed to load chats:", err);
            }
        }
    fetchChats()
            
  }, [])
  
    return (
    <ChatContext.Provider value={{chats, setChats, userInfo}}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChats = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChats must be used within a ChatProvider");
  }
  return context;
}