import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrustBar } from "@/components/trust-bar"
import { Hero } from "@/components/home/hero"
import { ShopByCategory } from "@/components/home/shop-by-category"
import { FeaturedProducts } from "@/components/home/featured-products"
import { SaleBanner } from "@/components/home/sale-banner"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        <Hero />
        <TrustBar className="mt-6" />
        <div className="mt-12 space-y-14">
          <ShopByCategory />
          <FeaturedProducts />
          <SaleBanner />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
