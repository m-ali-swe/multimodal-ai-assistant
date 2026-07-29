import type React from "react"
import Sidenav from "./components/Sidenav"
import ChatProvider from "./context/ChatContext"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#090D17]">
      <ChatProvider>
        <SidebarProvider defaultOpen={true} className="h-screen max-h-screen overflow-hidden">
          <div className="flex h-screen w-full max-h-screen bg-[#090D17] text-slate-100 overflow-hidden">
            <Sidenav />
            <main className="flex-1 h-full min-h-0 flex flex-col overflow-hidden bg-[#090D17] relative">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </ChatProvider>
    </div>
  )
}
