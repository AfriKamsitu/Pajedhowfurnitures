"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, CheckCheck, ImageIcon, Package, Send, X } from "lucide-react"
import {
  SELLER_ID,
  formatChatTime,
  useChat,
  type ChatMessage,
  type ProductRef,
} from "@/components/chat-provider"
import { products, formatPrice } from "@/lib/data"
import { cn } from "@/lib/utils"

// Downscale an uploaded image to keep it small enough for local persistence.
function fileToResizedDataUrl(file: File, max = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("no canvas"))
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.7))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ReadReceipt({ message, otherId }: { message: ChatMessage; otherId: string }) {
  const read = message.readBy.includes(otherId)
  return read ? (
    <CheckCheck className="size-3.5 text-sky-300" aria-label="Read" />
  ) : (
    <Check className="size-3.5 text-primary-foreground/60" aria-label="Sent" />
  )
}

function MessageBubble({ message, mine, otherId }: { message: ChatMessage; mine: boolean; otherId: string }) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          mine
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground ring-1 ring-border",
        )}
      >
        {message.type === "image" && message.imageUrl && (
          <span className="mb-1 block overflow-hidden rounded-lg">
            {/* user-shared photo, not a layout image */}
            <img src={message.imageUrl || "/placeholder.svg"} alt="Shared photo" className="max-h-60 w-full object-cover" />
          </span>
        )}

        {message.type === "product" && message.product && (
          <Link
            href={`/product/${message.product.id}`}
            className={cn(
              "mb-1 flex items-center gap-3 rounded-lg p-2 transition-colors",
              mine ? "bg-primary-foreground/10 hover:bg-primary-foreground/20" : "bg-secondary hover:bg-secondary/70",
            )}
          >
            <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-background">
              <Image src={message.product.image || "/placeholder.svg"} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-semibold">{message.product.name}</span>
              <span className={cn("block text-xs", mine ? "text-primary-foreground/80" : "text-primary")}>
                {formatPrice(message.product.price)}
              </span>
            </span>
          </Link>
        )}

        {message.text && <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>}

        <span
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            mine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatChatTime(message.createdAt)}
          {mine && <ReadReceipt message={message} otherId={otherId} />}
        </span>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export function ChatThread({
  conversationId,
  className,
  presetProduct,
}: {
  conversationId: string
  className?: string
  presetProduct?: ProductRef | null
}) {
  const { identity, messagesFor, sendMessage, markConversationRead, signalTyping, typingNamesIn, isOnline } = useChat()
  const messages = messagesFor(conversationId)
  const [text, setText] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastTypingSent = useRef(0)

  const buyerId = conversationId.replace(/^conv_/, "")
  const otherId = identity.role === "buyer" ? SELLER_ID : buyerId
  const otherOnline = isOnline(otherId)
  const typingNames = typingNamesIn(conversationId)

  // Mark incoming messages read whenever the thread is shown or updated.
  useEffect(() => {
    markConversationRead(conversationId)
  }, [conversationId, messages.length, markConversationRead])

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, typingNames.length])

  function handleText(value: string) {
    setText(value)
    const now = Date.now()
    if (now - lastTypingSent.current > 1500) {
      lastTypingSent.current = now
      signalTyping(conversationId)
    }
  }

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage(conversationId, { type: "text", text: trimmed })
    setText("")
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      sendMessage(conversationId, { type: "image", imageUrl: dataUrl })
    } catch {
      /* ignore */
    }
    if (fileRef.current) fileRef.current.value = ""
  }

  function shareProduct(p: ProductRef) {
    sendMessage(conversationId, { type: "product", product: p })
    setPickerOpen(false)
  }

  const grouped = useMemo(() => messages, [messages])

  return (
    <div className={cn("flex flex-col bg-secondary/40", className)}>
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        {grouped.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <Package className="size-8 text-muted-foreground/50" />
            <p>Start the conversation. Ask about products, delivery, or share a room photo.</p>
          </div>
        )}
        {grouped.map((m) => (
          <MessageBubble key={m.id} message={m} mine={m.senderId === identity.id} otherId={otherId} />
        ))}
        {typingNames.length > 0 && (
          <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <span className="rounded-full bg-card px-3 py-2 ring-1 ring-border">
              <TypingDots />
            </span>
            {typingNames[0]} is typing…
          </div>
        )}
      </div>

      {/* Preset product chip (e.g. from a product page) */}
      {presetProduct && (
        <div className="border-t border-border bg-card px-3 py-2">
          <button
            onClick={() => shareProduct(presetProduct)}
            className="flex w-full items-center gap-2 rounded-md bg-secondary px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-secondary/70"
          >
            <Package className="size-4 text-primary" />
            Share “{presetProduct.name}” in this chat
          </button>
        </div>
      )}

      {/* Product picker */}
      {pickerOpen && (
        <div className="border-t border-border bg-card">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold text-foreground">Share a product</span>
            <button onClick={() => setPickerOpen(false)} aria-label="Close product picker">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid max-h-44 grid-cols-1 gap-1 overflow-y-auto px-2 pb-2">
            {products.slice(0, 8).map((p) => (
              <button
                key={p.id}
                onClick={() => shareProduct({ id: p.id, name: p.name, price: p.price, image: p.image })}
                className="flex items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-secondary"
              >
                <span className="relative size-9 shrink-0 overflow-hidden rounded bg-secondary">
                  <Image src={p.image || "/placeholder.svg"} alt="" fill sizes="36px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-xs font-medium text-foreground">{p.name}</span>
                  <span className="block text-[11px] text-primary">{formatPrice(p.price)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="flex items-end gap-2 border-t border-border bg-card px-3 py-2.5">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Send image"
        >
          <ImageIcon className="size-5" />
        </button>
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-secondary",
            pickerOpen ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Share product"
        >
          <Package className="size-5" />
        </button>
        <textarea
          value={text}
          onChange={(e) => handleText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          rows={1}
          placeholder="Type a message…"
          className="max-h-28 min-h-[38px] flex-1 resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  )
}
