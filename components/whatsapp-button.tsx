"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, Phone, X } from "lucide-react"
import { WHATSAPP_DISPLAY, openWhatsApp } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

// Floating "Chat on WhatsApp" launcher. Shown on all storefront pages,
// hidden inside the admin dashboard.
export function WhatsAppButton() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname.startsWith("/admin")) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Popover card */}
      <div
        className={cn(
          "w-[min(20rem,calc(100vw-2.5rem))] origin-bottom-right overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-all duration-200",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
        role="dialog"
        aria-label="Contact us on WhatsApp"
      >
        <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3 text-white">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/20">
            <WhatsAppGlyph className="size-6" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Paje Dhow Furniture</p>
            <p className="text-xs text-white/90">Typically replies within minutes</p>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-sm text-muted-foreground">
            Hi there! Chat with our team on WhatsApp for pricing, availability, custom orders and delivery.
          </p>
          <button
            onClick={() =>
              openWhatsApp("Hello Paje Dhow Furniture, I'd like to know more about your handcrafted furniture.")
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="size-4" />
            Start Chat
          </button>
          <a
            href="tel:+255762082422"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <Phone className="size-4" />
            {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>

      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp menu" : "Chat on WhatsApp"}
        aria-expanded={open}
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <WhatsAppGlyph className="size-7" />}
      </button>
    </div>
  )
}

// Inline WhatsApp brand glyph (no emoji, crisp at any size).
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.82 9.82 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
