"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, FileText, FileSpreadsheet, Presentation, Image as ImageIcon, FileCode } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const body = { email, password }
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        const errorText = data.error || "Invalid email or password. Please check your credentials."
        setErrorMessage(errorText)
        toast.error("Authentication Failed", {
          description: errorText,
        })
      } else {
        toast.success("Welcome back!", {
          description: "Access granted to Multimodal AI System.",
        })
        setTimeout(() => {
          window.location.href = "/"
        }, 500)
      }
    } catch {
      const fallbackMsg = "Unable to connect to authentication server. Please try again."
      setErrorMessage(fallbackMsg)
      toast.error("Connection Error", {
        description: fallbackMsg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full max-w-sm sm:max-w-md mx-auto space-y-4", className)} {...props}>
      {/* Brand & Multimodal Identity Header without favicon */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group focus:outline-none">
          <span className="text-2xl font-bold tracking-tight text-white">
            Multimodal <span className="text-cyan-400">AI</span>
          </span>
        </Link>

        {/* Format Badges */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
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

      {/* Auth Card */}
      <Card className="bg-slate-900/90 border-slate-800 shadow-2xl shadow-cyan-950/20 text-slate-100 rounded-2xl overflow-hidden backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center pt-5 pb-3 px-6">
          <CardTitle className="text-xl font-bold tracking-tight text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs sm:text-sm">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pt-1 pb-5">
          {errorMessage && (
            <Alert variant="destructive" className="mb-3 bg-red-950/40 border-red-900/50 text-red-300 text-xs rounded-xl animate-in fade-in duration-200 py-2">
              <AlertCircle className="size-4 text-red-400 mt-0.5" />
              <div>
                <AlertTitle className="font-semibold text-red-200 text-xs">Authentication Error</AlertTitle>
                <AlertDescription className="text-red-300/90 text-xs mt-0.5">{errorMessage}</AlertDescription>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-300 font-medium text-xs">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/50 rounded-xl h-9 text-sm transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-300 font-medium text-xs">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/50 rounded-xl h-9 text-sm transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-xl transition-all duration-200 h-9 shadow-lg shadow-cyan-950/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="size-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-6 py-3 bg-slate-950/50 border-t border-slate-800/80 text-center justify-center">
          <p className="text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
