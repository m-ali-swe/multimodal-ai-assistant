"use client"

import { useState } from "react"
import { useChats } from "../context/ChatContext"
import ChatNameElem from "./ChatNameElem"
import { MessageSquare, Plus, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

export default function Sidenav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { chats, userInfo } = useChats()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleNewChat = () => {
    window.location.href = "/"
  }

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

  const isGuest = userInfo?.email?.startsWith("guest_")
  const displayName = isGuest ? "Guest" : (userInfo?.name || userInfo?.email?.split("@")[0] || "User")
  const displayEmail = isGuest ? "Guest User" : (userInfo?.email || "N/A")
  const userInitial = isGuest ? "G" : displayName.at(0)?.toUpperCase() || "U"

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-slate-800/80 bg-slate-950 text-slate-100 font-sans select-none">
        {/* Header / Logo */}
        <SidebarHeader className="border-b border-slate-800/80 p-2.5 flex items-center justify-between">
          <div
            onClick={handleNewChat}
            className="flex items-center gap-2.5 cursor-pointer group px-0.5"
          >
            <div className="size-8 aspect-square shrink-0 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 transition-colors flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/android-chrome-192x192.png"
                onError={(e) => { e.currentTarget.src = "/favicon-32x32.png" }}
                alt="Multimodal AI Logo"
                className="size-7 aspect-square shrink-0 object-contain"
              />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-sm text-white tracking-tight animate-in fade-in duration-200 whitespace-nowrap">
                Multimodal <span className="text-cyan-400">AI</span>
              </span>
            )}
          </div>
        </SidebarHeader>

        {/* Content Area */}
        <SidebarContent className="p-2 space-y-2 overflow-x-hidden">
          {/* New Chat Button */}
          <SidebarGroup className="p-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleNewChat}
                  tooltip="New Chat"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl h-9 shadow-lg shadow-cyan-950/40 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="size-4 text-white flex-shrink-0" />
                  {!isCollapsed && <span className="text-xs font-semibold whitespace-nowrap">New Chat</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Recent Conversations (Only shown when expanded) */}
          {!isCollapsed && (
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2 py-1 whitespace-nowrap">
                Recent Conversations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {chats.length > 0 ? (
                    chats.map((chat) => (
                      <SidebarMenuItem key={chat.thread_id}>
                        <ChatNameElem chat={chat} isCollapsed={false} />
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="text-center py-6 px-2">
                      <MessageSquare className="size-4 text-slate-700 mx-auto mb-1" />
                      <p className="text-[11px] text-slate-500">No recent chats</p>
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer / User Profile Trigger */}
        <SidebarFooter className="border-t border-slate-800/80 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="w-full hover:bg-slate-900 rounded-xl transition-colors text-left flex items-center gap-2.5 p-1.5"
                  >
                    <Avatar className="size-7 aspect-square shrink-0 border border-slate-700/60">
                      <AvatarFallback className="bg-cyan-950 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{displayName}</p>
                        <p className="text-[10px] text-slate-400 truncate font-mono">{displayEmail}</p>
                      </div>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-slate-900 border-slate-800 text-slate-200 rounded-xl p-1 shadow-2xl">
                  <DropdownMenuLabel className="text-xs font-semibold text-slate-400 px-2 py-1.5">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    onClick={() => setIsProfileOpen(true)}
                    className="text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer rounded-lg px-2 py-2"
                  >
                    <User className="mr-2 size-4 text-cyan-400" />
                    Profile
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* User Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold">Profile</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Account identity details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Name</Label>
              <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-medium">
                {displayName}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Email</Label>
              <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono">
                {displayEmail}
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
