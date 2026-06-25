export type AdminStatus = "Published" | "Draft" | "Archived"
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"

export const stats = [
  { label: "Total Revenue", value: "TZS 28,450,000", delta: "+12.5%", up: true, icon: "revenue" },
  { label: "Total Orders", value: "348", delta: "+8.2%", up: true, icon: "orders" },
  { label: "Total Customers", value: "1,246", delta: "+11.2%", up: true, icon: "customers" },
  { label: "Products", value: "523", delta: "+3.6%", up: true, icon: "products" },
] as const

export const salesOverview = [
  { day: "May 20", value: 3_200_000 },
  { day: "May 21", value: 2_800_000 },
  { day: "May 22", value: 4_100_000 },
  { day: "May 23", value: 3_600_000 },
  { day: "May 24", value: 4_400_000 },
  { day: "May 25", value: 5_200_000 },
  { day: "May 26", value: 6_800_000 },
]

export const topSelling = [
  { name: "Modern L-Shaped Sofa", price: "TZS 680,000", image: "/sofa-lshaped.png" },
  { name: "Wooden Dining Table Set", price: "TZS 450,000", image: "/dining-set.png" },
  { name: "King Size Bed Frame", price: "TZS 650,000", image: "/bed-king.png" },
  { name: "Office Mesh Chair", price: "TZS 220,000", image: "/office-furniture.png" },
  { name: "Coffee Table", price: "TZS 150,000", image: "/coffee-table.png" },
]

export const orderStatusBreakdown = [
  { name: "Delivered", value: 164, pct: "47.1%", color: "var(--chart-5)" },
  { name: "Processing", value: 89, pct: "25.6%", color: "var(--chart-1)" },
  { name: "Pending", value: 62, pct: "17.8%", color: "var(--chart-3)" },
  { name: "Cancelled", value: 33, pct: "9.5%", color: "var(--chart-4)" },
]

export const salesByCategory = [
  { name: "Living Room", value: 45, color: "var(--chart-1)" },
  { name: "Bedroom", value: 25, color: "var(--chart-2)" },
  { name: "Dining", value: 15, color: "var(--chart-3)" },
  { name: "Office", value: 10, color: "var(--chart-5)" },
  { name: "Outdoor", value: 5, color: "var(--chart-4)" },
]

export type AdminProduct = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: AdminStatus
  image: string
}

export const adminProducts: AdminProduct[] = [
  { id: "p1", name: "Modern L-Shaped Sofa", category: "Living Room", price: 680000, stock: 24, status: "Published", image: "/sofa-lshaped.png" },
  { id: "p2", name: "Wooden Dining Table Set", category: "Dining Room", price: 450000, stock: 18, status: "Published", image: "/dining-set.png" },
  { id: "p3", name: "King Size Bed Frame", category: "Bedroom", price: 650000, stock: 15, status: "Published", image: "/bed-king.png" },
  { id: "p4", name: "Office Mesh Chair", category: "Office", price: 220000, stock: 36, status: "Published", image: "/office-furniture.png" },
  { id: "p5", name: "Office Table", category: "Office", price: 150000, stock: 40, status: "Published", image: "/coffee-table.png" },
  { id: "p6", name: "TV Stand Cabinet", category: "Living Room", price: 380000, stock: 12, status: "Published", image: "/tv-stand.png" },
  { id: "p7", name: "Bookshelf", category: "Office", price: 210000, stock: 20, status: "Published", image: "/wardrobe.png" },
  { id: "p8", name: "Wardrobe 3 Doors", category: "Bedroom", price: 580000, stock: 10, status: "Published", image: "/wardrobe.png" },
  { id: "p9", name: "Outdoor Patio Set", category: "Outdoor", price: 320000, stock: 8, status: "Published", image: "/outdoor.png" },
  { id: "p10", name: "Recliner Chair", category: "Living Room", price: 350000, stock: 7, status: "Published", image: "/sofa-recliner.png" },
]

export const productTabs = [
  { label: "All Products", count: 523 },
  { label: "Published", count: 481 },
  { label: "Draft", count: 22 },
  { label: "Archived", count: 20 },
]

export type AdminOrder = {
  id: string
  customer: string
  date: string
  total: number
  payment: string
  status: OrderStatus
}

export const adminOrders: AdminOrder[] = [
  { id: "#FH12548", customer: "John Doe", date: "May 20, 2024", total: 1070000, payment: "Cash on Delivery", status: "Delivered" },
  { id: "#FH12547", customer: "Rehema M.", date: "May 20, 2024", total: 680000, payment: "Cash on Delivery", status: "Processing" },
  { id: "#FH12546", customer: "David M.", date: "May 19, 2024", total: 450000, payment: "Cash on Delivery", status: "Shipped" },
  { id: "#FH12545", customer: "Grace W.", date: "May 19, 2024", total: 320000, payment: "Cash on Delivery", status: "Delivered" },
  { id: "#FH12544", customer: "Kelvin T.", date: "May 18, 2024", total: 950000, payment: "Cash on Delivery", status: "Delivered" },
  { id: "#FH12543", customer: "Mary A.", date: "May 17, 2024", total: 950000, payment: "Cash on Delivery", status: "Processing" },
  { id: "#FH12542", customer: "Brian O.", date: "May 16, 2024", total: 600000, payment: "Cash on Delivery", status: "Delivered" },
]

export const orderTabs = [
  { label: "All Orders", count: 348 },
  { label: "Pending", count: 92 },
  { label: "Processing", count: 88 },
  { label: "Shipped", count: 74 },
  { label: "Delivered", count: 109 },
  { label: "Cancelled", count: 14 },
]

export const orderDetail = {
  id: "#FH12548",
  date: "May 20, 2024 10:30 AM",
  payment: "Cash on Delivery",
  paymentStatus: "Paid",
  status: "Delivered" as OrderStatus,
  total: 1070000,
  subtotal: 1070000,
  delivery: 0,
  customer: "John Doe",
  address: "123 Mwenge Street, Mikocheni\nDar es Salaam, Tanzania",
  phone: "+255 712 345 678",
  items: [
    { name: "Modern L-Shaped Sofa", image: "/sofa-lshaped.png", price: 680000, qty: 1 },
    { name: "Wooden Coffee Table", image: "/coffee-table.png", price: 150000, qty: 1 },
    { name: "Office Mesh Chair", image: "/office-furniture.png", price: 220000, qty: 1 },
    { name: "Decorative Cushion Set", image: "/sofa-modern-fabric.png", price: 20000, qty: 1 },
  ],
  timeline: [
    { label: "Order Placed", at: "May 20, 2024 10:30 AM", done: true },
    { label: "Processing", at: "May 20, 2024 11:15 AM", done: true },
    { label: "Shipped", at: "May 21, 2024 09:20 AM", done: true },
    { label: "Delivered", at: "May 22, 2024 02:45 PM", done: true },
  ],
}

export type AdminCustomer = {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  spent: number
  status: "Active" | "Inactive"
}

export const adminCustomers: AdminCustomer[] = [
  { id: "c1", name: "John Doe", email: "john.doe@email.com", phone: "+255 712 345 678", orders: 8, spent: 4290000, status: "Active" },
  { id: "c2", name: "Rehema Mohamed", email: "rehema@email.com", phone: "+255 712 234 567", orders: 5, spent: 2130000, status: "Active" },
  { id: "c3", name: "David Mwangi", email: "david@email.com", phone: "+255 714 587 890", orders: 3, spent: 1450000, status: "Active" },
  { id: "c4", name: "Grace Wambui", email: "grace@email.com", phone: "+255 710 331 456", orders: 6, spent: 2890000, status: "Active" },
  { id: "c5", name: "Kelvin Thomas", email: "kelvin@email.com", phone: "+255 718 789 123", orders: 4, spent: 2040000, status: "Active" },
  { id: "c6", name: "Mary Achieng", email: "mary@email.com", phone: "+255 707 456 789", orders: 2, spent: 950000, status: "Active" },
  { id: "c7", name: "Brian Otieno", email: "brian@email.com", phone: "+255 763 412 309", orders: 7, spent: 3400000, status: "Active" },
]

export type AdminCategory = {
  id: string
  name: string
  description: string
  products: number
  status: "Active" | "Inactive"
}

export const adminCategories: AdminCategory[] = [
  { id: "cat1", name: "Living Room", description: "Furniture for living room", products: 120, status: "Active" },
  { id: "cat2", name: "Bedroom", description: "Bedroom furniture", products: 85, status: "Active" },
  { id: "cat3", name: "Dining Room", description: "Dining and kitchen furniture", products: 60, status: "Active" },
  { id: "cat4", name: "Office", description: "Office furniture", products: 45, status: "Active" },
  { id: "cat5", name: "Outdoor", description: "Outdoor and garden furniture", products: 35, status: "Active" },
  { id: "cat6", name: "Storage", description: "Storage and organization", products: 25, status: "Active" },
]

export type AdminCoupon = {
  id: string
  code: string
  discount: string
  usage: string
  validUntil: string
  status: "Active" | "Expired"
}

export const adminCoupons: AdminCoupon[] = [
  { id: "co1", code: "FURNI10", discount: "10% OFF", usage: "45 / 200", validUntil: "Jun 30, 2024", status: "Active" },
  { id: "co2", code: "SAVE15", discount: "15% OFF", usage: "78 / 300", validUntil: "Jul 15, 2024", status: "Active" },
  { id: "co3", code: "NEWCUSTOMER", discount: "20% OFF", usage: "32 / 100", validUntil: "Jun 15, 2024", status: "Active" },
  { id: "co4", code: "FREESHIP", discount: "Free Shipping", usage: "120 / 500", validUntil: "Dec 31, 2024", status: "Active" },
  { id: "co5", code: "WELCOME5", discount: "5% OFF", usage: "210 / 1000", validUntil: "Aug 31, 2024", status: "Active" },
]

export type AdminBanner = {
  id: string
  title: string
  location: string
  image: string
  status: "Active" | "Inactive"
}

export const adminBanners: AdminBanner[] = [
  { id: "b1", title: "Summer Sale 2024", location: "Homepage", image: "/summer-sale.png", status: "Active" },
  { id: "b2", title: "New Collection", location: "Homepage", image: "/hero-living-room.png", status: "Active" },
  { id: "b3", title: "Modern Living", location: "Shop Page", image: "/sofa-modern-fabric.png", status: "Active" },
  { id: "b4", title: "Bedroom Essentials", location: "Shop Page", image: "/bed-king.png", status: "Active" },
]

export type AdminReview = {
  id: string
  customer: string
  product: string
  rating: number
  comment: string
  date: string
  status: "Published" | "Pending"
}

export const adminReviews: AdminReview[] = [
  { id: "r1", customer: "John Doe", product: "Modern L-Shaped Sofa", rating: 5, comment: "Excellent quality and very comfortable!", date: "May 18, 2024", status: "Published" },
  { id: "r2", customer: "Grace Wambui", product: "King Size Bed Frame", rating: 4, comment: "Sturdy and looks great in my room.", date: "May 17, 2024", status: "Published" },
  { id: "r3", customer: "David Mwangi", product: "Office Mesh Chair", rating: 5, comment: "Best office chair I've owned.", date: "May 16, 2024", status: "Pending" },
  { id: "r4", customer: "Mary Achieng", product: "Wooden Dining Table Set", rating: 3, comment: "Good but delivery was slow.", date: "May 15, 2024", status: "Published" },
  { id: "r5", customer: "Brian Otieno", product: "TV Stand Cabinet", rating: 4, comment: "Nice finish, easy to assemble.", date: "May 14, 2024", status: "Pending" },
]

export type AdminUser = {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Manager" | "Editor" | "Support"
  status: "Active" | "Inactive"
  lastActive: string
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Admin User", email: "admin@furnihouse.com", role: "Super Admin", status: "Active", lastActive: "Just now" },
  { id: "u2", name: "Sarah Manager", email: "sarah@furnihouse.com", role: "Manager", status: "Active", lastActive: "2 hours ago" },
  { id: "u3", name: "Mike Editor", email: "mike@furnihouse.com", role: "Editor", status: "Active", lastActive: "1 day ago" },
  { id: "u4", name: "Lucy Support", email: "lucy@furnihouse.com", role: "Support", status: "Inactive", lastActive: "5 days ago" },
]

export const activityLogs = [
  { id: "l1", user: "Admin User", action: "Published product", target: "Modern L-Shaped Sofa", time: "10 minutes ago" },
  { id: "l2", user: "Sarah Manager", action: "Updated order status", target: "#FH12548", time: "1 hour ago" },
  { id: "l3", user: "Mike Editor", action: "Created coupon", target: "SAVE15", time: "3 hours ago" },
  { id: "l4", user: "Admin User", action: "Added new category", target: "Storage", time: "Yesterday" },
  { id: "l5", user: "Sarah Manager", action: "Replied to review", target: "Office Mesh Chair", time: "Yesterday" },
  { id: "l6", user: "Lucy Support", action: "Deactivated banner", target: "Spring Promo", time: "2 days ago" },
]

export function formatTZS(value: number) {
  return "TZS " + value.toLocaleString("en-US")
}
