'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Trash2, Save, User, MapPin, Car, Calendar, Phone, Mail, IndianRupee, StickyNote } from 'lucide-react'
import toast from 'react-hot-toast'
import { BookingStatusBadge } from './booking-status-badge'

interface Booking {
  id: string
  passengerName: string
  mobileNumber: string
  alternatePhone?: string | null
  email?: string | null
  tripType: string
  journeyType: string
  fromCity: string
  toCity: string
  journeyDate: string
  journeyTime: string
  returnDate?: string | null
  carType: string
  estimatedFare?: number | null
  status: string
  adminNotes?: string | null
  createdAt: string
  updatedAt: string
}

interface BookingDetailDrawerProps {
  bookingId: string | null
  onClose: () => void
  onUpdate: () => void
  onDelete: (id: string) => void
}

const CAR_TYPES = [
  'Hatchback/Etios', 'Sedan', 'Innova AC', 'Innova Crysta',
  'Ertiga/Xylo', 'Tourist Special', 'Tempo Traveller 13',
  'Tempo Traveller 17', 'Mini Bus',
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder = '' }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
    />
  )
}

export function BookingDetailDrawer({ bookingId, onClose, onUpdate, onDelete }: BookingDetailDrawerProps) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [dirty, setDirty] = useState(false)

  // Editable form state
  const [form, setForm] = useState<Partial<Booking>>({})

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
      setConfirmDelete(false)
    }
  }, [bookingId])

  const fetchBooking = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`)
      if (res.ok) {
        const data = await res.json()
        setBooking(data)
        setForm(data)
        setDirty(false)
      }
    } catch {
      toast.error('Failed to load booking')
    } finally {
      setLoading(false)
    }
  }

  const setField = (key: keyof Booking, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Booking updated successfully')
        setDirty(false)
        onUpdate()
        const updated = await res.json()
        setBooking(updated)
        setForm(updated)
      } else {
        toast.error('Failed to update booking')
      }
    } catch {
      toast.error('Error updating booking')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Booking deleted')
        onDelete(bookingId!)
        onClose()
      } else {
        toast.error('Failed to delete booking')
      }
    } catch {
      toast.error('Error deleting booking')
    } finally {
      setDeleting(false)
    }
  }

  if (!bookingId) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#1A3263] to-[#233F78]">
          <div>
            <h2 className="text-lg font-bold text-white">Booking Details</h2>
            {booking && (
              <p className="text-white/60 text-xs font-mono mt-0.5">#{booking.id}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-[#1A3263]" />
            </div>
          ) : booking ? (
            <>
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <BookingStatusBadge status={form.status || booking.status} />
                <span className="text-xs text-gray-400">
                  Created {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Passenger Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User size={15} className="text-[#1A3263]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Passenger</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Full Name">
                    <Input value={form.passengerName || ''} onChange={v => setField('passengerName', v)} placeholder="Name" />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Mobile">
                      <div className="flex items-center gap-1">
                        <Phone size={13} className="text-gray-400 shrink-0" />
                        <Input value={form.mobileNumber || ''} onChange={v => setField('mobileNumber', v)} placeholder="Mobile" />
                      </div>
                    </Field>
                    <Field label="Alternate">
                      <Input value={form.alternatePhone || ''} onChange={v => setField('alternatePhone', v)} placeholder="Optional" />
                    </Field>
                  </div>
                  <Field label="Email">
                    <div className="flex items-center gap-1">
                      <Mail size={13} className="text-gray-400 shrink-0" />
                      <Input type="email" value={form.email || ''} onChange={v => setField('email', v)} placeholder="Optional" />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={15} className="text-[#1A3263]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trip Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Trip Type">
                    <select
                      value={form.tripType || 'outstation'}
                      onChange={e => setField('tripType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                    >
                      <option value="outstation">Outstation</option>
                      <option value="local">Local</option>
                    </select>
                  </Field>
                  <Field label="Journey Type">
                    <select
                      value={form.journeyType || 'one-way'}
                      onChange={e => setField('journeyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                    >
                      <option value="one-way">One Way</option>
                      <option value="round-trip">Round Trip</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="From City">
                    <Input value={form.fromCity || ''} onChange={v => setField('fromCity', v)} placeholder="From" />
                  </Field>
                  <Field label="To City">
                    <Input value={form.toCity || ''} onChange={v => setField('toCity', v)} placeholder="To" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Journey Date">
                    <input
                      type="date"
                      value={form.journeyDate ? new Date(form.journeyDate).toISOString().split('T')[0] : ''}
                      onChange={e => setField('journeyDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                    />
                  </Field>
                  <Field label="Time">
                    <input
                      type="time"
                      value={form.journeyTime || ''}
                      onChange={e => setField('journeyTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                    />
                  </Field>
                </div>
                {(form.journeyType === 'round-trip') && (
                  <Field label="Return Date">
                    <input
                      type="date"
                      value={form.returnDate ? new Date(form.returnDate).toISOString().split('T')[0] : ''}
                      onChange={e => setField('returnDate', e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                    />
                  </Field>
                )}
              </div>

              {/* Car & Fare */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Car size={15} className="text-[#1A3263]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Car & Fare</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Car Type">
                    <select
                      value={form.carType || 'Sedan'}
                      onChange={e => setField('carType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                    >
                      {CAR_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Est. Fare (₹)">
                    <div className="flex items-center gap-1">
                      <IndianRupee size={13} className="text-gray-400 shrink-0" />
                      <input
                        type="number"
                        value={form.estimatedFare ?? ''}
                        onChange={e => setField('estimatedFare', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Admin Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote size={15} className="text-[#1A3263]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admin</span>
                </div>
                <Field label="Status">
                  <select
                    value={form.status || 'pending'}
                    onChange={e => setField('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </Field>
                <Field label="Internal Notes">
                  <textarea
                    value={form.adminNotes || ''}
                    onChange={e => setField('adminNotes', e.target.value)}
                    placeholder="Notes visible only to admins..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263] resize-none"
                  />
                </Field>
              </div>

              {/* Last updated */}
              <p className="text-xs text-gray-400 text-right">
                Last updated: {new Date(booking.updatedAt).toLocaleString('en-IN')}
              </p>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          {/* Delete confirmation */}
          {confirmDelete ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 font-semibold mb-3">⚠️ Are you sure you want to delete this booking? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                title="Delete booking"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !dirty}
                className="flex-1 px-4 py-2 bg-[#1A3263] text-white rounded-lg text-sm font-bold hover:bg-[#233F78] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={14} /> {dirty ? 'Save Changes' : 'Saved'}</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
