"use client"

import Image from "next/image"
import { Presentation, FileText, FileSpreadsheet, Image as ImageIcon, FileCode, ArrowUpRight } from "lucide-react"

interface NewChatProps {
  onSelectPrompt?: (prompt: string) => void
}

export default function NewChat({ onSelectPrompt }: NewChatProps) {
  const starterCards = [
    {
      icon: <FileSpreadsheet className="size-4 text-emerald-400" />,
      title: "Financial & Data Analytics",
      description: "Upload Excel spreadsheets (.xlsx) to model data, calculate margins, or generate formulas.",
      tag: "XLSX / CSV",
      prompt: "Analyze this spreadsheet data and provide key insights and metrics summary.",
    },
    {
      icon: <Presentation className="size-4 text-orange-400" />,
      title: "Presentation & Decks",
      description: "Ingest PowerPoint decks (.pptx) or Word documents (.docx) for instant executive summaries.",
      tag: "PPTX / DOCX / PDF",
      prompt: "Summarize this presentation into executive bullet points and key takeaways.",
    },
    {
      icon: <ImageIcon className="size-4 text-purple-400" />,
      title: "Vision & Image Intelligence",
      description: "Upload architectural diagrams, screenshots, or UI mockups for instant visual inspection.",
      tag: "Vision / Images",
      prompt: "Inspect this image or diagram and describe its core components and architecture.",
    },
    {
      icon: <FileCode className="size-4 text-cyan-400" />,
      title: "Code & Architecture",
      description: "Debug Python/TypeScript codebases, optimize algorithms, or review database schemas.",
      tag: "Code & APIs",
      prompt: "Review the system design and optimize performance for scalability.",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] h-full w-full px-4 py-2 max-w-2xl sm:max-w-3xl mx-auto select-none overflow-hidden my-auto">
      {/* Hero Header */}
      <div className="text-center space-y-1.5 mb-3">
        <div className="inline-flex items-center justify-center p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <Image
            src="/logo.png"
            alt="Multimodal AI Architect"
            width={32}
            height={32}
            className="size-8 object-contain"
          />
        </div>

        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
          Multimodal <span className="text-cyan-400">AI Architect</span>
        </h1>

        <p className="text-[11px] sm:text-xs text-slate-400 max-w-md mx-auto leading-normal">
          High-performance AI assistant for documents, presentations, spreadsheets, vision assets, and code.
        </p>

        {/* Format Badges */}
        <div className="flex items-center justify-center flex-wrap gap-1 pt-0.5 text-[10px] font-mono text-slate-400">
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            <Presentation className="size-3 text-orange-400" /> PPTX
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            <FileText className="size-3 text-blue-400" /> DOCX
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            <FileSpreadsheet className="size-3 text-emerald-400" /> XLSX
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            <ImageIcon className="size-3 text-purple-400" /> Images
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            <FileCode className="size-3 text-cyan-400" /> Code
          </span>
        </div>
      </div>

      {/* Starter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {starterCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt?.(card.prompt)}
            className="group p-2.5 sm:p-3 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 shadow-sm hover:shadow-cyan-950/20 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="p-1 rounded-lg bg-slate-950 border border-slate-800">
                  {card.icon}
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {card.tag}
                </span>
              </div>
              <h2 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                {card.title}
                <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
