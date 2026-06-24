import Link from "next/link"
import { Globe, Mail, MessageCircle, Send, Sofa } from "lucide-react"

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Sofas", href: "/shop?category=sofas" },
      { label: "Beds", href: "/shop?category=beds" },
      { label: "Dining Sets", href: "/shop?category=dining-sets" },
      { label: "Chairs", href: "/shop?category=chairs" },
      { label: "Wardrobes", href: "/shop?category=wardrobes" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Offers", href: "/offers" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Reset Password", href: "/reset-password" },
      { label: "Checkout", href: "/checkout" },
      { label: "Shop All", href: "/shop" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Sofa className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-bold">FurniCraft</span>
                <span className="block text-[11px] text-primary-foreground/70">Elevate Your Space</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              Discover a wide range of stylish and quality furniture for every room. Crafted for comfort, designed to
              last.
            </p>
            <div className="mt-5 flex gap-3">
              {[Globe, MessageCircle, Mail, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/60 sm:flex-row">
          <p>© 2026 FurniCraft. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
