"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"

interface MarkdownRendererProps {
  content: string
  isStreaming?: boolean
}

interface CodeProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export default function MarkdownRenderer({ content, isStreaming }: MarkdownRendererProps) {
  const finalContent = isStreaming
    ? `${content}<span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 ml-1.5 animate-pulse"></span>`
    : content

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ inline, className, children, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || "")

          if (!inline && match) {
            return (
              <div className="my-3 font-mono text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-t-xl px-4 py-2 text-xs text-slate-300 font-semibold flex items-center justify-between border-b-0">
                  <span className="text-cyan-400 font-bold">{match[1].toUpperCase()}</span>
                </div>
                <SyntaxHighlighter
                  style={oneDark as unknown as Record<string, React.CSSProperties>}
                  language={match[1]}
                  PreTag="div"
                  className="!rounded-t-none rounded-b-xl !bg-slate-950 !border border-slate-800 !border-t-0 !mt-0 text-xs"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            )
          }

          return (
            <code
              className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded-md text-xs font-mono border border-slate-700/60"
              {...props}
            >
              {children}
            </code>
          )
        },
      }}
    >
      {finalContent}
    </ReactMarkdown>
  )
}
