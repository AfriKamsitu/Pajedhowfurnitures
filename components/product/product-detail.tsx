"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Repeat,
  ShoppingCart,
} from "lucide-react"
import { type Product, formatPrice } from "@/lib/data"
import { StarRating } from "@/components/star-rating"
import { cn } from "@/lib/utils"

export function ProductDetail({ product }: { product: Product }) {
  const gallery = [
    product.image,
    "/hero-living-room.png",
    "/sofa-minimalist.png",
    "/sofa-lshaped.png",
    "/sofa-recliner.png",
  ]
  const [active, setActive] = useState(0)
  const [color, setColor] = useState(product.colors[0])
  const [qty, setQty] = useState(1)

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 overflow-hidden rounded-md border-2 bg-secondary",
                active === i ? "border-accent" : "border-border",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img || "/placeholder.svg"} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative aspect-square flex-1 overflow-hidden rounded-lg border border-border bg-secondary">
          <Image
            src={gallery[active] || "/placeholder.svg"}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
          <button
            onClick={() => setActive((a) => (a - 1 + gallery.length) % gallery.length)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-secondary"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => setActive((a) => (a + 1) % gallery.length)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-secondary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm text-muted-foreground">({product.reviews} Reviews)</span>
          </div>
          <span className="text-sm text-muted-foreground">45 Sold</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
          {discount && (
            <span className="rounded bg-destructive px-2 py-1 text-xs font-semibold text-primary-foreground">
              -{discount}%
            </span>
          )}
        </div>

        <p className="mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
          A stylish and comfortable {product.name.toLowerCase()} that fits perfectly in any living room. Made with high
          quality materials for durability and maximum comfort.
        </p>

        {/* Color */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Color:</span>
          <div className="flex gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                className={cn(
                  "size-8 rounded-full border-2 transition-all",
                  color === c ? "border-accent ring-2 ring-accent/30" : "border-border",
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Quantity:</span>
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex size-9 items-center justify-center text-foreground hover:bg-secondary"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex size-9 items-center justify-center text-foreground hover:bg-secondary"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <span className="size-2 rounded-full bg-primary" />
            In Stock
          </span>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-wrap gap-3">
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:flex-none sm:px-10">
            <ShoppingCart className="size-4" />
            Add to Cart
          </button>
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:flex-none sm:px-10">
            Buy Now
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <button className="flex items-center gap-2 transition-colors hover:text-accent">
            <Heart className="size-4" />
            Add to Wishlist
          </button>
          <button className="flex items-center gap-2 transition-colors hover:text-accent">
            <Repeat className="size-4" />
            Compare
          </button>
        </div>
      </div>
    </div>
  )
}
