"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/data"
import { useStore } from "@/components/store-provider"

export function CartView() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore()

  const shipping = cartTotal > 0 && cartTotal < 200000 ? 20000 : 0
  const total = cartTotal + shipping

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <ShoppingBag className="size-7" />
        </span>
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="mt-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 border-b border-border p-4 last:border-0"
            >
              <Link
                href={`/product/${item.product.id}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-md bg-secondary"
              >
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs capitalize text-muted-foreground">{item.product.material}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label="Remove item"
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex size-8 items-center justify-center hover:bg-secondary"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex size-8 items-center justify-center hover:bg-secondary"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          ← Continue Shopping
        </Link>
      </div>

      {/* Summary */}
      <div className="h-fit rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium text-foreground">{formatPrice(cartTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-3 text-base">
            <dt className="font-semibold text-foreground">Total</dt>
            <dd className="font-bold text-primary">{formatPrice(total)}</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="mt-5 flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
