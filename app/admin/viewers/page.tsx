import { AdminHeader } from '@/components/admin/admin-header'
import { ViewersClientPage } from './viewers-client-page'

export const dynamic = 'force-dynamic'

export default async function AdminViewersPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminHeader title="Visitor Analytics" username="admin" />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-primary font-poppins">Unique Viewers</h2>
            <p className="text-xs text-gray-500 mt-1">Monitor daily unique devices and real-time site visitor telemetries.</p>
          </div>
          <ViewersClientPage />
        </div>
      </div>
    </div>
  )
}
