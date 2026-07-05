"use client"

import Image from "next/image"
import Link from "next/link"
import { FileText, MessageCircle, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/data"
import { useQuoteRequests, removeQuoteRequest, type QuoteStatus } from "@/lib/quote-requests"
import { openWhatsApp } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

const statusStyles: Record<QuoteStatus, string> = {
  sent: "bg-amber-100 text-amber-700",
  answered: "bg-green-100 text-green-700",
  closed: "bg-secondary text-muted-foreground",
}

const statusLabels: Record<QuoteStatus, string> = {
  sent: "Sent",
  answered: "Answered",
  closed: "Closed",
}

export function QuotesView() {
  const quotes = useQuoteRequests()

  if (quotes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <FileText className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-3 font-semibold text-foreground">No quotes yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Request a quote from any product and it will be saved here. We&apos;ll reply on WhatsApp with a tailored offer.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {quotes.map((row) => (
        <div
          key={row.id}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
        >
          <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
            <Image
              src={row.productImage || "/placeholder.svg"}
              alt={row.productName}
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-foreground">{row.productName}</p>
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", statusStyles[row.status])}>
                {statusLabels[row.status]}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {row.quantity} unit(s)
              {row.material && row.material !== "As shown" ? ` · ${row.material}` : ""}
              {row.location ? ` · ${row.location}` : ""}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Requested {new Date(row.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
            {row.price ? <p className="text-lg font-bold text-primary">{formatPrice(row.price)}</p> : <span />}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openWhatsApp(row.message)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
              >
                <MessageCircle className="size-3.5" />
                WhatsApp
              </button>
              <button
                onClick={() => removeQuoteRequest(row.id)}
                aria-label="Remove quote request"
                className="inline-flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
