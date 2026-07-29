import { LoginForm } from "@/app/(chat)/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="h-screen w-screen max-w-full overflow-hidden bg-[#090D17] text-slate-100 flex items-center justify-center p-4 relative select-none">
      {/* Subtle Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.06),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-auto">
        <LoginForm />
      </div>
    </div>
  )
}
