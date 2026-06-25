"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useAuth, addOrderForUser, type Order } from "@/components/auth-provider"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChatRole = "buyer" | "seller"

export type MessageType = "text" | "image" | "product" | "quote" | "order" | "system"

export type ProductRef = {
  id: string
  name: string
  price: number
  image: string
}

export type Quote = {
  productId?: string
  productName: string
  quantity: number
  unitPrice: number
  discountPct: number
  deliveryFee: number
  etaDays: number
  total: number
  status: "pending" | "accepted" | "revision"
}

export type OrderRef = {
  orderId: string
  productName: string
  quantity: number
  total: number
  status: string
}

export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: ChatRole
  type: MessageType
  text?: string
  imageUrl?: string
  product?: ProductRef
  quote?: Quote
  order?: OrderRef
  reactions?: Record<string, string>
  createdAt: number
  readBy: string[]
}

export type Conversation = {
  id: string
  buyerId: string
  buyerName: string
  product?: ProductRef
  supplier?: string
  pinned?: boolean
  archived?: boolean
  status?: "open" | "resolved"
  createdAt: number
  lastMessageAt: number
}

export type ChatIdentity = {
  id: string
  name: string
  role: ChatRole
}

// ---------------------------------------------------------------------------
// Constants + storage helpers
// ---------------------------------------------------------------------------

export const SELLER_ID = "store-seller"
export const SELLER_NAME = "pajedhowfurnitures Support"

const CONV_KEY = "pajedhow.chat.conversations"
const MSG_KEY = "pajedhow.chat.messages"
const PRESENCE_KEY = "pajedhow.chat.presence"
const TYPING_KEY = "pajedhow.chat.typing"
const GUEST_KEY = "pajedhow.chat.guest"
const CHANNEL = "pajedhow-chat"

const ONLINE_WINDOW = 12_000
const TYPING_WINDOW = 4_000

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

// General support thread: conv_<buyerId>. Product thread: conv_<buyerId>__<productId>.
function conversationIdFor(buyerId: string, productId?: string) {
  return productId ? `conv_${buyerId}__${productId}` : `conv_${buyerId}`
}

function buyerIdFromConversation(conversationId: string) {
  return conversationId.replace(/^conv_/, "").split("__")[0]
}

export function quoteTotal(q: Omit<Quote, "total" | "status">) {
  const gross = q.unitPrice * q.quantity
  const discounted = gross * (1 - q.discountPct / 100)
  return Math.round(discounted + q.deliveryFee)
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type EnsureOpts = { product?: ProductRef; supplier?: string }

type ChatContextValue = {
  identity: ChatIdentity
  conversations: Conversation[]
  myConversations: Conversation[]
  messagesFor: (conversationId: string) => ChatMessage[]
  myConversationId: string
  ensureMyConversation: () => string
  ensureConversation: (opts?: EnsureOpts) => string
  conversationById: (id: string) => Conversation | undefined
  sendMessage: (
    conversationId: string,
    payload: {
      type?: MessageType
      text?: string
      imageUrl?: string
      product?: ProductRef
      quote?: Quote
      order?: OrderRef
    },
  ) => void
  sendQuote: (conversationId: string, quote: Omit<Quote, "status">) => void
  respondToQuote: (conversationId: string, messageId: string, decision: "accepted" | "revision") => void
  createOrderFromChat: (
    conversationId: string,
    payload: { product: ProductRef; quantity: number; total: number },
  ) => string
  toggleReaction: (messageId: string, emoji: string) => void
  setConversationFlags: (conversationId: string, flags: Partial<Pick<Conversation, "pinned" | "archived" | "status">>) => void
  markConversationRead: (conversationId: string) => void
  signalTyping: (conversationId: string) => void
  typingNamesIn: (conversationId: string) => string[]
  isOnline: (participantId: string) => boolean
  lastSeen: (participantId: string) => number | null
  unreadFor: (conversationId: string) => number
  totalUnread: number
}

const ChatContext = createContext<ChatContextValue | null>(null)

let channel: BroadcastChannel | null = null
function getChannel() {
  if (typeof window === "undefined") return null
  if (!channel && "BroadcastChannel" in window) channel = new BroadcastChannel(CHANNEL)
  return channel
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const identity = useMemo<ChatIdentity>(() => {
    if (user?.role === "admin") {
      return { id: SELLER_ID, name: user.name || SELLER_NAME, role: "seller" }
    }
    if (user) {
      return { id: user.id, name: user.name || "Customer", role: "buyer" }
    }
    if (typeof window !== "undefined") {
      let guest = readJSON<ChatIdentity | null>(GUEST_KEY, null)
      if (!guest) {
        guest = { id: `guest_${Math.random().toString(36).slice(2, 8)}`, name: "Guest", role: "buyer" }
        writeJSON(GUEST_KEY, guest)
      }
      return guest
    }
    return { id: "guest", name: "Guest", role: "buyer" }
  }, [user])

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [now, setNow] = useState(() => Date.now())

  const reload = useCallback(() => {
    setConversations(readJSON<Conversation[]>(CONV_KEY, []))
    setMessages(readJSON<ChatMessage[]>(MSG_KEY, []))
  }, [])

  const broadcast = useCallback(() => {
    getChannel()?.postMessage("changed")
  }, [])

  useEffect(() => {
    reload()
    const ch = getChannel()
    const onMessage = () => reload()
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONV_KEY || e.key === MSG_KEY || e.key === null) reload()
    }
    ch?.addEventListener("message", onMessage)
    window.addEventListener("storage", onStorage)
    return () => {
      ch?.removeEventListener("message", onMessage)
      window.removeEventListener("storage", onStorage)
    }
  }, [reload])

  useEffect(() => {
    function beat() {
      const presence = readJSON<Record<string, number>>(PRESENCE_KEY, {})
      presence[identity.id] = Date.now()
      writeJSON(PRESENCE_KEY, presence)
      setNow(Date.now())
      reload()
    }
    beat()
    const interval = setInterval(beat, 4000)
    return () => clearInterval(interval)
  }, [identity.id, reload])

  const myConversationId = useMemo(() => conversationIdFor(identity.id), [identity.id])

  const ensureConversation = useCallback<ChatContextValue["ensureConversation"]>(
    (opts) => {
      if (identity.role !== "buyer") return ""
      const id = conversationIdFor(identity.id, opts?.product?.id)
      const existing = readJSON<Conversation[]>(CONV_KEY, [])
      const found = existing.find((c) => c.id === id)
      if (!found) {
        const conv: Conversation = {
          id,
          buyerId: identity.id,
          buyerName: identity.name,
          product: opts?.product,
          supplier: opts?.supplier,
          status: "open",
          createdAt: Date.now(),
          lastMessageAt: Date.now(),
        }
        writeJSON(CONV_KEY, [...existing, conv])
        reload()
        broadcast()
      } else if (opts?.product && !found.product) {
        writeJSON(
          CONV_KEY,
          existing.map((c) => (c.id === id ? { ...c, product: opts.product, supplier: opts.supplier } : c)),
        )
        reload()
        broadcast()
      }
      return id
    },
    [identity, reload, broadcast],
  )

  const ensureMyConversation = useCallback(() => ensureConversation(), [ensureConversation])

  const appendMessage = useCallback(
    (message: ChatMessage, ensureConv?: Partial<Conversation>) => {
      const allMsgs = readJSON<ChatMessage[]>(MSG_KEY, [])
      let convs = readJSON<Conversation[]>(CONV_KEY, [])
      if (!convs.some((c) => c.id === message.conversationId)) {
        convs = [
          ...convs,
          {
            id: message.conversationId,
            buyerId: buyerIdFromConversation(message.conversationId),
            buyerName: identity.role === "buyer" ? identity.name : "Customer",
            status: "open",
            createdAt: Date.now(),
            lastMessageAt: message.createdAt,
            ...ensureConv,
          },
        ]
      }
      convs = convs.map((c) => (c.id === message.conversationId ? { ...c, lastMessageAt: message.createdAt } : c))
      writeJSON(MSG_KEY, [...allMsgs, message])
      writeJSON(CONV_KEY, convs)
      reload()
      broadcast()
    },
    [identity, reload, broadcast],
  )

  const sendMessage = useCallback<ChatContextValue["sendMessage"]>(
    (conversationId, payload) => {
      const priorMsgs = readJSON<ChatMessage[]>(MSG_KEY, [])
      const message: ChatMessage = {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        conversationId,
        senderId: identity.id,
        senderName: identity.name,
        senderRole: identity.role,
        type: payload.type ?? "text",
        text: payload.text,
        imageUrl: payload.imageUrl,
        product: payload.product,
        quote: payload.quote,
        order: payload.order,
        createdAt: Date.now(),
        readBy: [identity.id],
      }
      appendMessage(message)

      // Auto-greeting from the store on the buyer's first message when the
      // seller is offline, so the chat always feels responsive.
      if (identity.role === "buyer") {
        const priorBuyerMsgs = priorMsgs.filter(
          (m) => m.conversationId === conversationId && m.senderRole === "buyer",
        )
        const presence = readJSON<Record<string, number>>(PRESENCE_KEY, {})
        const sellerOnline = presence[SELLER_ID] && Date.now() - presence[SELLER_ID] < ONLINE_WINDOW
        if (priorBuyerMsgs.length === 0 && !sellerOnline) {
          setTimeout(() => {
            const auto: ChatMessage = {
              id: `m_${Date.now()}_auto`,
              conversationId,
              senderId: SELLER_ID,
              senderName: SELLER_NAME,
              senderRole: "seller",
              type: "text",
              text: "Thanks for reaching out to pajedhowfurnitures! A specialist will be with you shortly to discuss pricing, availability and delivery.",
              createdAt: Date.now(),
              readBy: [SELLER_ID],
            }
            appendMessage(auto)
          }, 1400)
        }
      }
    },
    [identity, appendMessage],
  )

  const sendQuote = useCallback<ChatContextValue["sendQuote"]>(
    (conversationId, quote) => {
      const message: ChatMessage = {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        conversationId,
        senderId: identity.id,
        senderName: identity.name,
        senderRole: identity.role,
        type: "quote",
        quote: { ...quote, status: "pending" },
        createdAt: Date.now(),
        readBy: [identity.id],
      }
      appendMessage(message)
    },
    [identity, appendMessage],
  )

  const respondToQuote = useCallback<ChatContextValue["respondToQuote"]>(
    (conversationId, messageId, decision) => {
      const allMsgs = readJSON<ChatMessage[]>(MSG_KEY, [])
      const updated = allMsgs.map((m) =>
        m.id === messageId && m.quote ? { ...m, quote: { ...m.quote, status: decision } } : m,
      )
      writeJSON(MSG_KEY, updated)
      reload()
      broadcast()
      const system: ChatMessage = {
        id: `m_${Date.now()}_sys`,
        conversationId,
        senderId: identity.id,
        senderName: identity.name,
        senderRole: identity.role,
        type: "system",
        text:
          decision === "accepted"
            ? `${identity.name} accepted the quotation. The seller can now create the order.`
            : `${identity.name} requested a revision to the quotation.`,
        createdAt: Date.now() + 1,
        readBy: [identity.id],
      }
      appendMessage(system)
    },
    [identity, reload, broadcast, appendMessage],
  )

  const createOrderFromChat = useCallback<ChatContextValue["createOrderFromChat"]>(
    (conversationId, { product, quantity, total }) => {
      const buyerId = buyerIdFromConversation(conversationId)
      const orderId = `FH${Math.floor(10000 + Math.random() * 89999)}`
      const order: Order = {
        id: orderId,
        date: new Date().toISOString(),
        status: "Processing",
        total,
        items: [{ name: product.name, image: product.image, quantity, price: product.price }],
      }
      addOrderForUser(buyerId, order)
      const message: ChatMessage = {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        conversationId,
        senderId: identity.id,
        senderName: identity.name,
        senderRole: identity.role,
        type: "order",
        order: { orderId, productName: product.name, quantity, total, status: "Processing" },
        createdAt: Date.now(),
        readBy: [identity.id],
      }
      appendMessage(message)
      return orderId
    },
    [identity, appendMessage],
  )

  const toggleReaction = useCallback<ChatContextValue["toggleReaction"]>(
    (messageId, emoji) => {
      const allMsgs = readJSON<ChatMessage[]>(MSG_KEY, [])
      const updated = allMsgs.map((m) => {
        if (m.id !== messageId) return m
        const reactions = { ...(m.reactions ?? {}) }
        if (reactions[identity.id] === emoji) delete reactions[identity.id]
        else reactions[identity.id] = emoji
        return { ...m, reactions }
      })
      writeJSON(MSG_KEY, updated)
      reload()
      broadcast()
    },
    [identity.id, reload, broadcast],
  )

  const setConversationFlags = useCallback<ChatContextValue["setConversationFlags"]>(
    (conversationId, flags) => {
      const convs = readJSON<Conversation[]>(CONV_KEY, [])
      writeJSON(
        CONV_KEY,
        convs.map((c) => (c.id === conversationId ? { ...c, ...flags } : c)),
      )
      reload()
      broadcast()
    },
    [reload, broadcast],
  )

  const markConversationRead = useCallback<ChatContextValue["markConversationRead"]>(
    (conversationId) => {
      const allMsgs = readJSON<ChatMessage[]>(MSG_KEY, [])
      let changed = false
      const updated = allMsgs.map((m) => {
        if (m.conversationId === conversationId && !m.readBy.includes(identity.id)) {
          changed = true
          return { ...m, readBy: [...m.readBy, identity.id] }
        }
        return m
      })
      if (changed) {
        writeJSON(MSG_KEY, updated)
        reload()
        broadcast()
      }
    },
    [identity.id, reload, broadcast],
  )

  const signalTyping = useCallback<ChatContextValue["signalTyping"]>(
    (conversationId) => {
      const typing = readJSON<Record<string, Record<string, number>>>(TYPING_KEY, {})
      typing[conversationId] = { ...(typing[conversationId] || {}), [identity.id]: Date.now() }
      writeJSON(TYPING_KEY, typing)
      broadcast()
    },
    [identity.id, broadcast],
  )

  const typingNamesIn = useCallback<ChatContextValue["typingNamesIn"]>(
    (conversationId) => {
      const typing = readJSON<Record<string, Record<string, number>>>(TYPING_KEY, {})
      const entry = typing[conversationId] || {}
      const names: string[] = []
      for (const [pid, ts] of Object.entries(entry)) {
        if (pid !== identity.id && now - ts < TYPING_WINDOW) {
          names.push(pid === SELLER_ID ? SELLER_NAME : "Customer")
        }
      }
      return names
    },
    [identity.id, now],
  )

  const isOnline = useCallback<ChatContextValue["isOnline"]>(
    (participantId) => {
      const presence = readJSON<Record<string, number>>(PRESENCE_KEY, {})
      const ts = presence[participantId]
      return !!ts && now - ts < ONLINE_WINDOW
    },
    [now],
  )

  const lastSeen = useCallback<ChatContextValue["lastSeen"]>((participantId) => {
    const presence = readJSON<Record<string, number>>(PRESENCE_KEY, {})
    return presence[participantId] ?? null
  }, [])

  const messagesFor = useCallback<ChatContextValue["messagesFor"]>(
    (conversationId) =>
      messages.filter((m) => m.conversationId === conversationId).sort((a, b) => a.createdAt - b.createdAt),
    [messages],
  )

  const conversationById = useCallback<ChatContextValue["conversationById"]>(
    (id) => conversations.find((c) => c.id === id),
    [conversations],
  )

  const unreadFor = useCallback<ChatContextValue["unreadFor"]>(
    (conversationId) =>
      messages.filter(
        (m) => m.conversationId === conversationId && m.senderId !== identity.id && !m.readBy.includes(identity.id),
      ).length,
    [messages, identity.id],
  )

  const totalUnread = useMemo(() => {
    if (identity.role === "seller") {
      return messages.filter((m) => m.senderRole === "buyer" && !m.readBy.includes(identity.id)).length
    }
    return messages.filter(
      (m) =>
        buyerIdFromConversation(m.conversationId) === identity.id &&
        m.senderId !== identity.id &&
        !m.readBy.includes(identity.id),
    ).length
  }, [messages, identity])

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort((a, b) => {
        if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1
        return b.lastMessageAt - a.lastMessageAt
      }),
    [conversations],
  )

  const myConversations = useMemo(
    () => sortedConversations.filter((c) => c.buyerId === identity.id),
    [sortedConversations, identity.id],
  )

  const value = useMemo<ChatContextValue>(
    () => ({
      identity,
      conversations: sortedConversations,
      myConversations,
      messagesFor,
      myConversationId,
      ensureMyConversation,
      ensureConversation,
      conversationById,
      sendMessage,
      sendQuote,
      respondToQuote,
      createOrderFromChat,
      toggleReaction,
      setConversationFlags,
      markConversationRead,
      signalTyping,
      typingNamesIn,
      isOnline,
      lastSeen,
      unreadFor,
      totalUnread,
    }),
    [
      identity,
      sortedConversations,
      myConversations,
      messagesFor,
      myConversationId,
      ensureMyConversation,
      ensureConversation,
      conversationById,
      sendMessage,
      sendQuote,
      respondToQuote,
      createOrderFromChat,
      toggleReaction,
      setConversationFlags,
      markConversationRead,
      signalTyping,
      typingNamesIn,
      isOnline,
      lastSeen,
      unreadFor,
      totalUnread,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used within ChatProvider")
  return ctx
}

export function formatChatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export function formatLastSeen(ts: number | null) {
  if (!ts) return "Offline"
  const diff = Date.now() - ts
  if (diff < 60_000) return "Last seen just now"
  if (diff < 3_600_000) return `Last seen ${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `Last seen ${Math.floor(diff / 3_600_000)}h ago`
  return `Last seen ${new Date(ts).toLocaleDateString()}`
}
