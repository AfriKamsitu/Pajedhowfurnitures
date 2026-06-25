"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Eye, Filter, Search } from "lucide-react"
import { StatusBadge } from "@/components/admin/admin-ui"
import { adminOrders, orderTabs, formatTZS } from "@/lib/admin-data"

export function OrdersTable() {
  const [tab, setTab] = useState("All Orders")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return adminOrders.filter((o) => {
      const matchesTab = tab === "All Orders" || o.status === tab
      const matchesQuery =
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase())
      return matchesTab && matchesQuery
    })
  }, [tab, query])

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-4 pt-4">
        {orderTabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.label)}
            className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.label ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${tab === t.label ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {t.count}
            </span>
            {tab === t.label && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:bg-card"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
          <Filter className="size-4 text-muted-foreground" />
          Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-y border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-secondary/40">
                <td className="px-4 py-3 font-medium text-foreground">{o.id}</td>
                <td className="px-4 py-3 text-foreground">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3 font-medium text-foreground">{formatTZS(o.total)}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.payment}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/orders/${o.id.replace("#", "")}`}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                      aria-label={`View ${o.id}`}
                    >
                      <Eye className="size-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">Showing 1 to 7 of 348 results</p>
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
          <button className="flex size-8 items-center justify-center rounded-md border border-border text-sm text-foreground hover:bg-secondary">50</button>
        </div>
      </div>
    </div>
  )
}
