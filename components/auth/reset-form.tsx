"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, MailCheck } from "lucide-react"
import { authInputClass } from "@/components/auth/auth-shell"

export function ResetForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="grid gap-5 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <MailCheck className="size-7" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Check your inbox</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            If an account exists for that email, we&apos;ve sent a link to reset your password.
          </p>
        </div>
        <Link
          href="/login"
          className="mx-auto flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input required type="email" placeholder="you@example.com" className={`${authInputClass} pl-9`} />
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Send Reset Link
      </button>
      <Link
        href="/login"
        className="mx-auto flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </form>
  )
}
