"use client"

import Link from "next/link"
import { useChats } from "../context/ChatContext"
import { Edit2, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  id: number
  thread_id: string
  chat_name: string
}

interface ChatNameProps {
  chat: Message
  isCollapsed?: boolean
}

export default function ChatNameElem({ chat, isCollapsed = false }: ChatNameProps) {
  const { setChats } = useChats()
  const router = useRouter()
  const [newName, setNewName] = useState(chat.chat_name)
  const pathname = usePathname()
  const isCurrent = pathname === `/chat/${chat.thread_id}`

  const handleRename = async () => {
    if (!newName) return
    chat.chat_name = newName
    try {
      await fetch(`/api/rename_chat?thread_id=${chat.thread_id}&new_name=${encodeURIComponent(newName)}`)
      setChats((prev) =>
        prev.map((c) => (c.thread_id === chat.thread_id ? { ...c, chat_name: newName } : c))
      )
    } catch (error) {
      console.error("Failed to rename chat:", error)
    }
  }

  const handleDelete = async () => {
    try {
      await fetch(`/api/delete_chat?thread_id=${chat.thread_id}`)
      setChats((prev) => prev.filter((c) => c.thread_id !== chat.thread_id))

      if (pathname === `/chat/${chat.thread_id}`) {
        router.push("/")
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  // COLLAPSED ICON RAIL MODE
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/chat/${chat.thread_id}`}
              className={`size-8 shrink-0 rounded-xl flex items-center justify-center transition-colors mx-auto ${
                isCurrent
                  ? "bg-cyan-950 border border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-950/40"
                  : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <MessageSquare className="size-4 shrink-0" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-white text-xs font-medium z-50">
            <p>{chat.chat_name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // EXPANDED SIDEBAR MODE
  return (
    <div
      className={`group flex items-center justify-between p-2 rounded-xl transition-all duration-200 border ${
        isCurrent
          ? "bg-slate-900 border-slate-800 text-white shadow-sm"
          : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
      }`}
    >
      {/* Chat Link */}
      <Link
        href={`/chat/${chat.thread_id}`}
        className="flex items-center gap-2.5 flex-1 min-w-0"
      >
        <div
          className={`size-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            isCurrent ? "bg-cyan-950 border border-cyan-500/40 text-cyan-400" : "bg-slate-900 text-slate-500 group-hover:text-slate-300"
          }`}
        >
          <MessageSquare className="size-3.5 shrink-0" />
        </div>
        <span className="flex-1 truncate text-xs font-medium tracking-tight">
          {chat.chat_name}
        </span>
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* RENAME DIALOG */}
        <Dialog
          onOpenChange={(open: boolean) => {
            if (!open) {
              setTimeout(() => {
                setNewName(chat.chat_name)
              }, 100)
            }
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <DialogTrigger asChild>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Rename chat"
                    className="p-1.5 text-slate-500 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="size-3" />
                  </button>
                </TooltipTrigger>
              </DialogTrigger>
              <TooltipContent>
                <p className="text-xs">Rename Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-base">Rename Chat</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Update the title for this conversation.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-2 bg-slate-950 border-slate-800 text-slate-100 rounded-xl text-sm"
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" className="border-slate-800 text-slate-300">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button disabled={newName === chat.chat_name} onClick={handleRename} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DELETE ALERT DIALOG */}
        <AlertDialog>
          <TooltipProvider>
            <Tooltip>
              <AlertDialogTrigger asChild>
                <TooltipTrigger asChild>
                  <button
                    aria-label="Delete chat"
                    type="button"
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </TooltipTrigger>
              </AlertDialogTrigger>
              <TooltipContent>
                <p className="text-xs">Delete Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white text-base">Delete Chat?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400 text-xs">
                This action cannot be undone. This conversation will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="border-slate-800 text-slate-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
