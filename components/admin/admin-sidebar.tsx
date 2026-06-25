"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  BarChart3,
  Box,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  ShieldCheck,
  ShoppingCart,
  Star,
  Settings,
  Tag,
  Ticket,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products", href: "/admin/products", icon: Box },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Reports", href: "/admin/reports", icon: FileText },
]

const manageNav = [
  { label: "Users & Roles", href: "/admin/users", icon: ShieldCheck },
  { label: "System Settings", href: "/admin/settings", icon: Settings },
  { label: "Activity Logs", href: "/admin/activity", icon: Activity },
]

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: { label: string; href: string; icon: React.ElementType }
  active: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-[18px]" />
      {item.label}
    </Link>
  )
}

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Box className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold text-foreground">FurniHouse</span>
              <span className="block text-[11px] text-muted-foreground">Admin Panel</span>
            </span>
          </Link>
          <button onClick={onClose} className="text-muted-foreground lg:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Main</p>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item.href)} onNavigate={onClose} />
              ))}
            </div>
          </div>
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Manage</p>
            <div className="space-y-1">
              {manageNav.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item.href)} onNavigate={onClose} />
              ))}
            </div>
          </div>
        </nav>

        {/* Admin profile */}
        <div className="border-t border-sidebar-border p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              AU
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-sm font-semibold text-foreground">Admin User</span>
              <span className="block text-[11px] text-muted-foreground">Super Admin</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </div>
      </aside>
    </>
  )
}
