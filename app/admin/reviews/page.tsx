import { Check, Star, Trash2 } from "lucide-react"
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui"
import { adminReviews } from "@/lib/admin-data"

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? "size-3.5 fill-amber-400 text-amber-400" : "size-3.5 text-border"}
        />
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  return (
    <div>
      <AdminPageHeader title="Reviews" breadcrumb={["Dashboard", "Reviews"]} />

      <div className="grid grid-cols-1 gap-4">
        {adminReviews.map((r) => (
          <AdminCard key={r.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{r.customer}</span>
                  <Stars rating={r.rating} />
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  on <span className="font-medium text-foreground">{r.product}</span> · {r.date}
                </p>
                <p className="mt-2 text-sm text-foreground">{r.comment}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {r.status === "Pending" && (
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100">
                    <Check className="size-3.5" />
                    Approve
                  </button>
                )}
                <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive" aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  )
}
