import { Pencil, Plus, Trash2 } from "lucide-react"
import { AdminPageHeader, PrimaryButton, StatusBadge } from "@/components/admin/admin-ui"
import { adminCoupons } from "@/lib/admin-data"

export default function AdminCouponsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        breadcrumb={["Dashboard", "Coupons"]}
        actions={
          <PrimaryButton>
            <Plus className="size-4" />
            Add New Coupon
          </PrimaryButton>
        }
      />

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Coupon Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Usage</th>
                <th className="px-4 py-3 font-medium">Valid Until</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adminCoupons.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-secondary px-2 py-1 font-mono text-xs font-semibold text-foreground">{c.code}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{c.discount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.usage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.validUntil}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
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
      </div>
    </div>
  )
}
