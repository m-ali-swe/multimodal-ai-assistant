"use client"
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

interface MessageActionsProps {
  content: string
  isHuman: boolean
}

export default function MessageActions({ content, isHuman }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [voteState, setVoteState] = useState<"upvote" | "downvote" | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // console.log("Copied message")
  }

  const handleUpvote = () => {
    setVoteState(voteState === "upvote" ? null : "upvote")
    // console.log("Upvoted!")
  }

  const handleDownvote = () => {
    setVoteState(voteState === "downvote" ? null : "downvote")
    // console.log("Downvoted!")
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy"}</p>
          </TooltipContent>
        </Tooltip>

        {!isHuman && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpvote}
                  className={`h-8 w-8 p-0 transition-colors ${
                    voteState === "upvote"
                      ? "text-green-400 bg-green-500/20"
                      : "text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Good response</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownvote}
                  className={`h-8 w-8 p-0 transition-colors ${
                    voteState === "downvote"
                      ? "text-red-400 bg-red-500/20"
                      : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bad response</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
