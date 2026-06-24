"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Heart, Search, ShoppingCart, Sofa, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop", hasDropdown: true },
  { label: "New Arrivals", href: "/shop" },
  { label: "Best Sellers", href: "/shop" },
  { label: "Offers", href: "/shop" },
  { label: "About Us", href: "/" },
  { label: "Contact Us", href: "/" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-card">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sofa className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-bold text-foreground">FurniCraft</span>
              <span className="block text-[11px] text-muted-foreground">Elevate Your Space</span>
            </span>
          </Link>

          {/* Search */}
          <div className="ml-2 hidden flex-1 items-center md:flex">
            <div className="flex w-full max-w-2xl items-center rounded-md border border-border bg-background">
              <input
                type="text"
                placeholder="Search for furniture..."
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-1 border-l border-border px-3 text-sm text-muted-foreground">
                All Categories
                <ChevronDown className="size-4" />
              </div>
              <button
                aria-label="Search"
                className="m-1 flex items-center justify-center rounded-md bg-accent px-4 py-2 text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <Search className="size-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-5">
            <button className="flex flex-col items-center gap-0.5 text-foreground" aria-label="Wishlist">
              <Heart className="size-5" />
              <span className="text-[11px]">Wishlist</span>
            </button>
            <button className="relative flex flex-col items-center gap-0.5 text-foreground" aria-label="Cart">
              <span className="relative">
                <ShoppingCart className="size-5" />
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                  3
                </span>
              </span>
              <span className="text-[11px]">Cart</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-foreground" aria-label="Login">
              <User className="size-5" />
              <span className="text-[11px]">Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="hidden border-b border-border lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-7 px-4 lg:px-8">
          {navLinks.map((link) => {
            const active = link.label === "Home" && pathname === "/"
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-1 border-b-2 py-3.5 text-sm font-medium transition-colors",
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground hover:text-accent",
                )}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="size-3.5" />}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
