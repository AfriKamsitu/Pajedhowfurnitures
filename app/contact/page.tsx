import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { Breadcrumb, PageShell } from "@/components/page-shell"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact Us — FurniCraft",
  description: "Get in touch with the FurniCraft team for support, orders, and showroom visits.",
}

const info = [
  { icon: MapPin, title: "Visit Us", lines: ["123 Furniture Avenue", "Dar es Salaam, Tanzania"] },
  { icon: Phone, title: "Call Us", lines: ["+255 700 000 000", "Mon–Sat, 8am – 7pm"] },
  { icon: Mail, title: "Email Us", lines: ["support@furnicraft.com", "sales@furnicraft.com"] },
  { icon: Clock, title: "Working Hours", lines: ["Mon–Sat: 8am – 7pm", "Sunday: 10am – 4pm"] },
]

export default function ContactPage() {
  return (
    <PageShell>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">Get in touch</h1>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          Have a question about a product, your order, or a custom request? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ContactForm />

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {info.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <item.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                {item.lines.map((line) => (
                  <p key={line} className="text-sm text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </PageShell>
  )
}
