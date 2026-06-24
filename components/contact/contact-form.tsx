"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

const inputClass =
  "w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"

export function ContactForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="text-lg font-semibold text-foreground">Message sent!</h3>
        <p className="text-sm text-muted-foreground">Thanks for reaching out. Our team will reply within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-xl border border-border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
          <input required className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
          <input required type="email" className={inputClass} placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
        <input required className={inputClass} placeholder="How can we help?" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
        <textarea required rows={5} className={`${inputClass} resize-none`} placeholder="Write your message..." />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto sm:justify-self-start sm:px-10"
      >
        Send Message
      </button>
    </form>
  )
}
