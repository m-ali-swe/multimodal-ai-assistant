"use client"
import { Share2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"

interface TopBarProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

export default function TopBar({ selectedModel, onModelChange }: TopBarProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const handleShare = () => {
    setShareDialogOpen(true)
    // console.log("Share conversation")
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              {selectedModel}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
            <DropdownMenuItem
              onClick={() => onModelChange("Simple")}
              className="text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              Simple
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onModelChange("Reasoning")}
              className="text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              Reasoning
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Share Conversation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share this conversation with others (feature coming soon)
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 text-sm">Sharing functionality will be available in a future update.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
