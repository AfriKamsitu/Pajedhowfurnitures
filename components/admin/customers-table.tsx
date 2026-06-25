"use client"

import { useMemo, useState } from "react"
import { Filter, Mail, Pencil, Search } from "lucide-react"
import { StatusBadge } from "@/components/admin/admin-ui"
import { adminCustomers, formatTZS } from "@/lib/admin-data"

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("")
}

export function CustomersTable() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return adminCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()),
    )
  }, [query])

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:bg-card"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
          <Filter className="size-4 text-muted-foreground" />
          Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-y border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total Spent</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-secondary/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {initials(c.name)}
                    </span>
                    <span className="font-medium text-foreground">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                <td className="px-4 py-3 text-foreground">{c.orders}</td>
                <td className="px-4 py-3 font-medium text-foreground">{formatTZS(c.spent)}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary" aria-label="Edit">
                      <Pencil className="size-4" />
                    </button>
                    <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Email">
                      <Mail className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">Showing 1 to 7 of 1,246 results</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`flex size-8 items-center justify-center rounded-md text-sm ${n === 1 ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"}`}
            >
              {n}
            </button>
          ))}
          <span className="px-1 text-muted-foreground">…</span>
          <button className="flex size-8 items-center justify-center rounded-md border border-border text-sm text-foreground hover:bg-secondary">178</button>
        </div>
      </div>
    </div>
  )
}
