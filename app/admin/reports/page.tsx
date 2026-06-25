import { Download, FileBarChart, FileText, Package, Users } from "lucide-react"
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui"

const reports = [
  { title: "Sales Report", desc: "Revenue, orders and trends over a selected period.", icon: FileBarChart },
  { title: "Inventory Report", desc: "Stock levels, low-stock alerts and product movement.", icon: Package },
  { title: "Customer Report", desc: "Customer growth, retention and lifetime value.", icon: Users },
  { title: "Tax Report", desc: "Tax collected, summarized by month and category.", icon: FileText },
]

export default function AdminReportsPage() {
  return (
    <div>
      <AdminPageHeader title="Reports" breadcrumb={["Dashboard", "Reports"]} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reports.map((r) => {
          const Icon = r.icon
          return (
            <AdminCard key={r.title} className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground">{r.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                <div className="mt-3 flex gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                    <Download className="size-3.5" />
                    Export CSV
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary">
                    <Download className="size-3.5" />
                    Export PDF
                  </button>
                </div>
              </div>
            </AdminCard>
          )
        })}
      </div>
    </div>
  )
}
