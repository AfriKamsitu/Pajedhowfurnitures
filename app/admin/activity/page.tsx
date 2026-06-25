import { Activity } from "lucide-react"
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui"
import { activityLogs } from "@/lib/admin-data"

export default function AdminActivityPage() {
  return (
    <div>
      <AdminPageHeader title="Activity Logs" breadcrumb={["Dashboard", "Activity Logs"]} />

      <AdminCard>
        <ol className="space-y-5">
          {activityLogs.map((log, i) => (
            <li key={log.id} className="relative flex gap-4 pb-5 last:pb-0">
              {i < activityLogs.length - 1 && (
                <span className="absolute left-[18px] top-9 h-[calc(100%-1rem)] w-px bg-border" />
              )}
              <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Activity className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{log.user}</span> {log.action.toLowerCase()}{" "}
                  <span className="font-medium text-primary">{log.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{log.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </AdminCard>
    </div>
  )
}
