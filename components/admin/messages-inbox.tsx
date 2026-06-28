"use client"

import { useMemo, useState } from "react"
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CheckCircle2,
  Inbox,
  MessageSquare,
  Pin,
  PinOff,
  Search,
} from "lucide-react"
import { formatChatTime, useChat, type Conversation } from "@/components/chat-provider"
import { ChatThread } from "@/components/chat/chat-thread"
import { formatPrice } from "@/lib/data"
import { cn } from "@/lib/utils"

type Filter = "all" | "open" | "resolved" | "archived"

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function MessagesInbox() {
  const { conversations, messagesFor, unreadFor, isOnline, setConversationFlags } = useChat()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const counts = useMemo(() => {
    const open = conversations.filter((c) => !c.archived && c.status !== "resolved").length
    const archived = conversations.filter((c) => c.archived).length
    return { open, archived }
  }, [conversations])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return conversations
      .filter((c) => {
        if (filter === "archived") return c.archived
        if (c.archived) return false
        if (filter === "open") return c.status !== "resolved"
        if (filter === "resolved") return c.status === "resolved"
        return true
      })
      .filter((c) => {
        if (!q) return true
        return c.buyerName.toLowerCase().includes(q) || (c.product?.name.toLowerCase().includes(q) ?? false)
      })
  }, [conversations, query, filter])

  const active = activeId ? conversations.find((c) => c.id === activeId) ?? null : null

  function previewOf(conversationId: string) {
    const msgs = messagesFor(conversationId)
    const last = msgs[msgs.length - 1]
    if (!last) return "No messages yet"
    if (last.type === "image") return "Photo"
    if (last.type === "product") return `Product: ${last.product?.name ?? ""}`
    if (last.type === "quote") return "Quotation sent"
    if (last.type === "order") return "Order created"
    if (last.type === "system") return last.text ?? "Update"
    return last.text ?? ""
  }

  return (
    <div className="flex h-[calc(100vh-9.5rem)] min-h-[520px] overflow-hidden rounded-xl border border-border bg-card">
      {/* Conversation list */}
      <div className={cn("flex w-full flex-col border-r border-border md:w-80", active && "hidden md:flex")}>
        <div className="space-y-3 border-b border-border p-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by buyer or product…"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {(
              [
                { key: "all", label: "All" },
                { key: "open", label: `Open (${counts.open})` },
                { key: "resolved", label: "Resolved" },
                { key: "archived", label: `Archived (${counts.archived})` },
              ] as { key: Filter; label: string }[]
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium transition-colors",
                  filter === t.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
              <Inbox className="size-8 text-muted-foreground/40" />
              No conversations here yet.
            </div>
          )}
          {filtered.map((c) => (
            <ConversationRow
              key={c.id}
              conversation={c}
              active={activeId === c.id}
              online={isOnline(c.buyerId)}
              unread={unreadFor(c.id)}
              preview={previewOf(c.id)}
              onSelect={() => setActiveId(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Active thread */}
      <div className={cn("flex flex-1 flex-col", !active && "hidden md:flex")}>
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <button onClick={() => setActiveId(null)} className="md:hidden" aria-label="Back to conversations">
                <ArrowLeft className="size-5 text-muted-foreground" />
              </button>
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initialsOf(active.buyerName)}
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-semibold text-foreground">{active.buyerName}</p>
                <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      isOnline(active.buyerId) ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                  />
                  {active.product ? active.product.name : isOnline(active.buyerId) ? "Online" : "Offline"}
                  {active.status === "resolved" && " · Resolved"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <IconBtn
                  label={active.pinned ? "Unpin" : "Pin"}
                  active={active.pinned}
                  onClick={() => setConversationFlags(active.id, { pinned: !active.pinned })}
                >
                  {active.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                </IconBtn>
                <IconBtn
                  label={active.status === "resolved" ? "Reopen" : "Mark resolved"}
                  active={active.status === "resolved"}
                  onClick={() =>
                    setConversationFlags(active.id, { status: active.status === "resolved" ? "open" : "resolved" })
                  }
                >
                  <CheckCircle2 className="size-4" />
                </IconBtn>
                <IconBtn
                  label={active.archived ? "Unarchive" : "Archive"}
                  onClick={() => {
                    setConversationFlags(active.id, { archived: !active.archived })
                    setActiveId(null)
                  }}
                >
                  {active.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                </IconBtn>
              </div>
            </div>
            <ChatThread conversationId={active.id} className="flex-1" />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
            <MessageSquare className="size-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium text-foreground">Select a conversation</p>
              <p>Reply to buyers, send quotations, and create orders.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ConversationRow({
  conversation,
  active,
  online,
  unread,
  preview,
  onSelect,
}: {
  conversation: Conversation
  active: boolean
  online: boolean
  unread: number
  preview: string
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-colors hover:bg-secondary",
        active && "bg-secondary",
      )}
    >
      <span className="relative shrink-0">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {initialsOf(conversation.buyerName)}
        </span>
        {online && (
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-500" />
        )}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="flex items-center gap-1.5">
          {conversation.pinned && <Pin className="size-3 shrink-0 text-accent" />}
          <span className="truncate text-sm font-semibold text-foreground">{conversation.buyerName}</span>
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {formatChatTime(conversation.lastMessageAt)}
          </span>
        </span>
        {conversation.product && (
          <span className="mt-0.5 block truncate text-xs font-medium text-accent">
            {conversation.product.name} · {formatPrice(conversation.product.price)}
          </span>
        )}
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">{preview}</span>
          {unread > 0 && (
            <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
              {unread}
            </span>
          )}
        </span>
      </span>
    </button>
  )
}

function IconBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        active && "border-accent/40 bg-accent/10 text-accent",
      )}
    >
      {children}
    </button>
  )
}
