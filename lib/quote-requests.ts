"use client"

import { useEffect, useState } from "react"

// Lightweight, localStorage-backed store for customer quote requests.
// Replaces the previous chat-thread persistence now that enquiries go to WhatsApp.

export type QuoteStatus = "sent" | "answered" | "closed"

export type QuoteRequest = {
  id: string
  productId?: string
  productName: string
  productImage?: string
  price?: number
  quantity: number
  color?: string
  material?: string
  location?: string
  deliveryDate?: string
  customization?: string
  instructions?: string
  message: string
  status: QuoteStatus
  createdAt: number
}

const KEY = "pajedhow.quote-requests"
const EVENT = "pajedhow:quote-requests-changed"

function read(): QuoteRequest[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as QuoteRequest[]) : []
  } catch {
    return []
  }
}

function write(list: QuoteRequest[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function addQuoteRequest(input: Omit<QuoteRequest, "id" | "createdAt" | "status"> & { status?: QuoteStatus }) {
  const entry: QuoteRequest = {
    ...input,
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    status: input.status ?? "sent",
    createdAt: Date.now(),
  }
  write([entry, ...read()])
  return entry
}

export function removeQuoteRequest(id: string) {
  write(read().filter((q) => q.id !== id))
}

/** Subscribe to the quote list. Re-renders on add/remove and cross-tab changes. */
export function useQuoteRequests() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])

  useEffect(() => {
    const sync = () => setQuotes(read())
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  return quotes
}
