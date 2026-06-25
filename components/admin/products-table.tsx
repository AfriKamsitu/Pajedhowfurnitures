"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ChevronDown, Eye, Filter, Pencil, Search, Trash2 } from "lucide-react"
import { StatusBadge } from "@/components/admin/admin-ui"
import { adminProducts, productTabs, formatTZS } from "@/lib/admin-data"

export function ProductsTable() {
  const [tab, setTab] = useState("All Products")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return adminProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    )
  }, [query])

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-4 pt-4">
        {productTabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.label)}
            className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.label
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                tab === t.label ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t.count}
            </span>
            {tab === t.label && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:bg-card"
          />
        </div>
        <button className="inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground sm:w-40">
          All Categories
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        <button className="inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground sm:w-36">
          All Status
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
          <Filter className="size-4 text-muted-foreground" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-y border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price (TZS)</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-secondary/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image src={p.image || "/placeholder.svg"} alt={p.name} fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 font-medium text-foreground">{p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.stock}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="View">
                      <Eye className="size-4" />
                    </button>
                    <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary" aria-label="Edit">
                      <Pencil className="size-4" />
                    </button>
                    <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive" aria-label="Delete">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">Showing 1 to 10 of 523 results</p>
        <div className="flex items-center gap-1">
          <button className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary">‹</button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`flex size-8 items-center justify-center rounded-md text-sm ${
                n === 1 ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="px-1 text-muted-foreground">…</span>
          <button className="flex size-8 items-center justify-center rounded-md border border-border text-sm text-foreground hover:bg-secondary">53</button>
          <button className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary">›</button>
        </div>
      </div>
    </div>
  )
}
