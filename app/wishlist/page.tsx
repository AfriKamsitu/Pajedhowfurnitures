import type { Metadata } from "next"
import { Breadcrumb, PageShell } from "@/components/page-shell"
import { WishlistView } from "@/components/wishlist/wishlist-view"

export const metadata: Metadata = {
  title: "Wishlist — pajedhowfurnitures",
}

export default function WishlistPage() {
  return (
    <PageShell>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mb-6 mt-4 text-2xl font-bold text-foreground">My Wishlist</h1>
      <WishlistView />
    </PageShell>
  )
}
