import type { Metadata } from "next"
import { AccountShell } from "@/components/account/account-shell"
import { DashboardView } from "@/components/account/dashboard-view"

export const metadata: Metadata = {
  title: "My Account — pajedhowfurnitures",
}

export default function AccountPage() {
  return (
    <AccountShell title="Dashboard">
      <DashboardView />
    </AccountShell>
  )
}
