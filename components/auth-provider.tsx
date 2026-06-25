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

export type Role = "admin" | "customer"

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: Role
  createdAt: string
  addresses: Address[]
  orders: Order[]
}

// Any email starting with "admin@" is provisioned as an admin account.
// This keeps the demo usable without a backend role table.
function roleForEmail(email: string): Role {
  return email.trim().toLowerCase().startsWith("admin@") ? "admin" : "customer"
}

type StoredUser = User & { password: string }

// Demo accounts seeded on first load so the credentials shown on the login
// page work out of the box. Swap these out once a real backend is connected.
export const DEMO_ADMIN = { email: "admin@pajedhow.com", password: "admin1234" }
export const DEMO_CUSTOMER = { email: "buyer@pajedhow.com", password: "buyer1234" }

type AuthContextValue = {
  user: User | null
  loading: boolean
  signUp: (data: { name: string; email: string; password: string }) => Promise<{ error?: string; role?: Role }>
  signIn: (data: { email: string; password: string }) => Promise<{ error?: string; role?: Role }>
  signInWithProvider: (provider: "google" | "facebook") => Promise<{ error?: string; role?: Role }>
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

// Append an order to a specific user's account (used when the seller creates an
// order from chat for a buyer who is not the current session user). Safe no-op
// for guest buyers that don't have a stored account.
export function addOrderForUser(userId: string, order: Order) {
  if (typeof window === "undefined") return false
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return false
  users[idx] = { ...users[idx], orders: [order, ...(users[idx].orders ?? [])] }
  writeUsers(users)
  return true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Seed demo accounts (admin + customer) once, then restore session.
  useEffect(() => {
    const users = readUsers()
    const seeds: { name: string; creds: { email: string; password: string } }[] = [
      { name: "Store Owner", creds: DEMO_ADMIN },
      { name: "Demo Buyer", creds: DEMO_CUSTOMER },
    ]
    let changed = false
    for (const { name, creds } of seeds) {
      const existing = users.find((u) => u.email.toLowerCase() === creds.email)
      if (!existing) {
        users.push({
          id: crypto.randomUUID(),
          name,
          email: creds.email,
          password: creds.password,
          role: roleForEmail(creds.email),
          createdAt: new Date().toISOString(),
          addresses: [],
          orders: [],
        })
        changed = true
      } else if (existing.password !== creds.password || existing.role !== roleForEmail(creds.email)) {
        // Keep the demo accounts in sync with the credentials shown on the login page.
        existing.password = creds.password
        existing.role = roleForEmail(creds.email)
        changed = true
      }
    }
    if (changed) writeUsers(users)

    const sessionId = window.localStorage.getItem(SESSION_KEY)
    if (sessionId) {
      const found = readUsers().find((u) => u.id === sessionId)
      if (found) setUser(publicUser({ ...found, role: found.role ?? roleForEmail(found.email) }))
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
      role: roleForEmail(email),
      createdAt: new Date().toISOString(),
      addresses: [],
      orders: [],
    }
    writeUsers([...users, newUser])
    window.localStorage.setItem(SESSION_KEY, newUser.id)
    setUser(publicUser(newUser))
    return { role: newUser.role }
  }, [])

  const signIn = useCallback<AuthContextValue["signIn"]>(async ({ email, password }) => {
    const users = readUsers()
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found || found.password !== password) {
      return { error: "Invalid email or password." }
    }
    // Backfill role for accounts created before roles existed.
    if (!found.role) {
      found.role = roleForEmail(found.email)
      writeUsers(users.map((u) => (u.id === found.id ? found : u)))
    }
    window.localStorage.setItem(SESSION_KEY, found.id)
    setUser(publicUser(found))
    return { role: found.role }
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
        role: "customer",
        createdAt: new Date().toISOString(),
        addresses: [],
        orders: [],
      }
      writeUsers([...users, found])
    }
    window.localStorage.setItem(SESSION_KEY, found.id)
    setUser(publicUser(found))
    return { role: found.role }
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
