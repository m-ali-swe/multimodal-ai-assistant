"use client"

import { Presentation, FileText, FileSpreadsheet, Image as ImageIcon, FileCode, ArrowUpRight } from "lucide-react"

interface NewChatProps {
  onSelectPrompt?: (prompt: string) => void
}

export default function NewChat({ onSelectPrompt }: NewChatProps) {
  const starterCards = [
    {
      icon: <FileSpreadsheet className="size-5 text-emerald-400" />,
      title: "Financial & Data Analytics",
      description: "Upload Excel spreadsheets (.xlsx) to model data, calculate margins, or generate formulas.",
      tag: "XLSX / CSV",
      prompt: "Analyze this spreadsheet data and provide key insights and metrics summary.",
    },
    {
      icon: <Presentation className="size-5 text-orange-400" />,
      title: "Presentation & Executive Decks",
      description: "Ingest PowerPoint presentations (.pptx) or Word documents (.docx) for instant executive summaries.",
      tag: "PPTX / DOCX / PDF",
      prompt: "Summarize this presentation into executive bullet points and key takeaways.",
    },
    {
      icon: <ImageIcon className="size-5 text-purple-400" />,
      title: "Vision & Image Intelligence",
      description: "Upload architectural diagrams, screenshots, or UI mockups for instant visual inspection.",
      tag: "Vision / Images",
      prompt: "Inspect this image or diagram and describe its core components and architecture.",
    },
    {
      icon: <FileCode className="size-5 text-cyan-400" />,
      title: "Code & System Architecture",
      description: "Debug Python/TypeScript codebases, optimize algorithms, or review database schemas.",
      tag: "Code & APIs",
      prompt: "Review the system design and optimize performance for scalability.",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-8 max-w-4xl mx-auto select-none">
      {/* Hero Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shadow-cyan-950/30 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon-32x32.png"
            alt="Multimodal AI Assistant"
            className="size-9 object-contain"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          Multimodal <span className="text-cyan-400">AI Architect</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          High-performance AI workspace capable of processing documents, presentations, spreadsheets, vision assets, and code.
        </p>

        {/* Format Badges */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1 text-[11px] font-mono text-slate-400">
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
            <Presentation className="size-3 text-orange-400" /> PPTX
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
            <FileText className="size-3 text-blue-400" /> DOCX
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
            <FileSpreadsheet className="size-3 text-emerald-400" /> XLSX
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
            <ImageIcon className="size-3 text-purple-400" /> Images
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
            <FileCode className="size-3 text-cyan-400" /> Code
          </span>
        </div>
      </div>

      {/* Starter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {starterCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt?.(card.prompt)}
            className="group relative p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/90 shadow-lg hover:shadow-cyan-950/20 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  {card.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {card.tag}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                {card.title}
                <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
