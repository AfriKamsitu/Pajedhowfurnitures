// Central WhatsApp contact helper for Paje Dhow Furniture.
// All "contact seller" actions across the store route through here.

export const WHATSAPP_NUMBER = "255762082422"
export const WHATSAPP_DISPLAY = "+255 762 082 422"

export type WhatsAppProduct = {
  id: string
  name: string
  price?: number
  image?: string
}

/**
 * Build a wa.me deep link with an optional pre-filled message.
 * Works on both mobile (opens the app) and desktop (opens WhatsApp Web).
 */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/** Open WhatsApp in a new tab/window with the given message. */
export function openWhatsApp(message?: string) {
  if (typeof window === "undefined") return
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer")
}

/** Standard enquiry message for a specific product. */
export function productEnquiryMessage(product: WhatsAppProduct): string {
  const lines = [
    "Hello Paje Dhow Furniture,",
    `I'm interested in *${product.name}*.`,
  ]
  if (product.id) lines.push(`Product ref: ${product.id}`)
  lines.push("Could you share availability, final price and delivery details?")
  return lines.join("\n")
}
