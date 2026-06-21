'use client'

import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { nanoid } from 'nanoid'

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

interface FareEditorTableProps {
  initialFares: FareItem[]
  onSave: (fares: FareItem[]) => Promise<void>
}

export function FareEditorTable({ initialFares, onSave }: FareEditorTableProps) {
  const [fares, setFares] = useState<FareItem[]>(initialFares)
  const [saving, setSaving] = useState(false)

  const handleAddFare = () => {
    setFares([
      ...fares,
      {
        id: nanoid(),
        carType: '',
        capacity: '',
        ratePerKm: '',
        driverAllowance: 300,
        displayOrder: fares.length,
        isActive: true,
      },
    ])
  }

  const handleDeleteFare = (id: string) => {
    if (confirm('Are you sure you want to delete this fare?')) {
      setFares(fares.filter((f) => f.id !== id))
    }
  }

  const handleFareChange = (id: string, field: string, value: any) => {
    setFares(
      fares.map((f) =>
        f.id === id
          ? { ...f, [field]: value }
          : f
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(fares)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Car Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Capacity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Rate/km</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Non-AC</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">AC</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Driver Allowance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Active</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {fares.map((fare) => (
              <tr key={fare.id} className={`border-b border-border ${!fare.isActive ? 'bg-muted/50 opacity-60' : ''}`}>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={fare.carType}
                    onChange={(e) => handleFareChange(fare.id, 'carType', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Sedan"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={fare.capacity}
                    onChange={(e) => handleFareChange(fare.id, 'capacity', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 4+1"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.5"
                    value={fare.ratePerKm || ''}
                    onChange={(e) => handleFareChange(fare.id, 'ratePerKm', e.target.value)}
                    className="w-20 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="15"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.5"
                    value={fare.rateNonAc || ''}
                    onChange={(e) => handleFareChange(fare.id, 'rateNonAc', e.target.value)}
                    className="w-20 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="-"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.5"
                    value={fare.rateAc || ''}
                    onChange={(e) => handleFareChange(fare.id, 'rateAc', e.target.value)}
                    className="w-20 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="-"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={fare.driverAllowance}
                    onChange={(e) => handleFareChange(fare.id, 'driverAllowance', parseInt(e.target.value))}
                    className="w-24 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="300"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={fare.displayOrder}
                    onChange={(e) => handleFareChange(fare.id, 'displayOrder', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={fare.isActive}
                    onChange={(e) => handleFareChange(fare.id, 'isActive', e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDeleteFare(fare.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-danger" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAddFare}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={18} />
          Add New Car Type
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 py-2 bg-accent text-primary rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
