"use client"

import { Share2, ChevronDown, Zap, Brain, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"

interface TopBarProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

export default function TopBar({ selectedModel, onModelChange }: TopBarProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
    setShareDialogOpen(false)
  }

  return (
    <>
      <div className="h-14 min-h-[3.5rem] w-full flex items-center justify-between px-3 sm:px-5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl z-20">
        {/* Left: Sidebar Toggle + Model Switcher */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl size-8" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white h-9 px-3 rounded-xl gap-2 font-medium text-xs sm:text-sm shadow-sm"
              >
                {selectedModel === "Reasoning" ? (
                  <Brain className="size-4 text-purple-400" />
                ) : (
                  <Zap className="size-4 text-cyan-400" />
                )}
                <span>{selectedModel === "Reasoning" ? "Reasoning Model" : "Standard Fast Model"}</span>
                <ChevronDown className="size-3.5 text-slate-400 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-slate-900 border-slate-800 text-slate-200 w-64 p-1.5 rounded-xl shadow-2xl">
              <DropdownMenuItem
                onClick={() => onModelChange("Simple")}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/20 text-cyan-400">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white">Standard Fast</div>
                    <div className="text-[11px] text-slate-400">Quick responses for daily tasks</div>
                  </div>
                </div>
                {selectedModel === "Simple" && <Check className="size-4 text-cyan-400" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onModelChange("Reasoning")}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors mt-1"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/20 text-purple-400">
                    <Brain className="size-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white">Reasoning Deep</div>
                    <div className="text-[11px] text-slate-400">Step-by-step analytical thinking</div>
                  </div>
                </div>
                {selectedModel === "Reasoning" && <Check className="size-4 text-purple-400" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: Share Action */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-xl h-9 px-3 text-xs gap-2 transition-colors"
          >
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-cyan-400" /> Share Conversation
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              Copy link to share this multimodal workspace conversation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate font-mono">
                {typeof window !== "undefined" ? window.location.href : "https://multimodal.ai"}
              </span>
              <Button
                onClick={copyLink}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-8 px-3 rounded-lg ml-2 flex-shrink-0"
              >
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
