"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { authInputClass } from "@/components/auth/auth-shell"
import { SocialAuth } from "@/components/auth/social-auth"
import { useAuth, type Role, DEMO_CUSTOMER } from "@/components/auth-provider"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")
  const { signIn, signInWithProvider } = useAuth()

  function destinationFor(role?: Role) {
    if (redirectTo) return redirectTo
    return role === "admin" ? "/admin" : "/account"
  }
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error, role } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    router.push(destinationFor(role))
    router.refresh()
  }

  function fillDemo(creds: { email: string; password: string }) {
    setError(null)
    setEmail(creds.email)
    setPassword(creds.password)
  }

  async function handleProvider(provider: "google" | "facebook") {
    setError(null)
    setLoading(true)
    const { role } = await signInWithProvider(provider)
    setLoading(false)
    router.push(destinationFor(role))
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">Demo customer login</p>
        <button
          type="button"
          onClick={() => fillDemo(DEMO_CUSTOMER)}
          className="flex w-full items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-left transition-colors hover:border-accent hover:bg-secondary"
        >
          <User className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 leading-tight">
            <span className="block text-sm font-medium text-foreground">Customer</span>
            <span className="block text-xs text-muted-foreground">
              {DEMO_CUSTOMER.email} · {DEMO_CUSTOMER.password}
            </span>
          </span>
          <span className="text-xs font-medium text-accent">Use</span>
        </button>
      </div>
      <SocialAuth action="Sign in" onProvider={handleProvider} />
      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`${authInputClass} pl-9`}
          />
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">Password</label>
          <Link href="/reset-password" className="text-xs font-medium text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            required
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`${authInputClass} px-9`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" className="size-4 rounded border-border accent-[var(--accent)]" />
        Remember me
      </label>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        Sign In
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
