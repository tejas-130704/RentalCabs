import { AdminHeader } from '@/components/admin/admin-header'
import { DashboardContent } from '@/components/admin/dashboard-content'

export default async function AdminDashboard() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminHeader title="Dashboard" username="admin" />
      <DashboardContent />
    </div>
  )
}
