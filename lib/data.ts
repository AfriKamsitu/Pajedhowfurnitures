export type Product = {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  image: string
  rating: number
  reviews: number
  isNew?: boolean
  colors: string[]
  material: string
}

export type Category = {
  slug: string
  name: string
  count: number
  image: string
}

export const categories: Category[] = [
  { slug: "sofas", name: "Sofas", count: 28, image: "/sofa-modern-fabric.png" },
  { slug: "beds", name: "Beds", count: 18, image: "/bed-king.png" },
  { slug: "dining-sets", name: "Dining Sets", count: 24, image: "/dining-set.png" },
  { slug: "chairs", name: "Chairs", count: 36, image: "/chair.png" },
  { slug: "tv-stands", name: "TV Stands", count: 20, image: "/tv-stand.png" },
  { slug: "wardrobes", name: "Wardrobes", count: 16, image: "/wardrobe.png" },
  { slug: "office-furniture", name: "Office Furniture", count: 22, image: "/office-furniture.png" },
  { slug: "outdoor", name: "Outdoor", count: 12, image: "/outdoor.png" },
]

export const colorSwatches = [
  { name: "Grey", value: "#9ca3af" },
  { name: "Dark Brown", value: "#3b2f2a" },
  { name: "Tan", value: "#c8902f" },
  { name: "Green", value: "#2f5233" },
  { name: "Navy", value: "#1e3a5f" },
]

export const materials = ["Fabric", "Leather", "Wood", "Metal"]

export const products: Product[] = [
  {
    id: "modern-fabric-sofa",
    name: "Modern Fabric Sofa",
    category: "sofas",
    price: 750000,
    oldPrice: 950000,
    image: "/sofa-modern-fabric.png",
    rating: 4.5,
    reviews: 24,
    colors: ["#9ca3af", "#c8902f", "#1e3a5f", "#3b2f2a"],
    material: "Fabric",
  },
  {
    id: "luxury-chesterfield-sofa",
    name: "Luxury Chesterfield Sofa",
    category: "sofas",
    price: 1450000,
    image: "/sofa-chesterfield.png",
    rating: 4.7,
    reviews: 18,
    colors: ["#2f5233", "#3b2f2a", "#1e3a5f"],
    material: "Leather",
  },
  {
    id: "minimalist-3-seater-sofa",
    name: "Minimalist 3 Seater Sofa",
    category: "sofas",
    price: 680000,
    image: "/sofa-minimalist.png",
    rating: 4.3,
    reviews: 12,
    colors: ["#9ca3af", "#c8902f"],
    material: "Fabric",
  },
  {
    id: "l-shaped-sectional-sofa",
    name: "L-Shaped Sectional Sofa",
    category: "sofas",
    price: 1350000,
    image: "/sofa-lshaped.png",
    rating: 4.6,
    reviews: 20,
    colors: ["#9ca3af", "#3b2f2a"],
    material: "Fabric",
  },
  {
    id: "recliner-sofa-set",
    name: "Recliner Sofa Set",
    category: "sofas",
    price: 1800000,
    image: "/sofa-recliner.png",
    rating: 4.4,
    reviews: 16,
    colors: ["#9ca3af", "#1e3a5f"],
    material: "Fabric",
  },
  {
    id: "wooden-frame-sofa",
    name: "Wooden Frame Sofa",
    category: "sofas",
    price: 850000,
    image: "/sofa-wooden-frame.png",
    rating: 4.5,
    reviews: 14,
    colors: ["#c8902f", "#3b2f2a"],
    material: "Wood",
  },
  {
    id: "king-size-upholstered-bed",
    name: "King Size Upholstered Bed",
    category: "beds",
    price: 1250000,
    image: "/bed-king.png",
    rating: 4.2,
    reviews: 18,
    isNew: true,
    colors: ["#9ca3af", "#c8902f"],
    material: "Fabric",
  },
  {
    id: "6-seater-dining-set",
    name: "6 Seater Dining Set",
    category: "dining-sets",
    price: 875000,
    image: "/dining-set.png",
    rating: 4.5,
    reviews: 24,
    isNew: true,
    colors: ["#c8902f", "#3b2f2a"],
    material: "Wood",
  },
  {
    id: "wooden-coffee-table",
    name: "Wooden Coffee Table",
    category: "tables",
    price: 350000,
    image: "/coffee-table.png",
    rating: 4.5,
    reviews: 15,
    isNew: true,
    colors: ["#c8902f", "#3b2f2a"],
    material: "Wood",
  },
  {
    id: "modern-l-shaped-sofa",
    name: "Modern L-Shaped Sofa",
    category: "sofas",
    price: 950000,
    image: "/sofa-lshaped.png",
    rating: 4.4,
    reviews: 32,
    isNew: true,
    colors: ["#9ca3af", "#3b2f2a"],
    material: "Fabric",
  },
]

export const featuredProducts = products.filter((p) =>
  ["modern-l-shaped-sofa", "king-size-upholstered-bed", "6-seater-dining-set", "wooden-coffee-table"].includes(p.id),
)

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.category === slug)
}

export function formatPrice(amount: number) {
  return `TZS ${amount.toLocaleString("en-US")}`
}
