import { ArrowUpRight, DollarSign, Repeat, ShoppingCart, Users } from "lucide-react"
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui"
import { RevenueBarChart, OrdersLineChart } from "@/components/admin/analytics-charts"

const kpis = [
  { label: "Avg. Order Value", value: "TZS 81,750", delta: "+4.3%", icon: DollarSign },
  { label: "Conversion Rate", value: "3.8%", delta: "+0.6%", icon: ShoppingCart },
  { label: "Returning Customers", value: "42%", delta: "+5.1%", icon: Repeat },
  { label: "New Customers", value: "186", delta: "+12.4%", icon: Users },
]

export default function AdminAnalyticsPage() {
  return (
    <div>
      <AdminPageHeader title="Analytics" breadcrumb={["Dashboard", "Analytics"]} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <AdminCard key={k.label}>
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="size-3.5" />
                  {k.delta}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{k.value}</p>
            </AdminCard>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-base font-semibold text-foreground">Revenue by Month</h2>
          <RevenueBarChart />
        </AdminCard>
        <AdminCard>
          <h2 className="mb-4 text-base font-semibold text-foreground">Orders Trend</h2>
          <OrdersLineChart />
        </AdminCard>
      </div>
    </div>
  )
}
