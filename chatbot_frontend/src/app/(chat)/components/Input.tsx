"use client"
import { useEffect, useRef, useState } from "react"
import { Paperclip, Send, X, FileText, ImageIcon, Square } from "lucide-react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


type FileWithPreview = {
  file: File
  preview: string
}

interface InputProps{
  isLoading:boolean
  onSendMessage:(formData:FormData)=>Promise<void>
  onStopStream:()=>void
}

export default function Input({ onSendMessage, isLoading, onStopStream }:InputProps) {
  const [query, setQuery] = useState("")
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles: FileWithPreview[] = Array.from(e.target.files || []).map((file) => ({
      file,
      preview: URL.createObjectURL(file), // generate once
    }))
    setFiles((prev) => [...prev, ...newFiles])
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
    if (textareaRef.current) textareaRef.current.style.height = "56px"
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
    const maxHeight = 128
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
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-green-500" />

    switch (extension) {
      case "pdf":
        return (
          <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center shadow-sm">
            PDF
          </div>
        )
      case "doc":
      case "docx":
        return (
          <div className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded flex items-center justify-center shadow-sm">
            DOC
          </div>
        )
      case "xls":
      case "xlsx":
        return (
          <div className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded flex items-center justify-center shadow-sm">
            XLS
          </div>
        )
      case "ppt":
      case "pptx":
        return (
          <div className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded flex items-center justify-center shadow-sm">
            PPT
          </div>
        )
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  // File preview component
  const getFilePreview = ({ file, preview }: FileWithPreview) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative md:w-20 md:h-20 w-16 h-16 rounded-lg overflow-hidden bg-gray-800 shadow-md">
          <Image fill src={preview} alt={file.name} className="w-full h-full object-cover" />
        </div>
      )
    }

    return (
      <div className="w-20 h-20 rounded-lg bg-gray-800/80 border border-gray-700/50 flex flex-col items-center justify-center p-2 shadow-md backdrop-blur-sm">
        {getFileIcon(file)}
        <span className="text-xs text-gray-300 mt-1 truncate w-full text-center font-medium">
          {file.name.split(".").pop()?.toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className="md:p-6 p-4">
      {/* Preview uploaded files */}
      {files.length > 0 && (
        <div className="mb-4 p-4 max-h-40 md:max-h-60 min-w-0 b-red-500 md:overflow-x-hidden overflow-x-auto bg-gray-900/60 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-nowrap md:flex-wrap gap-3">
            {files.map((fileObj, index) => (
              <div key={index} className="relative group">
                {getFilePreview(fileObj)}
                <button
                  type="button"
                  aria-label={`Remove file ${fileObj.file.name}`}
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 rounded-b-lg truncate backdrop-blur-sm">
                  {fileObj.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/70 border border-gray-700/60 rounded-2xl focus-within:ring-2 focus-within:ring-purple-500/40 focus-within:border-purple-500/60 backdrop-blur-sm transition-all duration-200 shadow-xl">
          <div className="b-red-500 pt-4 pb-4 pr-16 pl-16">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isLoading}
              rows={1}
              className="customScrollbar w-full bg-transparent border-0 focus:outline-none text-white placeholder-gray-400 resize-none min-h-[24px] max-h-32 overflow-y-auto transition-all duration-300 ease-in-out text-base leading-relaxed"
            />
          </div>

          {/* File upload */}
          <div className="absolute bottom-3 left-3">
            <input type="file" multiple onChange={handleFileChange} id="file-upload" className="hidden" />
            <label
              aria-label="Attach files"
              htmlFor="file-upload"
              className="cursor-pointer text-gray-400 hover:text-purple-400 transition-all duration-200 p-2.5 rounded-xl hover:bg-gray-700/60 active:scale-95 flex items-center justify-center"
            >
              <Paperclip className="w-5 h-5" />
            </label>
          </div>


          {/* Send / Stop button */}
          
          {/* <div className="absolute bottom-3 right-3">
            {isLoading ? (
              <button
                type="button"
                onClick={handleStop}
                className="h-10 w-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center p-0 active:scale-95"
              >
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!query.trim() && files.length === 0}
                className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white border-0 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed p-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div> */}
          <div className="absolute bottom-3 right-3">
            <TooltipProvider>
              <Tooltip>
                {isLoading ? (
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Stop streaming"
                      type="button"
                      onClick={handleStop}
                      className="h-10 w-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center p-0 active:scale-95"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                ) : (
                  <TooltipTrigger asChild>
                    <button
                      aria-label="submit"
                      type="submit"
                      disabled={!query.trim() && files.length === 0}
                      className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white border-0 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed p-0 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                )}
                <TooltipContent>
                  {isLoading ? <p>Stop streaming</p> : <p>Send message</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>


        </div>
      </form>

      <style jsx>{`
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}
