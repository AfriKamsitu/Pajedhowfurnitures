import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Award, Heart, Leaf, Truck } from "lucide-react"
import { Breadcrumb, PageShell } from "@/components/page-shell"
import { TrustBar } from "@/components/trust-bar"

export const metadata: Metadata = {
  title: "About Us — pajedhowfurnitures",
  description: "Learn about pajedhowfurnitures's mission to bring stylish, quality furniture to every home.",
}

const stats = [
  { value: "12+", label: "Years of Craft" },
  { value: "50k+", label: "Happy Customers" },
  { value: "1,200+", label: "Products" },
  { value: "30", label: "Showrooms" },
]

const values = [
  { icon: Award, title: "Quality First", desc: "Every piece is built with premium materials and rigorous quality checks." },
  { icon: Leaf, title: "Sustainable", desc: "Responsibly sourced wood and eco-friendly manufacturing processes." },
  { icon: Heart, title: "Customer Care", desc: "Dedicated support before, during, and long after your purchase." },
  { icon: Truck, title: "Reliable Delivery", desc: "Fast, careful delivery and assembly right to your living room." },
]

export default function AboutPage() {
  return (
    <PageShell>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <section className="mt-6 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Our Story</p>
          <h1 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Crafting comfort for every home since 2014
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            pajedhowfurnitures began with a simple belief: beautiful, durable furniture should be within everyone&apos;s reach.
            From a small workshop to a beloved brand, we&apos;ve stayed true to thoughtful design, honest materials, and
            craftsmanship that lasts for generations.
          </p>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Today we help thousands of families turn their houses into homes, one carefully made piece at a time.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explore Our Collection
          </Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
          <Image src="/showroom.png" alt="pajedhowfurnitures furniture showroom" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card px-6 py-8 text-center">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold text-foreground">What We Stand For</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                <v.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustBar className="mt-12" />
    </PageShell>
  )
}
