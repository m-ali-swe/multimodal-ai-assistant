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

interface Message{
  id:number
  thread_id:string
  chat_name:string
}

interface ChatNameProps{
  chat:Message
}

export default function ChatNameElem({ chat }:ChatNameProps) {
  const { setChats } = useChats()
  const router = useRouter()
  const [newName, setNewName] = useState(chat.chat_name)
  const pathname = usePathname()
  const isCurrent= pathname === `/chat/${chat.thread_id}`

  const handleRename = async () => {
    if (!newName) return
    // console.log("Rename called : ",newName)
    // return;
    chat.chat_name=newName
    try {
      await fetch(
        `/api/rename_chat?thread_id=${chat.thread_id}&new_name=${newName}`
        // `${process.env.NEXT_PUBLIC_BACKEND_URL}/rename_chat?thread_id=${chat.thread_id}&new_name=${newName}`
      )
      setChats((prev) =>
        prev.map((c) =>
          c.thread_id === chat.thread_id ? { ...c, chat_name: newName } : c
        )
      )
    } catch (error) {
      console.error("Failed to rename chat:", error)
    }
  }

  const handleDelete = async () => {
    try {
      // await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete_chat?thread_id=${chat.thread_id}`)
      await fetch(`/api/delete_chat?thread_id=${chat.thread_id}`)
      setChats((prev) => prev.filter((c) => c.thread_id !== chat.thread_id))
      
      if (pathname === `/chat/${chat.thread_id}`) {
        router.push("/")
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  return (
    <div className={`${isCurrent?"bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 border-purple-500/30":""} group flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-200 border border-transparent hover:border-purple-500/20`}>
      {/* Chat Link */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-purple-300" />
        </div>
        <Link
          href={`/chat/${chat.thread_id}`}
          className="flex-1 text-sidebar-foreground hover:text-white truncate text-sm font-medium transition-colors"
        >
          {chat.chat_name}
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
        {/* RENAME DIALOG */}
        
        <Dialog onOpenChange={(open:boolean)=>{
          if (!open){
            setTimeout(() => {
              setNewName(chat.chat_name)
            }, 100);
          }
        }}>
          <TooltipProvider>
            <Tooltip>
              <DialogTrigger asChild>
                <TooltipTrigger asChild>
                  <button type="button"
                  aria-label="Rename chat"
                  className="p-2 text-sidebar-foreground/60 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all duration-200">
                    <Edit2 className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
              </DialogTrigger>
              <TooltipContent>
                <p>Rename Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Chat</DialogTitle>
              <DialogDescription>
                Update the name for this conversation.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-2"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button disabled={newName==chat.chat_name} onClick={handleRename}>Save</Button>
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
                    className="p-2 text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
              </AlertDialogTrigger>
              <TooltipContent>
                <p>Delete Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                chat and all its messages.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        
      </div>
    </div>
  )
}
