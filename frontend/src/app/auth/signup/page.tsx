import { SignupForm } from "@/app/(chat)/components/SignupForm"

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full relative bg-[#090D17] text-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Background Subtle Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.06),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-auto py-6">
        <SignupForm />
      </div>
    </div>
  )
}
