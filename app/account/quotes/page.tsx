import type { Metadata } from "next"
import { AccountShell } from "@/components/account/account-shell"
import { QuotesView } from "@/components/account/quotes-view"

export const metadata: Metadata = {
  title: "My Quotes — pajedhowfurnitures",
}

export default function QuotesPage() {
  return (
    <AccountShell title="My Quotes">
      <QuotesView />
    </AccountShell>
  )
}
