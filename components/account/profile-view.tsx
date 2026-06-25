"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { authInputClass } from "@/components/auth/auth-shell"

export function ProfileView() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [saved, setSaved] = useState(false)

  if (!user) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({ name, email, phone })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
          {user.name.charAt(0).toUpperCase() || "U"}
        </span>
        <div>
          <p className="font-semibold text-foreground">{user.name || "Buyer"}</p>
          <p className="text-sm text-muted-foreground">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={authInputClass} required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+255 700 000 000"
          className={authInputClass}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {saved ? <Check className="size-4" /> : null}
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </form>
  )
}
