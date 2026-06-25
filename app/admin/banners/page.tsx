import Image from "next/image"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { AdminPageHeader, PrimaryButton, StatusBadge } from "@/components/admin/admin-ui"
import { adminBanners } from "@/lib/admin-data"

export default function AdminBannersPage() {
  return (
    <div>
      <AdminPageHeader
        title="Banners"
        breadcrumb={["Dashboard", "Banners"]}
        actions={
          <PrimaryButton>
            <Plus className="size-4" />
            Add New Banner
          </PrimaryButton>
        }
      />

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Banner</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adminBanners.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <span className="relative block h-12 w-20 overflow-hidden rounded-lg bg-secondary">
                      <Image src={b.image || "/placeholder.svg"} alt={b.title} fill sizes="80px" className="object-cover" />
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{b.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.location}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
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
