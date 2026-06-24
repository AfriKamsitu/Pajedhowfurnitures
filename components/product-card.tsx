"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { type Product, formatPrice } from "@/lib/data"
import { StarRating } from "@/components/star-rating"
import { useStore } from "@/components/store-provider"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const wished = isInWishlist(product.id)

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:ring-accent/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground shadow-accent-glow">
            New
          </span>
        )}
        <button
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product)}
          className={cn(
            "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/90 shadow-soft backdrop-blur-sm transition-all duration-200 hover:scale-110",
            wished ? "text-accent" : "text-muted-foreground hover:text-accent",
          )}
        >
          <Heart className={cn("size-4 transition-transform", wished && "scale-110 fill-accent")} />
        </button>
        <button
          onClick={() => addToCart(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-12 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground opacity-0 shadow-elevated transition-all duration-300 hover:bg-primary/90 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingCart className="size-3.5" />
          Add to Cart
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
