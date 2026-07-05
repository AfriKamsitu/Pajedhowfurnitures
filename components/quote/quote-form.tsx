"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, FileText, MessageCircle } from "lucide-react"
import { type Product, formatPrice, getProductMeta } from "@/lib/data"
import { addQuoteRequest } from "@/lib/quote-requests"
import { openWhatsApp } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

const MATERIALS = ["As shown", "Reclaimed Wood", "Teak", "Mahogany", "Hardwood"]

export function QuoteForm({ product }: { product: Product }) {
  const meta = getProductMeta(product)
  const [quantity, setQuantity] = useState(meta.moq)
  const [color, setColor] = useState("As shown")
  const [material, setMaterial] = useState("As shown")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [customization, setCustomization] = useState("")
  const [instructions, setInstructions] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function buildMessage() {
    return [
      `*Quote request — ${product.name}*`,
      `Reference price: ${formatPrice(product.price)}`,
      `Quantity: ${quantity}`,
      `Preferred colour: ${color}`,
      `Preferred material: ${material}`,
      location && `Delivery location: ${location}`,
      date && `Preferred delivery date: ${date}`,
      customization && `Customisation: ${customization}`,
      instructions && `Special instructions: ${instructions}`,
      "Please send your best quotation including delivery. Thank you.",
    ]
      .filter(Boolean)
      .join("\n")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const message = buildMessage()
    addQuoteRequest({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity,
      color,
      material,
      location,
      deliveryDate: date,
      customization,
      instructions,
      message,
    })
    openWhatsApp(message)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h2 className="mt-4 text-xl font-bold text-foreground">Quote request sent</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your request for <span className="font-medium text-foreground">{product.name}</span> has opened in WhatsApp and
          is saved under <span className="font-medium text-foreground">My Quotes</span>. Continue the conversation on
          WhatsApp to negotiate pricing, confirm delivery and share room photos.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => openWhatsApp(buildMessage())}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="size-4" /> Continue on WhatsApp
          </button>
          <Link
            href="/account/quotes"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            View my quotes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="order-2 space-y-4 lg:order-1">
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Quantity" required>
            <input
              type="number"
              min={meta.moq}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(meta.moq, Number(e.target.value)))}
              className="input"
            />
          </Labeled>
          <Labeled label="Preferred color">
            <input value={color} onChange={(e) => setColor(e.target.value)} className="input" placeholder="e.g. Light grey" />
          </Labeled>
          <Labeled label="Preferred material">
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="input">
              {MATERIALS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Preferred delivery date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </Labeled>
        </div>
        <Labeled label="Delivery location" required>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="input"
            placeholder="City / region, Tanzania"
          />
        </Labeled>
        <Labeled label="Customization notes">
          <textarea
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            rows={3}
            className="input resize-none"
            placeholder="Dimensions, fabric, finish or any custom requirements"
          />
        </Labeled>
        <Labeled label="Special instructions">
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={2}
            className="input resize-none"
            placeholder="Anything else the seller should know"
          />
        </Labeled>
        <p className="text-xs text-muted-foreground">
          Submitting opens WhatsApp with your request pre-filled — you can attach room photos and documents there.
        </p>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          <FileText className="size-4" /> Submit Quote Request
        </button>
      </form>

      {/* Product summary */}
      <aside className="order-1 lg:order-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex gap-3">
            <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill sizes="80px" className="object-cover" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold text-foreground">{product.name}</p>
              <p className="mt-1 text-lg font-bold text-primary">{formatPrice(product.price)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Reference price · negotiable</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 border-t border-border pt-3 text-xs">
            <SummaryRow label="Supplier" value={meta.supplier.name} />
            <SummaryRow label="Min. order" value={`${meta.moq} unit(s)`} />
            <SummaryRow label="Delivery" value={`${meta.deliveryDays} days`} />
            <SummaryRow label="Warranty" value={`${meta.warrantyMonths} months`} />
          </dl>
        </div>
      </aside>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  )
}

function Labeled({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3")}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  )
}
