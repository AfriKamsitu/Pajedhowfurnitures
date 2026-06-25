"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X } from "lucide-react"
import {
  SELLER_NAME,
  useChat,
  type ProductRef,
} from "@/components/chat-provider"
import { ChatThread } from "@/components/chat/chat-thread"
import { cn } from "@/lib/utils"

// Other components can open the widget (optionally with a product to share)
// by dispatching this event.
export const OPEN_CHAT_EVENT = "pajedhow:open-chat"

export function openChat(product?: ProductRef) {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: product ?? null }))
}

export function ChatWidget() {
  const pathname = usePathname()
  const { identity, ensureMyConversation, myConversationId, totalUnread, isOnline } = useChat()
  const [open, setOpen] = useState(false)
  const [preset, setPreset] = useState<ProductRef | null>(null)

  // Listen for external open requests (e.g. from a product page).
  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<ProductRef | null>).detail
      setPreset(detail ?? null)
      setOpen(true)
      ensureMyConversation()
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen)
  }, [ensureMyConversation])

  useEffect(() => {
    if (open) ensureMyConversation()
  }, [open, ensureMyConversation])

  // Sellers/admins use the dedicated inbox; hide the buyer widget for them and
  // on all admin routes.
  if (identity.role === "seller" || pathname.startsWith("/admin")) return null

  const sellerOnline = isOnline("store-seller")

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
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

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-5 z-50 flex h-[32rem] max-h-[calc(100vh-8rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-all",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
        role="dialog"
        aria-label="Chat with the store"
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15 font-semibold">
            P
          </span>
          <div className="flex-1 leading-tight">
            <p className="text-sm font-semibold">{SELLER_NAME}</p>
            <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
              <span className={cn("size-2 rounded-full", sellerOnline ? "bg-emerald-400" : "bg-primary-foreground/40")} />
              {sellerOnline ? "Online now" : "We reply as soon as possible"}
            </p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat">
            <X className="size-5" />
          </button>
        </div>

        {open && <ChatThread conversationId={myConversationId} presetProduct={preset} className="flex-1" />}
      </div>
    </>
  )
}
