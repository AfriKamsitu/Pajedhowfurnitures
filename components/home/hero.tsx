import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="overflow-hidden rounded-xl bg-primary text-primary-foreground">
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 px-8 py-12 lg:px-12">
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Furniture that Defines <span className="text-accent">Comfort</span>
          </h1>
          <p className="max-w-md text-pretty text-primary-foreground/80">
            Discover a wide range of stylish and quality furniture for every room.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Shop Now
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Explore Categories
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="relative min-h-72 lg:min-h-[420px]">
          <Image
            src="/hero-living-room.png"
            alt="Modern living room with a green sofa and wooden coffee table"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
