"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Product } from "@/lib/data"

const CART_KEY = "furnicraft.cart"
const WISHLIST_KEY = "furnicraft.wishlist"

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export type CartItem = {
  product: Product
  quantity: number
  color?: string
}

type StoreContextValue = {
  cart: CartItem[]
  wishlist: Product[]
  cartCount: number
  cartTotal: number
  wishlistCount: number
  addToCart: (product: Product, quantity?: number, color?: string) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (product: Product) => void
  isInWishlist: (id: string) => boolean
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage after mount to avoid SSR mismatch.
  useEffect(() => {
    setCart(load<CartItem[]>(CART_KEY, []))
    setWishlist(load<Product[]>(WISHLIST_KEY, []))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart, hydrated])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  function addToCart(product: Product, quantity = 1, color?: string) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity, color: color ?? item.color } : item,
        )
      }
      return [...prev, { product, quantity, color }]
    })
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== id))
  }

  function updateQuantity(id: string, quantity: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.product.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  function clearCart() {
    setCart([])
  }

  function toggleWishlist(product: Product) {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product],
    )
  }

  function isInWishlist(id: string) {
    return wishlist.some((p) => p.id === id)
  }

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
    return {
      cart,
      wishlist,
      cartCount,
      cartTotal,
      wishlistCount: wishlist.length,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
    }
  }, [cart, wishlist])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
