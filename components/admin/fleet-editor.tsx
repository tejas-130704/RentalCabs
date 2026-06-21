'use client'

import { useState } from 'react'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface FleetCar {
  id: string
  name: string
  capacity: string
  ratePerKm: number | string
  imageUrl: string
  rating: number | string
  reviewCount: number
  displayOrder: number
  isActive: boolean
}

interface FleetEditorProps {
  cars: FleetCar[]
  onUpdate: () => void
}

export function FleetEditor({ cars, onUpdate }: FleetEditorProps) {
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<FleetCar>>({})
  const [saving, setSaving] = useState(false)

  const handleEdit = (car: FleetCar) => {
    setEditing(car.id)
    setFormData(car)
  }

  const handleCancelEdit = () => {
    setEditing(null)
    setFormData({})
  }

  const handleSave = async () => {
    if (!formData.name || !formData.capacity) {
      toast.error('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/fleet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fleet: [formData] }),
      })

      if (response.ok) {
        toast.success('Car updated')
        setEditing(null)
        onUpdate()
      } else {
        toast.error('Failed to update car')
      }
    } catch (error) {
      toast.error('Error updating car')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return

    try {
      const response = await fetch(`/api/admin/fleet/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Car deleted')
        onUpdate()
      } else {
        toast.error('Failed to delete car')
      }
    } catch (error) {
      toast.error('Error deleting car')
    }
  }

  return (
    <div className="space-y-4">
      {editing ? (
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-bold text-primary">Edit Car</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Car Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Innova Crysta"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Capacity</label>
              <input
                type="text"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 6+1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Rate/km</label>
              <input
                type="number"
                step="0.5"
                value={formData.ratePerKm || ''}
                onChange={(e) => setFormData({ ...formData, ratePerKm: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Image URL</label>
              <input
                type="text"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="/cars/innova.jpg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="4.9"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Review Count</label>
              <input
                type="number"
                value={formData.reviewCount || ''}
                onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="250"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancelEdit}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-accent text-primary rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm font-medium"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className={`bg-white rounded-xl border border-border p-4 ${!car.isActive ? 'opacity-50' : ''}`}
          >
            {car.imageUrl && (
              <div className="mb-4 h-48 bg-muted rounded-lg overflow-hidden">
                <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
              </div>
            )}

            <h3 className="text-lg font-bold text-primary mb-2">{car.name}</h3>

            <div className="space-y-1 text-sm mb-4">
              <p className="text-text-muted">
                <span className="font-medium text-foreground">Capacity:</span> {car.capacity}
              </p>
              <p className="text-text-muted">
                <span className="font-medium text-foreground">Rate:</span> ₹{car.ratePerKm}/km
              </p>
              <p className="text-text-muted">
                <span className="font-medium text-foreground">Rating:</span> {car.rating} ⭐ ({car.reviewCount} reviews)
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(car)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(car.id)}
                className="px-3 py-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={16} className="text-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
