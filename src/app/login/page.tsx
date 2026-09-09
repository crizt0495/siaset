"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, Boxes, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Username atau password salah")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-dvh bg-paper relative overflow-hidden flex items-center justify-center px-4 py-6">
      {/* Decorative background */}
      <div className="absolute inset-0 brut-stripe pointer-events-none" />
      <div className="absolute top-8 -left-16 w-56 h-56 bg-primary border-[3px] border-ink rotate-12 pointer-events-none hidden md:block" />
      <div className="absolute bottom-10 -right-20 w-72 h-72 bg-warn border-[3px] border-ink -rotate-12 pointer-events-none hidden md:block" />
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-danger border-[3px] border-ink rotate-45 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-good border-[3px] border-ink rotate-12 pointer-events-none hidden lg:block" />

      {/* Ticker */}
      <div className="brut-marquee fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-10 !shadow-none">
        <div className="brut-marquee-inner !text-[0.7rem] !py-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-3">
              GKJW Probolinggo
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 12 12">
                <path d="M6 0l6 6-6 6-6-6z" />
              </svg>
              Sistem Informasi Aset
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 12 12">
                <path d="M6 0l6 6-6 6-6-6z" />
              </svg>
            </span>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md relative brut-pop">
        {/* Stacked shadow card */}
        <div className="relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-ink border-[3px] border-ink" />
          <div className="relative bg-card border-[3px] border-ink p-6 sm:p-10 rotate-[-0.6deg] sm:hover:rotate-0 transition-transform duration-200">
            {/* Sticker badges */}
            <div className="brut-sticker w-14 h-14 text-xl -rotate-6 mb-5">
              <Boxes className="w-7 h-7" strokeWidth={3} />
            </div>
            <span className="brut-sticker absolute -top-4 -right-4 w-16 h-16 rounded-full text-[0.55rem] leading-tight p-2 rotate-12 text-center bg-danger">
              Login <br /> di sini
            </span>

            <h1 className="brut-title brut-h1">
              SIASET<span className="text-primary">.</span>
            </h1>
            <p className="text-sm font-bold text-muted uppercase tracking-[0.18em] mt-1.5">
              Sistem Inventaris Aset GKJW
            </p>

            <div className="w-full h-[3px] bg-warn mt-5 mb-7" />

            {error && (
              <div className="brut-card mb-5 bg-danger !border-3 p-3.5 !shadow-[3px_3px_0_0_var(--shadow)]">
                <p className="text-sm font-bold text-white">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="brut-field-label">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" strokeWidth={2.75} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="brut-input !pl-11"
                    placeholder="Masukkan username"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="brut-field-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" strokeWidth={2.75} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="brut-input !pl-11 !pr-12"
                    placeholder="Masukkan password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors"
                    aria-label="Tampilkan password"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2.75} /> : <Eye className="w-5 h-5" strokeWidth={2.75} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="brut-btn brut-btn-primary w-full !py-3 text-sm"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
                  </svg>
                ) : (
                  <>
                    Masuk Sekarang
                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 mt-7">
              <div className="flex-1 h-[3px] bg-paper2" />
              <span className="text-[0.6rem] font-bold text-muted uppercase tracking-[0.2em]">GKJW Probolinggo &copy; 2025</span>
              <div className="flex-1 h-[3px] bg-paper2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}