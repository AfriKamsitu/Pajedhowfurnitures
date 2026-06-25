import { AdminPageHeader } from "@/components/admin/admin-ui"
import { SettingsView } from "@/components/admin/settings-view"

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader title="System Settings" breadcrumb={["Dashboard", "Settings"]} />
      <SettingsView />
    </div>
  )
}
