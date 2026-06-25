"use client"

import { useState } from "react"
import { Box } from "lucide-react"
import { cn } from "@/lib/utils"

const settingsNav = [
  "General Settings",
  "Store Information",
  "Payment Settings",
  "Shipping Settings",
  "SEO Settings",
  "Email Settings",
  "Social Links",
  "Maintenance Mode",
]

const labelCls = "mb-1.5 block text-sm font-medium text-foreground"
const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"

export function SettingsView() {
  const [active, setActive] = useState("General Settings")

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Sub nav */}
      <nav className="rounded-xl border border-border bg-card p-2 shadow-sm lg:self-start">
        {settingsNav.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={cn(
              "block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
              active === item
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Form */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-foreground">{active}</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div>
                <label className={labelCls}>Store Name</label>
                <input className={inputCls} defaultValue="FurniHouse" />
              </div>
              <div>
                <label className={labelCls}>Store Email</label>
                <input className={inputCls} defaultValue="info@furnihouse.com" />
              </div>
              <div>
                <label className={labelCls}>Store Phone</label>
                <input className={inputCls} defaultValue="+255 700 000 000" />
              </div>
              <div>
                <label className={labelCls}>Store Currency</label>
                <select className={cn(inputCls, "appearance-none")} defaultValue="TZS - Tanzanian Shilling">
                  <option>TZS - Tanzanian Shilling</option>
                  <option>USD - US Dollar</option>
                  <option>KES - Kenyan Shilling</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Time Zone</label>
                <select className={cn(inputCls, "appearance-none")} defaultValue="Africa/Dar_es_Salaam">
                  <option>Africa/Dar_es_Salaam</option>
                  <option>Africa/Nairobi</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>

            {/* Logo */}
            <div>
              <label className={labelCls}>Store Logo</label>
              <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-secondary/40 p-5 text-center">
                <span className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Box className="size-5" />
                  </span>
                  FurniHouse
                </span>
                <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
                  Change Logo
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
