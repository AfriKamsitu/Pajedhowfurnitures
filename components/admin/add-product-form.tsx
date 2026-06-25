"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Underline,
  UploadCloud,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const labelCls = "mb-1.5 block text-sm font-medium text-foreground"
const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"

const previews = ["/sofa-modern-fabric.png", "/sofa-lshaped.png", "/sofa-recliner.png", "/sofa-minimalist.png"]

function FieldCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  )
}

const toolbarIcons = [Bold, Italic, Underline, List, ListOrdered, Link2, ImageIcon, Quote]

export function AddProductForm() {
  const [featured, setFeatured] = useState(true)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left column */}
      <div className="space-y-6 lg:col-span-2">
        <FieldCard title="Product Information">
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Product Name <span className="text-destructive">*</span></label>
              <input className={inputCls} placeholder="Enter product name" />
            </div>
            <div>
              <label className={labelCls}>Category <span className="text-destructive">*</span></label>
              <select className={cn(inputCls, "appearance-none")} defaultValue="">
                <option value="" disabled>Select category</option>
                <option>Living Room</option>
                <option>Bedroom</option>
                <option>Dining Room</option>
                <option>Office</option>
                <option>Outdoor</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Price (TZS) <span className="text-destructive">*</span></label>
                <input type="number" className={inputCls} placeholder="Enter price" />
              </div>
              <div>
                <label className={labelCls}>Compare Price (TZS)</label>
                <input type="number" className={inputCls} placeholder="Enter compare price (optional)" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>SKU</label>
                <input className={inputCls} placeholder="Enter SKU" />
              </div>
              <div>
                <label className={labelCls}>Stock Quantity</label>
                <input type="number" className={inputCls} placeholder="Enter stock quantity" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Short Description</label>
              <textarea rows={2} className={cn(inputCls, "resize-none")} placeholder="Enter short description" />
            </div>
            <div>
              <label className={labelCls}>Full Description <span className="text-destructive">*</span></label>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-secondary/60 px-2 py-1.5">
                  {toolbarIcons.map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                    >
                      <Icon className="size-4" />
                    </button>
                  ))}
                </div>
                <textarea rows={5} className="w-full resize-none px-3 py-2.5 text-sm outline-none" placeholder="Enter detailed description of the product..." />
              </div>
            </div>
          </div>
        </FieldCard>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <FieldCard title="Product Images">
          <p className="mb-2 text-xs text-muted-foreground">Upload up to 10 images</p>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/40 px-4 py-8 text-center">
            <UploadCloud className="mb-2 size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Drag &amp; drop images here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {previews.map((src) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-lg bg-secondary">
                <Image src={src || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover" />
                <button className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-primary-foreground" aria-label="Remove image">
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </FieldCard>

        <FieldCard title="Product Status">
          <select className={cn(inputCls, "appearance-none")} defaultValue="Published">
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
          <button
            type="button"
            onClick={() => setFeatured((v) => !v)}
            className="mt-4 flex w-full items-center justify-between"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className={cn("flex size-5 items-center justify-center rounded-full border", featured ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                {featured && <span className="size-2 rounded-full bg-current" />}
              </span>
              Featured Product
            </span>
            <span className={cn("relative h-6 w-11 rounded-full transition-colors", featured ? "bg-primary" : "bg-border")}>
              <span className={cn("absolute top-0.5 size-5 rounded-full bg-card shadow transition-all", featured ? "left-[22px]" : "left-0.5")} />
            </span>
          </button>
        </FieldCard>

        <FieldCard title="Meta Information">
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Meta Title</label>
              <input className={inputCls} placeholder="Enter meta title" />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea rows={3} className={cn(inputCls, "resize-none")} placeholder="Enter meta description" />
            </div>
            <div>
              <label className={labelCls}>Tags</label>
              <input className={inputCls} placeholder="Enter tags separated by comma" />
            </div>
          </div>
        </FieldCard>
      </div>
    </div>
  )
}
