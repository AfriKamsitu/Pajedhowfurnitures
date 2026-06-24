"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const slides = [
  {
    titleStart: "Furniture that Defines ",
    highlight: "Comfort",
    description: "Discover a wide range of stylish and quality furniture for every room.",
    image: "/hero-living-room.png",
    alt: "Modern living room with a green sofa and wooden coffee table",
  },
  {
    titleStart: "Designs that Inspire ",
    highlight: "Living",
    description: "Premium materials and timeless craftsmanship for your dream home.",
    image: "/sofa-chesterfield.png",
    alt: "Luxury green velvet chesterfield sofa",
  },
  {
    titleStart: "Spaces that Feel like ",
    highlight: "Home",
    description: "Curated collections to make every corner of your home special.",
    image: "/sofa-lshaped.png",
    alt: "Grey L-shaped sectional sofa in a bright room",
  },
]

export function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[active]

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-elevated">
      {/* decorative accent glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative grid items-stretch gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 px-8 py-12 lg:px-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent ring-1 ring-primary-foreground/15">
            New Collection 2026
          </span>
          <h1
            key={`title-${active}`}
            className="animate-fade-up text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            {slide.titleStart}
            <span className="text-accent">{slide.highlight}</span>
          </h1>
          <p
            key={`desc-${active}`}
            className="max-w-md animate-fade-up text-pretty text-primary-foreground/80"
          >
            {slide.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-accent-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/90"
            >
              Shop Now
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Explore Categories
            </Link>
          </div>
        </div>
        <div className="relative min-h-72 lg:min-h-[440px]">
          {slides.map((s, i) => (
            <Image
              key={s.image}
              src={s.image || "/placeholder.svg"}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
              )}
            />
          ))}
          {/* blend image into the primary panel on large screens */}
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-primary/60 via-transparent to-transparent lg:block" />
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 lg:left-[25%]">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-6 bg-accent" : "w-2 bg-primary-foreground/40",
            )}
          />
        ))}
      </div>
    </section>
  )
}
