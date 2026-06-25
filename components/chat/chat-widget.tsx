"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, FileText, MessageCircle, Package, X } from "lucide-react"
import {
  SELLER_ID,
  SELLER_NAME,
  formatChatTime,
  useChat,
  type ProductRef,
} from "@/components/chat-provider"
import { ChatThread } from "@/components/chat/chat-thread"
import { formatPrice } from "@/lib/data"
import { cn } from "@/lib/utils"

export const OPEN_CHAT_EVENT = "pajedhow:open-chat"

type OpenChatDetail = { product?: ProductRef | null; message?: string }

export function openChat(product?: ProductRef, opts?: { message?: string }) {
  window.dispatchEvent(
    new CustomEvent<OpenChatDetail>(OPEN_CHAT_EVENT, { detail: { product: product ?? null, message: opts?.message } }),
  )
}

export function ChatWidget() {
  const pathname = usePathname()
  const {
    identity,
    myConversations,
    ensureConversation,
    conversationById,
    messagesFor,
    sendMessage,
    unreadFor,
    totalUnread,
    isOnline,
  } = useChat()
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    function onOpen(e: Event) {
      const { product, message } = (e as CustomEvent<OpenChatDetail>).detail ?? {}
      const id = ensureConversation(product ? { product } : undefined)
      setActiveId(id)
      setOpen(true)
      if (message) {
        // Defer slightly so the conversation exists before posting.
        setTimeout(() => sendMessage(id, { type: "text", text: message }), 60)
      }
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen)
  }, [ensureConversation, sendMessage])

  if (identity.role === "seller" || pathname.startsWith("/admin")) return null

  const sellerOnline = isOnline(SELLER_ID)
  const active = activeId ? conversationById(activeId) : null
  const activeProduct = active?.product ?? null

  function previewOf(id: string) {
    const msgs = messagesFor(id)
    const last = msgs[msgs.length - 1]
    if (!last) return "No messages yet"
    if (last.type === "image") return "Photo"
    if (last.type === "quote") return "Quotation"
    if (last.type === "order") return "Order created"
    if (last.type === "product") return last.product?.name ?? "Product"
    return last.text ?? ""
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen((v) => !v)
          if (!open) ensureConversation()
        }}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated transition-transform hover:scale-105"
        aria-label="Chat with the store"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        {!open && totalUnread > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
            {totalUnread}
          </span>
        )}
      </button>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-0 z-50 flex flex-col overflow-hidden border-border bg-card shadow-elevated transition-all sm:inset-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[34rem] sm:max-h-[calc(100vh-8rem)] sm:w-[calc(100vw-2.5rem)] sm:max-w-sm sm:rounded-2xl sm:border",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
        role="dialog"
        aria-label="Chat with the store"
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
          {active ? (
            <button onClick={() => setActiveId(null)} aria-label="Back to conversations">
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15 font-semibold">
              P
            </span>
          )}
          <div className="flex-1 leading-tight">
            <p className="text-sm font-semibold">{active?.product ? active.product.name : SELLER_NAME}</p>
            <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
              <span className={cn("size-2 rounded-full", sellerOnline ? "bg-emerald-400" : "bg-primary-foreground/40")} />
              {sellerOnline ? "Online now" : "We reply as soon as possible"}
            </p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat">
            <X className="size-5" />
          </button>
        </div>

        {/* Product context bar */}
        {activeProduct && (
          <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 py-2">
            <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-background">
              <Image src={activeProduct.image || "/placeholder.svg"} alt="" fill sizes="36px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-xs font-semibold text-foreground">{activeProduct.name}</span>
              <span className="block text-[11px] text-primary">{formatPrice(activeProduct.price)}</span>
            </span>
            <Link
              href={`/product/${activeProduct.id}`}
              className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-foreground hover:bg-secondary"
            >
              View
            </Link>
            <Link
              href={`/quote/${activeProduct.id}`}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <FileText className="size-3" /> Quote
            </Link>
          </div>
        )}

        {/* Body: list or thread */}
        {active ? (
          <ChatThread conversationId={active.id} conversation={active} className="flex-1" />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <button
              onClick={() => setActiveId(ensureConversation())}
              className="flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left hover:bg-secondary"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="size-5" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-sm font-semibold text-foreground">General support</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {previewOf(`conv_${identity.id}`)}
                </span>
              </span>
            </button>
            {myConversations
              .filter((c) => c.product)
              .map((c) => {
                const unread = unreadFor(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className="flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left hover:bg-secondary"
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image src={c.product!.image || "/placeholder.svg"} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{c.product!.name}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{formatChatTime(c.lastMessageAt)}</span>
                      </span>
                      <span className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-muted-foreground">{previewOf(c.id)}</span>
                        {unread > 0 && (
                          <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
                            {unread}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                )
              })}
            <p className="flex items-center justify-center gap-1.5 px-4 py-6 text-center text-xs text-muted-foreground">
              <Package className="size-3.5" /> Open a product and tap “Chat with Seller” to start a product enquiry.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
