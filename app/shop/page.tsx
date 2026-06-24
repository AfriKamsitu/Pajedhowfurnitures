import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShopBrowser } from "@/components/shop/shop-browser"

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="size-4" />
          <Link href="/shop" className="hover:text-accent">Shop</Link>
          <ChevronRight className="size-4" />
          <span className="font-medium text-foreground">Sofas</span>
        </nav>
        <ShopBrowser />
      </main>
      <SiteFooter />
    </div>
  )
}
