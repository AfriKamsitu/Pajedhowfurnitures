import { Plus } from "lucide-react"
import { AdminPageHeader, PrimaryButton } from "@/components/admin/admin-ui"
import { CustomersTable } from "@/components/admin/customers-table"

export default function AdminCustomersPage() {
  return (
    <div>
      <AdminPageHeader
        title="Customers"
        breadcrumb={["Dashboard", "Customers"]}
        actions={
          <PrimaryButton>
            <Plus className="size-4" />
            Add New Customer
          </PrimaryButton>
        }
      />
      <CustomersTable />
    </div>
  )
}
