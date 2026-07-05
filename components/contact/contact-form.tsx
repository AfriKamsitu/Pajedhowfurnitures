"use client"

import { useState } from "react"
import { CheckCircle2, MessageCircle } from "lucide-react"
import { openWhatsApp } from "@/lib/whatsapp"

const inputClass =
  "w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  function buildMessage() {
    return [
      "Hello Paje Dhow Furniture,",
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      subject && `Subject: ${subject}`,
      message && `\n${message}`,
    ]
      .filter(Boolean)
      .join("\n")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    openWhatsApp(buildMessage())
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="text-lg font-semibold text-foreground">Message ready on WhatsApp</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          We&apos;ve opened WhatsApp with your message pre-filled. Send it and our team will reply shortly.
        </p>
        <button
          onClick={() => openWhatsApp(buildMessage())}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
        >
          <MessageCircle className="size-4" /> Open WhatsApp again
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-xl border border-border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClass}
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Write your message..."
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b] sm:w-auto sm:justify-self-start sm:px-10"
      >
        <MessageCircle className="size-4" /> Send via WhatsApp
      </button>
    </form>
  )
}
