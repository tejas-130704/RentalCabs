'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { FareEditorTable } from '@/components/admin/fare-editor-table'
import { Loader2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface FareItem {
  id: string
  carType: string
  capacity: string
  ratePerKm?: string | number
  rateNonAc?: string | number
  rateAc?: string | number
  driverAllowance: number
  displayOrder: number
  isActive: boolean
}

export default function AdminFaresPage() {
  const [fares, setFares] = useState<FareItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFares = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/fares')
      if (response.ok) {
        const data = await response.json()
        setFares(data.map((f: any) => ({
          ...f,
          isActive: f.isActive === 1 || f.isActive === true
        })))
      } else {
        toast.error('Failed to load fares')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFares()
  }, [fetchFares])

  const handleSave = async (updatedFares: FareItem[]) => {
    try {
      const response = await fetch('/api/admin/fares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fares: updatedFares }),
      })

      if (response.ok) {
        toast.success('Fare rates updated successfully')
        fetchFares()
      } else {
        const err = await response.json()
        toast.error(err.error || 'Failed to save fares')
      }
    } catch {
      toast.error('Network error saving fares')
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <AdminHeader title="Pune to (Aurangabad) Cab Fare Rates" />

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            Manage outstation car package rates and driver allowances. Changes here update the homepage pricing section.
          </p>
          <button
            onClick={fetchFares}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Loader2 size={32} className="animate-spin text-[#0F2C59]" />
            <p className="text-sm text-gray-500">Loading fare rates...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <FareEditorTable initialFares={fares} onSave={handleSave} />
          </div>
        )}
      </div>
    </div>
  )
}
