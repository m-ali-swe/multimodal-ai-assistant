"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { Mail, Lock, ArrowRight } from "lucide-react"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const body = { email: email, password: password }
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      })
      const data = await res.json()

      if (data.error) {
        alert(data.error)
      } else if (data.message) {
        window.location.href = "/"
      }
    } catch (error) {
      alert(`Signup failed. Please try again : ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2 animate-in fade-in duration-700">Sign Up</h1>
          <p className="text-gray-300 text-sm">Create your account and start exploring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white font-medium text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-white font-medium text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-10"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-400/80 to-teal-400/80 hover:from-purple-500/90 hover:to-teal-500/90 text-white font-semibold py-2 rounded-xl transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed h-10 shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Create Account
                <ArrowRight className="size-4" />
              </div>
            )}
          </Button>

          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-purple-300 hover:text-teal-300 font-semibold transition-all duration-200 hover:underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="text-purple-300 hover:text-teal-300 transition-colors hover:underline underline-offset-2"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-purple-300 hover:text-teal-300 transition-colors hover:underline underline-offset-2"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
