"use client"

import Link from "next/link"
import Image from "next/image"
import { Package } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { formatPrice } from "@/lib/data"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  Processing: "bg-accent/15 text-accent",
  Shipped: "bg-chart-3/15 text-chart-3",
  Delivered: "bg-primary/15 text-primary",
  Cancelled: "bg-destructive/15 text-destructive",
}

export function OrdersView() {
  const { user } = useAuth()
  if (!user) return null

  if (user.orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card py-20 text-center shadow-soft">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-accent">
          <Package className="size-7" />
        </span>
        <h2 className="text-xl font-semibold text-foreground">No orders yet</h2>
        <p className="text-sm text-muted-foreground">When you place an order, it will appear here.</p>
        <Link
          href="/shop"
          className="mt-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {user.orders.map((order) => (
        <div key={order.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Order #{order.id}</p>
              <p className="text-xs text-muted-foreground">Placed {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusStyles[order.status])}>
              {order.status}
            </span>
          </div>
          <ul className="divide-y divide-border">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-base font-bold text-foreground">{formatPrice(order.total)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
