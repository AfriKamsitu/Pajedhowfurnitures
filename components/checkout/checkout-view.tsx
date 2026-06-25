"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, CreditCard, Truck } from "lucide-react"
import { formatPrice } from "@/lib/data"
import { useStore } from "@/components/store-provider"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"

export function CheckoutView() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useStore()
  const { user, addOrder } = useAuth()
  const [payment, setPayment] = useState<"card" | "mobile" | "cod">("card")
  const [placed, setPlaced] = useState(false)

  const shipping = cartTotal > 0 && cartTotal < 200000 ? 20000 : 0
  const total = cartTotal + shipping

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (user) {
      addOrder({
        id: Math.random().toString(36).slice(2, 8).toUpperCase(),
        date: new Date().toISOString(),
        status: "Processing",
        total,
        items: cart.map((item) => ({
          name: item.product.name,
          image: item.product.image,
          quantity: item.quantity,
          price: item.product.price,
        })),
      })
    }
    setPlaced(true)
    clearCart()
    setTimeout(() => router.push(user ? "/account/orders" : "/"), 3500)
  }

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="text-2xl font-bold text-foreground">Order Placed!</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for shopping with pajedhowfurnitures. A confirmation has been sent to your email. Redirecting you home…
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">Add items before checking out.</p>
        <Link
          href="/shop"
          className="mt-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="grid gap-6 lg:col-span-2">
        {/* Shipping */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Truck className="size-5 text-accent" />
            Shipping Information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">First Name</label>
              <input required className={inputClass} placeholder="John" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Last Name</label>
              <input required className={inputClass} placeholder="Doe" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input required type="email" className={inputClass} placeholder="john@example.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input required type="tel" className={inputClass} placeholder="+255 700 000 000" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
              <input required className={inputClass} placeholder="123 Furniture St" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">City</label>
              <input required className={inputClass} placeholder="Dar es Salaam" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Region</label>
              <input required className={inputClass} placeholder="Coastal" />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CreditCard className="size-5 text-accent" />
            Payment Method
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { id: "card", label: "Credit Card" },
              { id: "mobile", label: "Mobile Money" },
              { id: "cod", label: "Cash on Delivery" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPayment(opt.id as typeof payment)}
                className={cn(
                  "rounded-md border px-4 py-3 text-sm font-medium transition-colors",
                  payment === opt.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-accent/50",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {payment === "card" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Card Number</label>
                <input required className={inputClass} placeholder="1234 5678 9012 3456" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Expiry</label>
                <input required className={inputClass} placeholder="MM/YY" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">CVV</label>
                <input required className={inputClass} placeholder="123" />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Summary */}
      <div className="h-fit rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Your Order</h2>
        <div className="mt-4 grid gap-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                  {item.quantity}
                </span>
              </div>
              <span className="flex-1 text-sm text-foreground">{item.product.name}</span>
              <span className="text-sm font-medium text-primary">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <dl className="mt-5 grid gap-3 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium text-foreground">{formatPrice(cartTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-3 text-base">
            <dt className="font-semibold text-foreground">Total</dt>
            <dd className="font-bold text-primary">{formatPrice(total)}</dd>
          </div>
        </dl>
        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Place Order
        </button>
      </div>
    </form>
  )
}
