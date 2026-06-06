import type React from "react"
import Sidenav from "./components/Sidenav"
import ChatProvider from "./context/ChatContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen w-screen">
        <ChatProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </ChatProvider>
    </div>
  )
}

function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidenav />
      <main className="flex-1 overflow-x-hidden transition-all duration-300">{children}</main>
    </div>
  )
}
