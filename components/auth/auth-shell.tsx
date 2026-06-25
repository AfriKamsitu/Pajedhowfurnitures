import Image from "next/image"
import Link from "next/link"
import { Sofa } from "lucide-react"
import type { ReactNode } from "react"

const perks = [
  "Exclusive member-only discounts",
  "Faster checkout & order tracking",
  "Save your favorites to a wishlist",
]

export function AuthShell({
  title,
  subtitle,
  children,
  image = "/hero-living-room.png",
}: {
  title: string
  subtitle: string
  children: ReactNode
  image?: string
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <Image src={image || "/placeholder.svg"} alt="" fill sizes="50vw" className="object-cover opacity-25" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sofa className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-bold">pajedhowfurnitures</span>
              <span className="block text-[11px] text-primary-foreground/70">Elevate Your Space</span>
            </span>
          </Link>
          <div>
            <h2 className="text-balance text-3xl font-bold leading-tight">
              Furniture that Defines <span className="text-accent">Comfort</span>
            </h2>
            <ul className="mt-6 grid gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm text-primary-foreground/85">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} pajedhowfurnitures. All rights reserved.</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sofa className="size-5" />
            </span>
            <span className="text-lg font-bold text-foreground">pajedhowfurnitures</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export const authInputClass =
  "w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
