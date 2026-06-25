import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { QuoteForm } from "@/components/quote/quote-form"
import { getProductById } from "@/lib/data"

export default async function QuotePage({
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="size-4" />
          <Link href={`/product/${product.id}`} className="hover:text-accent">{product.name}</Link>
          <ChevronRight className="size-4" />
          <span className="font-medium text-foreground">Request Quote</span>
        </nav>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground text-balance">Request a Quote</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell the seller what you need. They&apos;ll reply in chat with a tailored quotation including delivery — no
            online payment required.
          </p>
        </header>
        <QuoteForm product={product} />
      </main>
      <SiteFooter />
    </div>
  )
}
