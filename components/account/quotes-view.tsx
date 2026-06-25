"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { FileText, MessageCircle } from "lucide-react"
import { useChat, type Quote } from "@/components/chat-provider"
import { formatPrice } from "@/lib/data"
import { openChat } from "@/components/chat/chat-widget"
import { cn } from "@/lib/utils"

type QuoteRow = {
  conversationId: string
  createdAt: number
  productName: string
  productImage?: string
  productId?: string
  quote: Quote
}

const statusStyles: Record<Quote["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  revision: "bg-blue-100 text-blue-700",
}

export function QuotesView() {
  const { myConversations, messagesFor } = useChat()

  const rows = useMemo<QuoteRow[]>(() => {
    const out: QuoteRow[] = []
    for (const conv of myConversations) {
      for (const m of messagesFor(conv.id)) {
        if (m.type === "quote" && m.quote) {
          out.push({
            conversationId: conv.id,
            createdAt: m.createdAt,
            productName: m.quote.productName || conv.product?.name || "Custom request",
            productImage: conv.product?.image,
            productId: m.quote.productId || conv.product?.id,
            quote: m.quote,
          })
        }
      }
    }
    return out.sort((a, b) => b.createdAt - a.createdAt)
  }, [myConversations, messagesFor])

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <FileText className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-3 font-semibold text-foreground">No quotes yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Request a quote from any product and the seller&apos;s tailored offers will appear here, ready to review and
          accept.
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
      {rows.map((row, i) => (
        <div
          key={`${row.conversationId}-${i}`}
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
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", statusStyles[row.quote.status])}>
                {row.quote.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {row.quote.quantity} unit(s) · {row.quote.discountPct}% off · {row.quote.etaDays}-day delivery
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Quoted {new Date(row.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
            <p className="text-lg font-bold text-primary">{formatPrice(row.quote.total)}</p>
            <button
              onClick={() =>
                openChat(
                  row.productId
                    ? { id: row.productId, name: row.productName, price: row.quote.unitPrice, image: row.productImage || "" }
                    : undefined,
                )
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              <MessageCircle className="size-3.5" />
              Open chat
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
