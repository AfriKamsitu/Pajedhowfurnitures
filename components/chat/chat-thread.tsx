"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Check,
  CheckCheck,
  FileText,
  ImageIcon,
  Package,
  Send,
  ShoppingBag,
  Smile,
  SmilePlus,
  X,
} from "lucide-react"
import {
  SELLER_ID,
  formatChatTime,
  quoteTotal,
  useChat,
  type ChatMessage,
  type Conversation,
  type ProductRef,
  type Quote,
} from "@/components/chat-provider"
import { products, formatPrice } from "@/lib/data"
import { cn } from "@/lib/utils"

const EMOJIS = ["👍", "❤️", "😊", "🙏", "🔥", "👏", "😂", "🤝", "✅", "🛋️", "📦", "💰"]
const REACTIONS = ["👍", "❤️", "😂", "🙏", "🔥", "👏"]

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

function QuoteCard({ message, mine }: { message: ChatMessage; mine: boolean }) {
  const { identity, respondToQuote } = useChat()
  const q = message.quote!
  const gross = q.unitPrice * q.quantity
  return (
    <div className="w-64 max-w-full overflow-hidden rounded-xl bg-card text-foreground ring-1 ring-border">
      <div className="flex items-center gap-2 bg-primary px-3 py-2 text-primary-foreground">
        <FileText className="size-4" />
        <span className="text-sm font-semibold">Quotation</span>
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
            q.status === "accepted"
              ? "bg-emerald-500 text-white"
              : q.status === "revision"
                ? "bg-amber-500 text-white"
                : "bg-primary-foreground/20",
          )}
        >
          {q.status}
        </span>
      </div>
      <div className="space-y-1.5 px-3 py-2.5 text-xs">
        <p className="text-sm font-semibold">{q.productName}</p>
        <Row label={`Unit price × ${q.quantity}`} value={formatPrice(gross)} />
        {q.discountPct > 0 && <Row label={`Discount (${q.discountPct}%)`} value={`- ${formatPrice(Math.round(gross * (q.discountPct / 100)))}`} />}
        <Row label="Delivery fee" value={formatPrice(q.deliveryFee)} />
        <Row label="Estimated delivery" value={`${q.etaDays} days`} />
        <div className="my-1 border-t border-border" />
        <Row label="Total" value={formatPrice(q.total)} strong />
      </div>
      {!mine && identity.role === "buyer" && q.status === "pending" && (
        <div className="flex gap-2 border-t border-border p-2">
          <button
            onClick={() => respondToQuote(message.conversationId, message.id, "accepted")}
            className="flex-1 rounded-md bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Accept Quote
          </button>
          <button
            onClick={() => respondToQuote(message.conversationId, message.id, "revision")}
            className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs font-semibold hover:bg-secondary"
          >
            Request Revision
          </button>
        </div>
      )}
    </div>
  )
}

function OrderCard({ message }: { message: ChatMessage }) {
  const o = message.order!
  return (
    <div className="w-64 max-w-full overflow-hidden rounded-xl bg-card text-foreground ring-1 ring-border">
      <div className="flex items-center gap-2 bg-emerald-600 px-3 py-2 text-white">
        <ShoppingBag className="size-4" />
        <span className="text-sm font-semibold">Order Created</span>
      </div>
      <div className="space-y-1.5 px-3 py-2.5 text-xs">
        <p className="text-sm font-semibold">{o.productName}</p>
        <Row label="Order ID" value={`#${o.orderId}`} />
        <Row label="Quantity" value={String(o.quantity)} />
        <Row label="Status" value={o.status} />
        <div className="my-1 border-t border-border" />
        <Row label="Total" value={formatPrice(o.total)} strong />
      </div>
      <div className="border-t border-border p-2">
        <Link
          href="/account/orders"
          className="block rounded-md bg-primary px-2 py-1.5 text-center text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          View Order
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(strong ? "text-sm font-bold text-primary" : "font-medium")}>{value}</span>
    </div>
  )
}

function ReactionRow({ message }: { message: ChatMessage }) {
  const counts: Record<string, number> = {}
  for (const e of Object.values(message.reactions ?? {})) counts[e] = (counts[e] ?? 0) + 1
  const entries = Object.entries(counts)
  if (entries.length === 0) return null
  return (
    <div className="mt-0.5 flex flex-wrap gap-1">
      {entries.map(([emoji, count]) => (
        <span key={emoji} className="rounded-full bg-card px-1.5 py-0.5 text-[11px] shadow-sm ring-1 ring-border">
          {emoji} {count > 1 ? count : ""}
        </span>
      ))}
    </div>
  )
}

function MessageBubble({ message, mine, otherId }: { message: ChatMessage; mine: boolean; otherId: string }) {
  const { toggleReaction } = useChat()
  const [reactOpen, setReactOpen] = useState(false)

  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-secondary px-3 py-1 text-center text-[11px] text-muted-foreground">
          {message.text}
        </span>
      </div>
    )
  }

  const isCard = message.type === "quote" || message.type === "order"

  return (
    <div className={cn("group flex flex-col", mine ? "items-end" : "items-start")}>
      <div className={cn("flex items-end gap-1", mine ? "flex-row-reverse" : "flex-row")}>
        {isCard ? (
          message.type === "quote" ? (
            <QuoteCard message={message} mine={mine} />
          ) : (
            <OrderCard message={message} />
          )
        ) : (
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
                {/* user-shared photo */}
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
        )}

        {/* React button */}
        <div className="relative">
          <button
            onClick={() => setReactOpen((v) => !v)}
            className="flex size-6 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
            aria-label="React to message"
          >
            <SmilePlus className="size-3.5" />
          </button>
          {reactOpen && (
            <div className={cn("absolute bottom-7 z-10 flex gap-0.5 rounded-full bg-card p-1 shadow-elevated ring-1 ring-border", mine ? "right-0" : "left-0")}>
              {REACTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    toggleReaction(message.id, e)
                    setReactOpen(false)
                  }}
                  className="rounded-full px-1 text-base transition-transform hover:scale-125"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ReactionRow message={message} />
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

function SellerQuoteBuilder({
  conversationId,
  defaultProduct,
  onClose,
}: {
  conversationId: string
  defaultProduct?: ProductRef | null
  onClose: () => void
}) {
  const { sendQuote } = useChat()
  const [productId, setProductId] = useState(defaultProduct?.id ?? products[0].id)
  const selected = products.find((p) => p.id === productId) ?? products[0]
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(selected.price)
  const [discountPct, setDiscountPct] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(40000)
  const [etaDays, setEtaDays] = useState(5)

  function pick(id: string) {
    setProductId(id)
    const p = products.find((x) => x.id === id)
    if (p) setUnitPrice(p.price)
  }

  const base: Omit<Quote, "status" | "total"> = {
    productId,
    productName: selected.name,
    quantity,
    unitPrice,
    discountPct,
    deliveryFee,
    etaDays,
  }
  const total = quoteTotal(base)

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">Create Quotation</span>
        <button onClick={onClose} aria-label="Close quote builder">
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>
      <div className="space-y-2">
        <select
          value={productId}
          onChange={(e) => pick(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Qty" value={quantity} onChange={(v) => setQuantity(Math.max(1, v))} />
          <Field label="Unit price" value={unitPrice} onChange={(v) => setUnitPrice(Math.max(0, v))} />
          <Field label="Discount %" value={discountPct} onChange={(v) => setDiscountPct(Math.min(100, Math.max(0, v)))} />
          <Field label="Delivery fee" value={deliveryFee} onChange={(v) => setDeliveryFee(Math.max(0, v))} />
          <Field label="ETA (days)" value={etaDays} onChange={(v) => setEtaDays(Math.max(1, v))} />
        </div>
        <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-xs">
          <span className="text-muted-foreground">Total</span>
          <span className="text-sm font-bold text-primary">{formatPrice(total)}</span>
        </div>
        <button
          onClick={() => {
            sendQuote(conversationId, base)
            onClose()
          }}
          className="w-full rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Send Quotation
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
      />
    </label>
  )
}

export function ChatThread({
  conversationId,
  className,
  presetProduct,
  conversation,
}: {
  conversationId: string
  className?: string
  presetProduct?: ProductRef | null
  conversation?: Conversation | null
}) {
  const {
    identity,
    messagesFor,
    sendMessage,
    createOrderFromChat,
    markConversationRead,
    signalTyping,
    typingNamesIn,
  } = useChat()
  const messages = messagesFor(conversationId)
  const [text, setText] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastTypingSent = useRef(0)

  const buyerId = conversationId.replace(/^conv_/, "").split("__")[0]
  const otherId = identity.role === "buyer" ? SELLER_ID : buyerId
  const typingNames = typingNamesIn(conversationId)
  const isSeller = identity.role === "seller"
  const convProduct = conversation?.product ?? presetProduct ?? null

  useEffect(() => {
    markConversationRead(conversationId)
  }, [conversationId, messages.length, markConversationRead])

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
    setEmojiOpen(false)
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

  function handleCreateOrder() {
    if (!convProduct) return
    const total = convProduct.price
    createOrderFromChat(conversationId, { product: convProduct, quantity: 1, total })
  }

  return (
    <div className={cn("flex flex-col bg-secondary/40", className)}>
      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <Package className="size-8 text-muted-foreground/50" />
            <p>Start the conversation. Ask about pricing, availability, delivery, or share a room photo.</p>
          </div>
        )}
        {messages.map((m) => (
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

      {/* Seller action bar */}
      {isSeller && (
        <div className="flex flex-wrap gap-2 border-t border-border bg-card px-3 py-2">
          <button
            onClick={() => setQuoteOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
          >
            <FileText className="size-3.5" /> Send Quote
          </button>
          <button
            onClick={handleCreateOrder}
            disabled={!convProduct}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-600/20 disabled:opacity-40"
          >
            <ShoppingBag className="size-3.5" /> Create Order
          </button>
        </div>
      )}

      {isSeller && quoteOpen && (
        <SellerQuoteBuilder conversationId={conversationId} defaultProduct={convProduct} onClose={() => setQuoteOpen(false)} />
      )}

      {/* Preset product chip */}
      {presetProduct && !isSeller && (
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

      {/* Emoji picker */}
      {emojiOpen && (
        <div className="flex flex-wrap gap-1 border-t border-border bg-card px-3 py-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setText((t) => t + e)}
              className="rounded-md px-1 text-xl transition-transform hover:scale-125"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="flex items-end gap-1.5 border-t border-border bg-card px-3 py-2.5">
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
        <button
          onClick={() => setEmojiOpen((v) => !v)}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-secondary",
            emojiOpen ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Insert emoji"
        >
          <Smile className="size-5" />
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
