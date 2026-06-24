import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrustBar } from "@/components/trust-bar"
import { ProductDetail } from "@/components/product/product-detail"
import { getProductById } from "@/lib/data"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="size-4" />
          <Link href="/shop" className="hover:text-accent">Sofas</Link>
          <ChevronRight className="size-4" />
          <span className="font-medium text-foreground">{product.name}</span>
        </nav>
        <ProductDetail product={product} />
        <TrustBar className="mt-12" />
      </main>
      <SiteFooter />
    </div>
  )
}
