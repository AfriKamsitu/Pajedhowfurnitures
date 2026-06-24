import { featuredProducts } from "@/lib/data"
import { ProductCard } from "@/components/product-card"

export function FeaturedProducts() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-foreground">Featured Products</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
