"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useChats } from "../context/ChatContext"
import ChatNameElem from "./ChatNameElem"
import { MessageSquare, Plus, LogOut, Menu, User, ChevronLeft } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function Sidenav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { chats, userInfo } = useChats()
  const router = useRouter()

  const handleLogout = async () => {
    try {
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

  const userInitial = userInfo.name?.at(0)?.toUpperCase() || userInfo.email?.at(0)?.toUpperCase() || "U"

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-3 left-3 z-50 p-2 md:hidden bg-slate-900/90 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white border border-slate-800 shadow-xl"
        size="icon"
      >
        <Menu className="size-5" />
      </Button>

      {/* Sidebar Container */}
      <div
        className={`h-screen relative z-40 transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-16" : "w-72"
        } bg-slate-950 border-r border-slate-800/80 backdrop-blur-xl select-none`}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => isCollapsed && setIsHovered(false)}
      >
        {/* Header / Brand Logo */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between h-16">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 transition-colors flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/favicon-32x32.png"
                alt="Multimodal AI"
                className="size-6 object-contain"
              />
            </div>
            {showExpandedContent && (
              <span className="font-bold text-sm text-white tracking-tight animate-in fade-in duration-200">
                Multimodal <span className="text-cyan-400">AI</span>
              </span>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="icon"
            className="hidden md:flex text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg size-8"
          >
            <ChevronLeft className={`size-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={() => router.push("/")}
            className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl h-10 shadow-lg shadow-cyan-950/40 transition-all duration-200 flex items-center justify-center ${
              isCollapsed && !isHovered ? "px-0" : "px-4"
            }`}
          >
            <Plus className="size-4 text-white flex-shrink-0" />
            {showExpandedContent && (
              <span className="ml-2 text-xs font-semibold tracking-wide animate-in fade-in duration-200">
                New Chat
              </span>
            )}
          </Button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {showExpandedContent && (
            <div className="px-2 pb-2 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Recent Conversations
            </div>
          )}

          {chats.length > 0 ? (
            chats.map((chat) => (
              <ChatNameElem key={chat.thread_id} chat={chat} isCollapsed={!showExpandedContent} />
            ))
          ) : (
            showExpandedContent && (
              <div className="text-center py-10 px-4">
                <MessageSquare className="size-6 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No recent chats</p>
                <p className="text-[11px] text-slate-600 mt-1">Start a conversation to see your history</p>
              </div>
            )
          )}
        </div>

        {/* Footer / User Profile Trigger */}
        <div className="p-3 border-t border-slate-800/80 mt-auto">
          <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 transition-colors text-left focus:outline-none">
                <Avatar className="size-8 border border-slate-700/60">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white text-xs font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>

                {showExpandedContent && (
                  <div className="flex-1 min-w-0 animate-in fade-in duration-200">
                    <p className="text-xs font-medium text-white truncate">
                      {userInfo?.name || "Architect User"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">
                      {userInfo?.email?.startsWith("guest_") ? "Guest User" : userInfo?.email || "User"}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200 rounded-xl p-1 shadow-2xl">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-400 px-2 py-1.5">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                onClick={() => setIsProfileOpen(true)}
                className="text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer rounded-lg px-2 py-2"
              >
                <User className="mr-2 size-4 text-cyan-400" />
                Profile & Statistics
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 cursor-pointer rounded-lg px-2 py-2"
              >
                <LogOut className="mr-2 size-4 text-red-400" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">User Profile</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Account identity and system statistics
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Full Name</Label>
              <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-medium">
                {userInfo?.name || "Architect User"}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Email Address</Label>
              <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono">
                {userInfo?.email?.startsWith("guest_") ? "Guest User" : userInfo?.email || "N/A"}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Total Conversations</Label>
              <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono">
                {chats?.length || 0} active threads
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
