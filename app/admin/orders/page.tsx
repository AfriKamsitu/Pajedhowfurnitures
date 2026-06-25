import { AdminPageHeader } from "@/components/admin/admin-ui"
import { OrdersTable } from "@/components/admin/orders-table"

export default function AdminOrdersPage() {
  return (
    <div>
      <AdminPageHeader title="Orders" breadcrumb={["Dashboard", "Orders"]} />
      <OrdersTable />
    </div>
  )
}
