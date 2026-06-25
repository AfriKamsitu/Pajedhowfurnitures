import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  Box,
  CalendarDays,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react"
import { AdminCard, StatusBadge } from "@/components/admin/admin-ui"
import {
  SalesOverviewChart,
  OrderStatusChart,
  SalesByCategoryChart,
} from "@/components/admin/dashboard-charts"
import { stats, topSelling, adminOrders, formatTZS } from "@/lib/admin-data"

const statIcons = {
  revenue: DollarSign,
  orders: ShoppingCart,
  customers: Users,
  products: Box,
}

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of your store performance</p>
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
          <CalendarDays className="size-4 text-muted-foreground" />
          May 20 - May 26, 2024
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = statIcons[s.icon]
          return (
            <AdminCard key={s.label}>
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="size-3.5" />
                  {s.delta}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">from last week</p>
            </AdminCard>
          )
        })}
      </div>

      {/* Sales overview + top selling */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Sales Overview</h2>
            </div>
            <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              This Week
            </span>
          </div>
          <SalesOverviewChart />
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Top Selling Products</h2>
            <Link href="/admin/products" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {topSelling.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  <Image src={p.image || "/placeholder.svg"} alt={p.name} fill sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{p.name}</span>
                </span>
                <span className="text-sm font-semibold text-foreground">{p.price}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      {/* Donuts + recent orders */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AdminCard>
          <h2 className="mb-4 text-base font-semibold text-foreground">Order Status</h2>
          <OrderStatusChart />
        </AdminCard>
        <AdminCard>
          <h2 className="mb-4 text-base font-semibold text-foreground">Sales by Category</h2>
          <SalesByCategoryChart />
        </AdminCard>
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {adminOrders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{o.id}</span>
                  <span className="block truncate text-xs text-muted-foreground">{o.customer}</span>
                </span>
                <span className="text-right">
                  <span className="block text-sm font-medium text-foreground">{formatTZS(o.total)}</span>
                </span>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  )
}
