import { Suspense } from "react"
import type { Metadata } from "next"
import { Breadcrumb, PageShell } from "@/components/page-shell"
import { ShopBrowser } from "@/components/shop/shop-browser"

export const metadata: Metadata = {
  title: "Shop — pajedhowfurnitures",
}

export default function ShopPage() {
  return (
    <PageShell>
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Sofas" }]} />
      </div>
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading products…</div>}>
        <ShopBrowser />
      </Suspense>
    </PageShell>
  )
}
