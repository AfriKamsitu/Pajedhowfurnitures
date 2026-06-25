import type { Metadata } from "next"
import { Breadcrumb, PageShell } from "@/components/page-shell"
import { CartView } from "@/components/cart/cart-view"

export const metadata: Metadata = {
  title: "Shopping Cart — pajedhowfurnitures",
}

export default function CartPage() {
  return (
    <PageShell>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mb-6 mt-4 text-2xl font-bold text-foreground">Shopping Cart</h1>
      <CartView />
    </PageShell>
  )
}
