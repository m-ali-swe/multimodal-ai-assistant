"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Paperclip, Send, X, FileText, ImageIcon, Square } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type FileWithPreview = {
  file: File
  preview: string
}

interface InputProps {
  isLoading: boolean
  onSendMessage: (formData: FormData) => Promise<void>
  onStopStream: () => void
}

export default function Input({ onSendMessage, isLoading, onStopStream }: InputProps) {
  const [query, setQuery] = useState("")
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Handle file selection with 10 file limit
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (files.length + selected.length > 10) {
      toast.error("Attachment Limit Exceeded", {
        description: "You can attach a maximum of 10 files per message.",
      })
      return
    }

    const newFiles: FileWithPreview[] = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setFiles((prev) => [...prev, ...newFiles])
    e.target.value = ""
  }

  // Remove file and revoke object URL
  const removeFile = (index: number) => {
    URL.revokeObjectURL(files[index].preview)
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Send message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() && files.length === 0) return

    const formData = new FormData()
    formData.append("query", query)
    files.forEach(({ file }) => formData.append("files", file))
    onSendMessage(formData)

    // Clear input and files
    files.forEach(({ preview }) => URL.revokeObjectURL(preview))
    setFiles([])
    setQuery("")
    if (textareaRef.current) textareaRef.current.style.height = "40px"
  }

  // Stop streaming
  const handleStop = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onStopStream) onStopStream()
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    const maxHeight = 140
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px"
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [query])

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // File icons for non-image files
  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase()
    if (file.type.startsWith("image/")) return <ImageIcon className="size-3.5 text-purple-400" />

    switch (extension) {
      case "pdf":
        return (
          <div className="size-5 bg-red-500/20 border border-red-500/30 text-red-300 text-[9px] font-mono font-bold rounded flex items-center justify-center">
            PDF
          </div>
        )
      case "doc":
      case "docx":
        return (
          <div className="size-5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[9px] font-mono font-bold rounded flex items-center justify-center">
            DOC
          </div>
        )
      case "xls":
      case "xlsx":
        return (
          <div className="size-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono font-bold rounded flex items-center justify-center">
            XLS
          </div>
        )
      case "ppt":
      case "pptx":
        return (
          <div className="size-5 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[9px] font-mono font-bold rounded flex items-center justify-center">
            PPT
          </div>
        )
      default:
        return <FileText className="size-3.5 text-slate-400" />
    }
  }

  // File preview component
  const getFilePreview = ({ file, preview }: FileWithPreview) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative size-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
          <Image fill src={preview} alt={file.name} className="w-full h-full object-cover" />
        </div>
      )
    }

    return (
      <div className="size-12 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-1 shadow-sm">
        {getFileIcon(file)}
        <span className="text-[9px] font-mono text-slate-400 mt-0.5 truncate w-full text-center">
          {file.name.split(".").pop()?.toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 max-w-4xl mx-auto w-full">
      {/* File Upload Preview Bar */}
      {files.length > 0 && (
        <div className="mb-2 p-2 max-h-28 overflow-x-auto bg-slate-900/90 rounded-xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
          <div className="flex flex-nowrap sm:flex-wrap gap-2">
            {files.map((fileObj, index) => (
              <div key={index} className="relative group">
                {getFilePreview(fileObj)}
                <button
                  type="button"
                  aria-label={`Remove file ${fileObj.file.name}`}
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 size-4 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                >
                  <X className="size-2.5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 text-slate-300 text-[9px] p-0.5 rounded-b-lg truncate text-center font-mono">
                  {fileObj.file.name}
                </div>
              </div>
            ))}
          </div>
          <span className="text-[10px] font-mono text-slate-500 px-2">
            {files.length}/10
          </span>
        </div>
      )}

      {/* Structured Prompt Card with Centered Action Toolbar */}
      <form onSubmit={handleSubmit}>
        <div className="bg-slate-900/95 border border-slate-800/90 rounded-2xl focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 backdrop-blur-xl transition-all duration-200 shadow-xl p-3 flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Multimodal AI Architect (supports PPTX, DOCX, XLSX, Images)..."
            disabled={isLoading}
            rows={1}
            className="w-full bg-transparent border-0 focus:outline-none text-slate-100 placeholder:text-slate-500 resize-none min-h-[28px] max-h-32 overflow-y-auto text-xs sm:text-sm leading-relaxed px-1"
          />

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                id="file-upload"
                className="hidden"
                disabled={files.length >= 10}
              />
              <label
                aria-label="Attach files"
                htmlFor="file-upload"
                className={`cursor-pointer text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-center ${
                  files.length >= 10 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <Paperclip className="size-4" />
              </label>
            </div>

            <div className="flex items-center gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  {isLoading ? (
                    <TooltipTrigger asChild>
                      <button
                        aria-label="Stop streaming"
                        type="button"
                        onClick={handleStop}
                        className="size-7 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
                      >
                        <Square className="size-3" />
                      </button>
                    </TooltipTrigger>
                  ) : (
                    <TooltipTrigger asChild>
                      <button
                        aria-label="Submit query"
                        type="submit"
                        disabled={!query.trim() && files.length === 0}
                        className="size-7 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg shadow-md shadow-cyan-950/30 transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                      >
                        <Send className="size-3" />
                      </button>
                    </TooltipTrigger>
                  )}
                  <TooltipContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                    {isLoading ? <p>Stop streaming</p> : <p>Send query (Enter)</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
