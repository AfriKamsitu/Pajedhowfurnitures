import { Plus } from "lucide-react"
import { AdminPageHeader, PrimaryButton } from "@/components/admin/admin-ui"
import { ProductsTable } from "@/components/admin/products-table"

export default function AdminProductsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Products"
        breadcrumb={["Dashboard", "Products"]}
        actions={
          <PrimaryButton href="/admin/products/new">
            <Plus className="size-4" />
            Add New Product
          </PrimaryButton>
        }
      />
      <ProductsTable />
    </div>
  )
}
