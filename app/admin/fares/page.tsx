import { AdminHeader } from '@/components/admin/admin-header'
import { db } from '@/lib/db'
import { fareRate } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { FaresClientPage } from './fares-client-page'

export const dynamic = 'force-dynamic'

export default async function AdminFaresPage() {
  const initialFares = await db
    .select()
    .from(fareRate)
    .orderBy(asc(fareRate.displayOrder))

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminHeader title="Manage Fares" username="admin" />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-primary font-poppins">Cab Fares</h2>
            <p className="text-xs text-gray-500 mt-1">Configure rates, seating capacity, driver allowances, and display order for cabs shown on the landing page.</p>
          </div>
          <FaresClientPage initialFares={initialFares} />
        </div>
      </div>
    </div>
  )
}
