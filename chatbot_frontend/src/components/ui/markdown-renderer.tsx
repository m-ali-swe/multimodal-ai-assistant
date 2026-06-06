"use client"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"

interface MarkdownRendererProps {
  content: string,
  isStreaming:boolean|undefined
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function MarkdownRenderer({ content ,isStreaming}: MarkdownRendererProps) {
const finalContent = isStreaming ? `${content}<span class="inline-block w-3 h-3 rounded-full bg-purple-400 ml-1 animate-pulse"></span>` : content;
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
        components={{
  code({ inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || "");

    if (!inline && match) {
      return (
        <div className="my-4">
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-t-lg px-4 py-2 text-sm text-gray-300 font-medium border-b-0">
            {match[1].toUpperCase()}
          </div>
          <SyntaxHighlighter
            style={oneDark as unknown as Record<string, React.CSSProperties>}
            language={match[1]}
            PreTag="div"
            className="!rounded-t-none rounded-b-lg !bg-gray-900 !border border-gray-700/50 !border-t-0 !mt-0"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code
        className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-md text-sm font-mono border border-purple-500/30"
        {...props}
      >
        {children}
      </code>
    );
  },
}}
    >
      {finalContent}
    </ReactMarkdown>
  )
}
