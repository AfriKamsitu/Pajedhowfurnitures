import type { Metadata } from "next"
import { Breadcrumb, PageShell } from "@/components/page-shell"
import { CheckoutView } from "@/components/checkout/checkout-view"

export const metadata: Metadata = {
  title: "Checkout — pajedhowfurnitures",
}

export default function CheckoutPage() {
  return (
    <PageShell>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <h1 className="mb-6 mt-4 text-2xl font-bold text-foreground">Checkout</h1>
      <CheckoutView />
    </PageShell>
  )
}
