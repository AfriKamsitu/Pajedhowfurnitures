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

export type Address = {
  id: string
  label: string
  fullName: string
  phone: string
  street: string
  city: string
  region: string
  isDefault: boolean
}

export type Order = {
  id: string
  date: string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  total: number
  items: { name: string; image: string; quantity: number; price: number }[]
}

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  createdAt: string
  addresses: Address[]
  orders: Order[]
}

type StoredUser = User & { password: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  signUp: (data: { name: string; email: string; password: string }) => Promise<{ error?: string }>
  signIn: (data: { email: string; password: string }) => Promise<{ error?: string }>
  signInWithProvider: (provider: "google" | "facebook") => Promise<{ error?: string }>
  signOut: () => void
  updateProfile: (data: Partial<Pick<User, "name" | "email" | "phone" | "avatar">>) => void
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  removeAddress: (id: string) => void
  addOrder: (order: Order) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USERS_KEY = "pajedhow.users"
const SESSION_KEY = "pajedhow.session"

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[]
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function publicUser(u: StoredUser): User {
  const { password: _pw, ...rest } = u
  return rest
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount.
  useEffect(() => {
    const sessionId = window.localStorage.getItem(SESSION_KEY)
    if (sessionId) {
      const found = readUsers().find((u) => u.id === sessionId)
      if (found) setUser(publicUser(found))
    }
    setLoading(false)
  }, [])

  const persistCurrent = useCallback((updated: User) => {
    setUser(updated)
    const users = readUsers().map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
    writeUsers(users)
  }, [])

  const signUp = useCallback<AuthContextValue["signUp"]>(async ({ name, email, password }) => {
    const users = readUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with this email already exists." }
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      addresses: [],
      orders: [],
    }
    writeUsers([...users, newUser])
    window.localStorage.setItem(SESSION_KEY, newUser.id)
    setUser(publicUser(newUser))
    return {}
  }, [])

  const signIn = useCallback<AuthContextValue["signIn"]>(async ({ email, password }) => {
    const found = readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found || found.password !== password) {
      return { error: "Invalid email or password." }
    }
    window.localStorage.setItem(SESSION_KEY, found.id)
    setUser(publicUser(found))
    return {}
  }, [])

  const signInWithProvider = useCallback<AuthContextValue["signInWithProvider"]>(async (provider) => {
    const email = `${provider}.user@example.com`
    const users = readUsers()
    let found = users.find((u) => u.email === email)
    if (!found) {
      found = {
        id: crypto.randomUUID(),
        name: provider === "google" ? "Google User" : "Facebook User",
        email,
        password: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        addresses: [],
        orders: [],
      }
      writeUsers([...users, found])
    }
    window.localStorage.setItem(SESSION_KEY, found.id)
    setUser(publicUser(found))
    return {}
  }, [])

  const signOut = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    (data) => {
      if (!user) return
      persistCurrent({ ...user, ...data })
    },
    [user, persistCurrent],
  )

  const addAddress = useCallback<AuthContextValue["addAddress"]>(
    (address) => {
      if (!user) return
      const newAddr: Address = { ...address, id: crypto.randomUUID() }
      const addresses = address.isDefault
        ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...user.addresses, newAddr]
      persistCurrent({ ...user, addresses })
    },
    [user, persistCurrent],
  )

  const updateAddress = useCallback<AuthContextValue["updateAddress"]>(
    (id, data) => {
      if (!user) return
      let addresses = user.addresses.map((a) => (a.id === id ? { ...a, ...data } : a))
      if (data.isDefault) {
        addresses = addresses.map((a) => (a.id === id ? a : { ...a, isDefault: false }))
      }
      persistCurrent({ ...user, addresses })
    },
    [user, persistCurrent],
  )

  const removeAddress = useCallback<AuthContextValue["removeAddress"]>(
    (id) => {
      if (!user) return
      persistCurrent({ ...user, addresses: user.addresses.filter((a) => a.id !== id) })
    },
    [user, persistCurrent],
  )

  const addOrder = useCallback<AuthContextValue["addOrder"]>(
    (order) => {
      if (!user) return
      persistCurrent({ ...user, orders: [order, ...user.orders] })
    },
    [user, persistCurrent],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      addOrder,
    }),
    [user, loading, signUp, signIn, signInWithProvider, signOut, updateProfile, addAddress, updateAddress, removeAddress, addOrder],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
