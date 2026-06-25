"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Loader2, LogOut, MapPin, Package, User as UserIcon } from "lucide-react"
import { PageShell, Breadcrumb } from "@/components/page-shell"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: UserIcon },
]

export function AccountShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </PageShell>
    )
  }

  function handleSignOut() {
    signOut()
    router.push("/")
  }

  return (
    <PageShell>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: title }]} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
              {user.name.charAt(0).toUpperCase() || "U"}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{user.name || "Buyer"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <nav className="grid gap-1 rounded-xl border border-border bg-card p-2 shadow-soft">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary hover:text-accent",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section>
          <h1 className="mb-5 text-2xl font-bold text-foreground">{title}</h1>
          {children}
        </section>
      </div>
    </PageShell>
  )
}
