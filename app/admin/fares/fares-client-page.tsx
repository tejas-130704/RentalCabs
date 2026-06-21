'use client'

import { FareEditorTable } from '@/components/admin/fare-editor-table'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface FareItem {
  id: string
  carType: string
  capacity: string
  ratePerKm?: string | number | null
  rateNonAc?: string | number | null
  rateAc?: string | number | null
  driverAllowance: number
  displayOrder: number
  isActive: boolean
}

export function FaresClientPage({ initialFares }: { initialFares: any[] }) {
  const router = useRouter()

  const handleSave = async (updatedFares: any[]) => {
    try {
      const response = await fetch('/api/admin/fares', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFares),
      })

      if (response.ok) {
        toast.success('Fares saved successfully!')
        router.refresh()
      } else {
        const errText = await response.text()
        toast.error(`Failed to save fares: ${errText}`)
      }
    } catch (err) {
      toast.error('Network error. Failed to save fares.')
    }
  }

  // Map database fields safely to match client component structure
  const mappedFares = initialFares.map((f) => ({
    id: f.id,
    carType: f.carType,
    capacity: f.capacity,
    ratePerKm: f.ratePerKm || '',
    rateNonAc: f.rateNonAc || '',
    rateAc: f.rateAc || '',
    driverAllowance: Number(f.driverAllowance),
    displayOrder: Number(f.displayOrder),
    isActive: Boolean(f.isActive),
  }))

  return <FareEditorTable initialFares={mappedFares} onSave={handleSave} />
}
