"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, MapPin, Package, ShoppingBag } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useStore } from "@/components/store-provider"
import { formatPrice } from "@/lib/data"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  Processing: "bg-accent/15 text-accent",
  Shipped: "bg-chart-3/15 text-chart-3",
  Delivered: "bg-primary/15 text-primary",
  Cancelled: "bg-destructive/15 text-destructive",
}

export function DashboardView() {
  const { user } = useAuth()
  const { wishlistCount, cartCount } = useStore()
  if (!user) return null

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0)
  const stats = [
    { label: "Total Orders", value: user.orders.length, icon: Package, href: "/account/orders" },
    { label: "In Cart", value: cartCount, icon: ShoppingBag, href: "/cart" },
    { label: "Wishlist", value: wishlistCount, icon: Heart, href: "/wishlist" },
    { label: "Addresses", value: user.addresses.length, icon: MapPin, href: "/account/addresses" },
  ]
  const recent = user.orders.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <p className="text-xl font-bold text-foreground">{user.name || "Buyer"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ve spent {formatPrice(totalSpent)} across {user.orders.length} order
          {user.orders.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-accent">
              <s.icon className="size-5" />
            </span>
            <p className="mt-3 text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <Package className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/shop"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((order) => (
              <li key={order.id} className="flex items-center gap-4 px-5 py-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image src={order.items[0]?.image || "/placeholder.svg"} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.date).toLocaleDateString()} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[order.status])}>
                    {order.status}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-foreground">{formatPrice(order.total)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
