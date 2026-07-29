"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useChats } from "../context/ChatContext"
import ChatNameElem from "./ChatNameElem"
import { MessageSquare, PenTool, LogOut,Menu, User } from "lucide-react"
import { Avatar,AvatarFallback } from "@/components/ui/avatar"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,
  DropdownMenuSeparator,DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function Sidenav() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const { chats,userInfo } = useChats()
  const router = useRouter()

  const handleLogout = async () => {
  try {
    // await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
    await fetch(`/api/auth/logout`, {
      method: "GET",
      credentials: "include", 
    })
  } catch (err) {
    console.error("Logout failed", err)
  } finally {
    window.location.href = "/auth/login" 
  }
}

const isOverlay = isCollapsed && (isHovered || isDropdownOpen)
const isPushed = !isCollapsed
  const showExpandedContent = isPushed || isOverlay

   const showProfile = () => {
    setIsProfileOpen(true)
  }

  return (
    <>
    <div className={`md:h-screen absolute md:relative h-0 z-50 b-red-600  transition-all duration-300
      ${isCollapsed ? "md:w-16 " : "md:w-72 w-0"}
      
      `}>

      <div
        className={`
          ${isCollapsed ? "w-16 " : "translate-x-0 w-72"}
          bg-gray-900/95 border-r border-gray-800/50 flex flex-col h-screen transition-all duration-300 backdrop-blur-sm
          ${isOverlay ? "z-40 w-72" : ""}
          -translate-x-full md:-translate-x-0
          `}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => isCollapsed && setIsHovered(false)}
      >


<div className="p-4 border-b border-gray-800/50 pt-16 flex gap-4 flex-col">

            <button
              onClick={() => router.push("/")}
className="w-full relative h-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white
  py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all 
 duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
            >
              <PenTool className={`${showExpandedContent?"mr-28":""} w-4 h-4 transition-all duration-100 md:duration-300`} />
              <p className={`${showExpandedContent?"opacity-100 fixed duration-1000":"opacity-0 fixed duration-100"} transition-all`}>
              New Chat
              </p>
            </button>

        </div>

          <div className={`${showExpandedContent?"opacity-100 duration-1000 pointer-events-auto":"opacity-0 pointer-events-none duration-200"} w-72 b-pink-800 transition-all  flex-1 overflow-y-auto p-4`}>
            <div className="mb-4">
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Recent Chats</h2>
              <div className="space-y-1">
                {chats.length > 0 ? (
                  chats.map((chat) => <ChatNameElem key={chat.thread_id} chat={chat} />)
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No chats yet</p>
                    <p className="text-xs text-gray-500 mt-1">Start a conversation to see your chats here</p>
                  </div>
                )}
              </div>
            </div>
          </div>


        <div className="py-4 border-t border-gray-800/50 mt-auto">

            <DropdownMenu onOpenChange={(open)=>{
              setIsDropdownOpen(open)
            }}>
              <DropdownMenuTrigger asChild>
                <button className="hover:pointer-events-auto w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors text-left">
                  <Avatar className="w-8 h-8">
                    {/* <AvatarImage src="/diverse-user-avatars.png" /> */}
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-sm font-medium">
                      {userInfo.email?.at(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {<div className={`${showExpandedContent?"opacity-100":"opacity-0"}
                   transition-all duration-300 flex-1 min-w-0`}>
                    <p className="text-sm font-medium text-white truncate">User</p>
                    <p className="text-xs text-gray-400 truncate">{userInfo.email?.startsWith("guest_")?userInfo?.email?.indexOf("@")==-1?"Guest":userInfo?.email:userInfo?.email}</p>
                  </div>}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={showProfile} className="text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          
        </div>

    </div>

      </div>

<Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">User Profile</DialogTitle>
            <DialogDescription className="text-gray-400">Your account information and statistics</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-id" className="text-gray-300">
                User ID
              </Label>
              <div className="px-3 py-2 bg-gray-800 rounded-md text-gray-300 text-sm">{userInfo?.user_id || "N/A"}</div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="px-3 py-2 bg-gray-800 rounded-md text-gray-300 text-sm">
                {userInfo?.email?.startsWith("guest_") ? "Guest User" : userInfo?.email || "N/A"}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total-chats" className="text-gray-300">
                Total Chats
              </Label>
              <div className="px-3 py-2 bg-gray-800 rounded-md text-gray-300 text-sm">{chats?.length || 0}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

  <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900/95 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white border border-gray-800/50 backdrop-blur-sm shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>

    </>
  )


}
