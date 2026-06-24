import { featuredProducts } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"

export function FeaturedProducts() {
  return (
    <section>
      <SectionHeading
        title="Featured Products"
        subtitle="Handpicked pieces our customers love most"
        actionLabel="View All"
        actionHref="/shop"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
