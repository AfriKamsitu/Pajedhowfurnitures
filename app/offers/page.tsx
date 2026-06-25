import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Tag } from "lucide-react"
import { Breadcrumb, PageShell } from "@/components/page-shell"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"

export const metadata: Metadata = {
  title: "Offers & Deals — pajedhowfurnitures",
  description: "Save big on stylish furniture with pajedhowfurnitures's seasonal offers and discounts.",
}

const promoCodes = [
  { code: "SUMMER30", desc: "30% off all sofas", note: "Min. spend TZS 500,000" },
  { code: "FREESHIP", desc: "Free delivery", note: "On orders over TZS 200,000" },
  { code: "NEWHOME10", desc: "10% off first order", note: "New customers only" },
]

export default function OffersPage() {
  const deals = products.filter((p) => p.oldPrice)
  const onSale = deals.length > 0 ? deals : products.slice(0, 4)

  return (
    <PageShell>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Offers" }]} />

      {/* Hero banner */}
      <section className="relative mt-6 min-h-[260px] overflow-hidden rounded-xl bg-secondary">
        <Image src="/summer-sale.png" alt="Summer sale promotion" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-transparent" />
        <div className="relative grid max-w-xl gap-3 px-8 py-14 text-primary-foreground lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Limited Time</p>
          <h1 className="text-balance text-4xl font-bold">Summer Sale — Up to 30% Off</h1>
          <p className="max-w-sm text-pretty text-primary-foreground/85">
            Refresh your home with our seasonal collection. Discounts applied automatically at checkout.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex w-fit rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Shop the Sale
          </Link>
        </div>
      </section>

      {/* Promo codes */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-foreground">Active Promo Codes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {promoCodes.map((p) => (
            <div key={p.code} className="rounded-xl border border-dashed border-accent/50 bg-accent/5 p-5">
              <div className="flex items-center gap-2 text-accent">
                <Tag className="size-4" />
                <span className="text-lg font-bold tracking-wide">{p.code}</span>
              </div>
              <p className="mt-2 font-medium text-foreground">{p.desc}</p>
              <p className="text-xs text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discounted products */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-foreground">On Sale Now</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-3">
          {onSale.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </PageShell>
  )
}
