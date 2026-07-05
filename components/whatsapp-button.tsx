"use client"

import { usePathname } from "next/navigation"
import { openWhatsApp } from "@/lib/whatsapp"
import { WhatsAppGlyph } from "@/components/whatsapp-glyph"

// Floating icon-only WhatsApp launcher. Shown on all storefront pages,
// hidden inside the admin dashboard. Tapping it opens WhatsApp directly.
export function WhatsAppButton() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) return null

  return (
    <button
      onClick={() =>
        openWhatsApp("Hello Paje Dhow Furniture, I'd like to know more about your handcrafted furniture.")
      }
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <WhatsAppGlyph className="size-7" />
    </button>
  )
}
