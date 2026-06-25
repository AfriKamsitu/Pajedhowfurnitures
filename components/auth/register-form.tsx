"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { authInputClass } from "@/components/auth/auth-shell"
import { SocialAuth } from "@/components/auth/social-auth"

export function RegisterForm() {
  const [show, setShow] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <SocialAuth action="Sign up" />
      {submitted && (
        <p className="rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
          This is a demo sign-up form. Connect an auth provider to enable real accounts.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">First Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input required placeholder="John" className={`${authInputClass} pl-9`} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Last Name</label>
          <input required placeholder="Doe" className={authInputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input required type="email" placeholder="you@example.com" className={`${authInputClass} pl-9`} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            required
            minLength={8}
            type={show ? "text" : "password"}
            placeholder="At least 8 characters"
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
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input required type="checkbox" className="mt-0.5 size-4 rounded border-border accent-[var(--accent)]" />
        <span>
          I agree to the{" "}
          <Link href="/" className="font-medium text-accent hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="font-medium text-accent hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Create Account
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
