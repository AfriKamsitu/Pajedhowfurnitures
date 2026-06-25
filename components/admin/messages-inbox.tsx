"use client"

import { useState } from "react"
import { ArrowLeft, MessageSquare, Search } from "lucide-react"
import { formatChatTime, useChat } from "@/components/chat-provider"
import { ChatThread } from "@/components/chat/chat-thread"
import { cn } from "@/lib/utils"

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function MessagesInbox() {
  const { conversations, messagesFor, unreadFor, isOnline } = useChat()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const filtered = conversations.filter((c) => c.buyerName.toLowerCase().includes(query.trim().toLowerCase()))
  const active = conversations.find((c) => c.id === activeId) ?? null

  function previewOf(conversationId: string) {
    const msgs = messagesFor(conversationId)
    const last = msgs[msgs.length - 1]
    if (!last) return "No messages yet"
    if (last.type === "image") return "Photo"
    if (last.type === "product") return `Product: ${last.product?.name ?? ""}`
    return last.text ?? ""
  }

  return (
    <div className="flex h-[calc(100vh-9.5rem)] overflow-hidden rounded-xl border border-border bg-card">
      {/* Conversation list */}
      <div className={cn("flex w-full flex-col border-r border-border md:w-80", active && "hidden md:flex")}>
        <div className="border-b border-border p-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
              <MessageSquare className="size-8 text-muted-foreground/40" />
              No conversations yet. Buyer messages will appear here.
            </div>
          )}
          {filtered.map((c) => {
            const unread = unreadFor(c.id)
            const online = isOnline(c.buyerId)
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-colors hover:bg-secondary",
                  activeId === c.id && "bg-secondary",
                )}
              >
                <span className="relative">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {initialsOf(c.buyerName)}
                  </span>
                  {online && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-500" />
                  )}
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">{c.buyerName}</span>
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
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">{active.buyerName}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      isOnline(active.buyerId) ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                  />
                  {isOnline(active.buyerId) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <ChatThread conversationId={active.id} className="flex-1" />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
            <MessageSquare className="size-10 text-muted-foreground/40" />
            <p>Select a conversation to start replying.</p>
          </div>
        )}
      </div>
    </div>
  )
}
