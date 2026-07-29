import type React from "react"
import Sidenav from "./components/Sidenav"
import ChatProvider from "./context/ChatContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#090D17]">
      <ChatProvider>
        <SidebarLayout>{children}</SidebarLayout>
      </ChatProvider>
    </div>
  )
}

function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#090D17] text-slate-100 overflow-hidden">
      <Sidenav />
      <main className="flex-1 h-full min-w-0 flex flex-col overflow-hidden bg-[#090D17] relative">
        {children}
      </main>
    </div>
  )
}
