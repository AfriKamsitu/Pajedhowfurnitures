import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { type Product, formatPrice } from "@/lib/data"
import { StarRating } from "@/components/star-rating"

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            New
          </span>
        )}
        <button
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-accent"
        >
          <Heart className="size-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/product/${product.id}`}
          className="text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <StarRating rating={product.rating} reviews={product.reviews} />
      </div>
    </div>
  )
}
