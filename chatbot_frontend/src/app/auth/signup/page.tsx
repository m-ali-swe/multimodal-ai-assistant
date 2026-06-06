import { SignupForm } from "@/app/(chat)/components/SignupForm"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-400/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-400/10 via-transparent to-transparent"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse duration-3000"></div>
        <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-teal-400/50 rounded-full animate-pulse delay-1000 duration-4000"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-pink-400/30 rounded-full animate-pulse delay-500 duration-5000"></div>
        <div className="absolute top-1/6 right-1/3 w-0.5 h-0.5 bg-blue-400/40 rounded-full animate-pulse delay-700 duration-3500"></div>
        <div className="absolute top-2/3 left-1/6 w-1 h-1 bg-purple-300/30 rounded-full animate-pulse delay-1500 duration-4500"></div>
        <div className="absolute top-1/3 right-2/3 w-0.5 h-0.5 bg-teal-300/40 rounded-full animate-pulse delay-2000 duration-6000"></div>
      </div>

      <div className="relative z-10 flex h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-white hover:text-purple-300 transition-colors"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 shadow-lg">
                <Sparkles className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
                ChatBot
              </span>
            </Link>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  )
}
