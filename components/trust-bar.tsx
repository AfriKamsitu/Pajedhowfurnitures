import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react"

const items = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On orders over TZS 200,000",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% secure payment",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30 days return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We're here to help",
  },
]

export function TrustBar({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3 bg-card px-5 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <item.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
