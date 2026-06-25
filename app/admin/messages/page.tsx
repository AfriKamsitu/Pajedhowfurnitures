import { AdminPageHeader } from "@/components/admin/admin-ui"
import { MessagesInbox } from "@/components/admin/messages-inbox"

export default function AdminMessagesPage() {
  return (
    <div>
      <AdminPageHeader title="Messages" breadcrumb={["Dashboard", "Messages"]} />
      <MessagesInbox />
    </div>
  )
}
