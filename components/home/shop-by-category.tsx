import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/data"

export function ShopByCategory() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
        <Link href="/shop" className="text-sm font-medium text-accent hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href="/shop"
            className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4 text-center transition-shadow hover:shadow-md"
          >
            <div className="relative size-16 overflow-hidden rounded-md bg-secondary">
              <Image
                src={cat.image || "/placeholder.svg"}
                alt={cat.name}
                fill
                sizes="64px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{cat.count} Items</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
