"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useAuth } from "@/components/auth-provider"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChatRole = "buyer" | "seller"

export type MessageType = "text" | "image" | "product"

export type ProductRef = {
  id: string
  name: string
  price: number
  image: string
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
  createdAt: number
  readBy: string[]
}

export type Conversation = {
  id: string
  buyerId: string
  buyerName: string
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

// All buyers talk to a single store seller. Every admin shares this identity so
// read receipts and presence resolve to the same participant.
export const SELLER_ID = "store-seller"
export const SELLER_NAME = "pajedhowfurnitures Support"

const CONV_KEY = "pajedhow.chat.conversations"
const MSG_KEY = "pajedhow.chat.messages"
const PRESENCE_KEY = "pajedhow.chat.presence"
const TYPING_KEY = "pajedhow.chat.typing"
const GUEST_KEY = "pajedhow.chat.guest"
const CHANNEL = "pajedhow-chat"

const ONLINE_WINDOW = 12_000 // ms a heartbeat stays "online"
const TYPING_WINDOW = 4_000 // ms a typing signal stays active

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

function conversationIdFor(buyerId: string) {
  return `conv_${buyerId}`
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type ChatContextValue = {
  identity: ChatIdentity
  conversations: Conversation[]
  messagesFor: (conversationId: string) => ChatMessage[]
  myConversationId: string
  ensureMyConversation: () => string
  sendMessage: (
    conversationId: string,
    payload: { type?: MessageType; text?: string; imageUrl?: string; product?: ProductRef },
  ) => void
  markConversationRead: (conversationId: string) => void
  signalTyping: (conversationId: string) => void
  typingNamesIn: (conversationId: string) => string[]
  isOnline: (participantId: string) => boolean
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

  // Resolve the current chat identity from the auth user (or a persisted guest).
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

  // Initial load + cross-tab sync (BroadcastChannel and storage events).
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

  // Heartbeat for presence + periodic clock tick for online/typing expiry.
  useEffect(() => {
    function beat() {
      const presence = readJSON<Record<string, number>>(PRESENCE_KEY, {})
      presence[identity.id] = Date.now()
      writeJSON(PRESENCE_KEY, presence)
      setNow(Date.now())
      // Poll fallback so messages still refresh if a cross-tab event is missed.
      reload()
    }
    beat()
    const interval = setInterval(beat, 4000)
    return () => clearInterval(interval)
  }, [identity.id, reload])

  const myConversationId = useMemo(() => conversationIdFor(identity.id), [identity.id])

  const ensureMyConversation = useCallback(() => {
    if (identity.role !== "buyer") return ""
    const id = conversationIdFor(identity.id)
    const existing = readJSON<Conversation[]>(CONV_KEY, [])
    if (!existing.some((c) => c.id === id)) {
      const conv: Conversation = {
        id,
        buyerId: identity.id,
        buyerName: identity.name,
        createdAt: Date.now(),
        lastMessageAt: Date.now(),
      }
      writeJSON(CONV_KEY, [...existing, conv])
      reload()
      broadcast()
    }
    return id
  }, [identity, reload, broadcast])

  const sendMessage = useCallback<ChatContextValue["sendMessage"]>(
    (conversationId, payload) => {
      const allMsgs = readJSON<ChatMessage[]>(MSG_KEY, [])
      const allConvs = readJSON<Conversation[]>(CONV_KEY, [])

      // Ensure the conversation exists (buyer may message before it's created).
      let convs = allConvs
      if (!convs.some((c) => c.id === conversationId)) {
        const buyerId = conversationId.replace(/^conv_/, "")
        convs = [
          ...convs,
          {
            id: conversationId,
            buyerId,
            buyerName: identity.role === "buyer" ? identity.name : "Customer",
            createdAt: Date.now(),
            lastMessageAt: Date.now(),
          },
        ]
      }

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
        createdAt: Date.now(),
        readBy: [identity.id],
      }

      convs = convs.map((c) => (c.id === conversationId ? { ...c, lastMessageAt: message.createdAt } : c))

      writeJSON(MSG_KEY, [...allMsgs, message])
      writeJSON(CONV_KEY, convs)
      reload()
      broadcast()

      // Friendly auto-greeting from the store on the very first buyer message
      // when no seller is currently online, so the chat feels responsive.
      if (identity.role === "buyer") {
        const priorBuyerMsgs = allMsgs.filter(
          (m) => m.conversationId === conversationId && m.senderRole === "buyer",
        )
        const presence = readJSON<Record<string, number>>(PRESENCE_KEY, {})
        const sellerOnline = presence[SELLER_ID] && Date.now() - presence[SELLER_ID] < ONLINE_WINDOW
        if (priorBuyerMsgs.length === 0 && !sellerOnline) {
          setTimeout(() => {
            const msgs2 = readJSON<ChatMessage[]>(MSG_KEY, [])
            const auto: ChatMessage = {
              id: `m_${Date.now()}_auto`,
              conversationId,
              senderId: SELLER_ID,
              senderName: SELLER_NAME,
              senderRole: "seller",
              type: "text",
              text: "Thanks for reaching out to pajedhowfurnitures! A team member will be with you shortly. How can we help with your order or product questions?",
              createdAt: Date.now(),
              readBy: [SELLER_ID],
            }
            const convs2 = readJSON<Conversation[]>(CONV_KEY, []).map((c) =>
              c.id === conversationId ? { ...c, lastMessageAt: auto.createdAt } : c,
            )
            writeJSON(MSG_KEY, [...msgs2, auto])
            writeJSON(CONV_KEY, convs2)
            reload()
            broadcast()
          }, 1400)
        }
      }
    },
    [identity, reload, broadcast],
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

  const messagesFor = useCallback<ChatContextValue["messagesFor"]>(
    (conversationId) =>
      messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [messages],
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
      (m) => m.conversationId === myConversationId && m.senderId !== identity.id && !m.readBy.includes(identity.id),
    ).length
  }, [messages, identity, myConversationId])

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => b.lastMessageAt - a.lastMessageAt),
    [conversations],
  )

  const value = useMemo<ChatContextValue>(
    () => ({
      identity,
      conversations: sortedConversations,
      messagesFor,
      myConversationId,
      ensureMyConversation,
      sendMessage,
      markConversationRead,
      signalTyping,
      typingNamesIn,
      isOnline,
      unreadFor,
      totalUnread,
    }),
    [
      identity,
      sortedConversations,
      messagesFor,
      myConversationId,
      ensureMyConversation,
      sendMessage,
      markConversationRead,
      signalTyping,
      typingNamesIn,
      isOnline,
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
