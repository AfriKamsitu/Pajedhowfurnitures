import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SectionHeading({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: {
  title: string
  subtitle?: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-accent" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
        >
          {actionLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
