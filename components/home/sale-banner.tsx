import Image from "next/image"
import Link from "next/link"

export function SaleBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-secondary">
      <Image
        src="/summer-sale.png"
        alt="Living room corner with media console and armchair"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="relative grid max-w-xl gap-3 px-8 py-12 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-card/95 via-card/80 to-transparent" />
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Summer Sale</p>
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Up to 30% Off</h2>
        <p className="max-w-sm text-pretty text-muted-foreground">
          Refresh your home with our summer collection.
        </p>
        <Link
          href="/shop"
          className="mt-2 inline-flex w-fit items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Shop the Sale
        </Link>
      </div>
    </section>
  )
}
