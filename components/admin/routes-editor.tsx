'use client'

import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid'

interface PopularRoute {
  id: string
  category: string
  label: string
  slug?: string
  displayOrder: number
  isActive: boolean
}

interface RoutesEditorProps {
  routes: PopularRoute[]
  onUpdate: () => void
}

const CATEGORIES = [
  { value: 'from-(Aurangabad)', label: 'From (Aurangabad)' },
  { value: 'outstation', label: 'Outstation/Round Trip' },
  { value: 'one-way', label: 'One-Way Routes' },
]

export function RoutesEditor({ routes, onUpdate }: RoutesEditorProps) {
  const [saving, setSaving] = useState(false)
  const [routesList, setRoutesList] = useState<PopularRoute[]>(routes)

  const addRoute = (category: string) => {
    setRoutesList([
      ...routesList,
      {
        id: nanoid(),
        category,
        label: '',
        displayOrder: routesList.filter((r) => r.category === category).length,
        isActive: true,
      },
    ])
  }

  const updateRoute = (id: string, field: string, value: any) => {
    setRoutesList(
      routesList.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const deleteRoute = (id: string) => {
    if (confirm('Delete this route?')) {
      setRoutesList(routesList.filter((r) => r.id !== id))
    }
  }

  const saveRoutes = async (category: string) => {
    setSaving(true)
    try {
      const categoryRoutes = routesList.filter((r) => r.category === category)
      const response = await fetch('/api/admin/routes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routes: categoryRoutes }),
      })

      if (response.ok) {
        toast.success('Routes updated')
        onUpdate()
      } else {
        toast.error('Failed to update routes')
      }
    } catch (error) {
      toast.error('Error updating routes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {CATEGORIES.map(({ value, label }) => {
        const categoryRoutes = routesList.filter((r) => r.category === value)

        return (
          <div key={value} className="bg-white rounded-xl border border-border p-6">
            <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary">{label}</h3>
              <button
                onClick={() => addRoute(value)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary text-white rounded-lg hover:opacity-90"
              >
                <Plus size={16} />
                Add Route
              </button>
            </div>

            <div className="space-y-3">
              {categoryRoutes.map((route) => (
                <div key={route.id} className="flex gap-3 items-end">
                  <input
                    type="text"
                    value={route.label}
                    onChange={(e) => updateRoute(route.id, 'label', e.target.value)}
                    placeholder="e.g., (Aurangabad) to Pune Cab Service"
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <input
                    type="number"
                    value={route.displayOrder}
                    onChange={(e) => updateRoute(route.id, 'displayOrder', parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Order"
                  />
                  <button
                    onClick={() => deleteRoute(route.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-danger" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => saveRoutes(value)}
              disabled={saving}
              className="mt-4 w-full px-4 py-2 bg-accent text-primary rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm font-medium"
            >
              {saving ? 'Saving...' : 'Save Routes'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
