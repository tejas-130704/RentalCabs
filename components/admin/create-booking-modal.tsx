'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface CreateBookingModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

const CAR_TYPES = [
  'Hatchback/Etios',
  'Sedan',
  'Innova AC',
  'Innova Crysta',
  'Ertiga/Xylo',
  'Tourist Special',
  'Tempo Traveller 13',
  'Tempo Traveller 17',
  'Mini Bus',
]

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled']

export function CreateBookingModal({ open, onClose, onCreated }: CreateBookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    passengerName: '',
    mobileNumber: '',
    alternatePhone: '',
    email: '',
    tripType: 'outstation',
    journeyType: 'one-way',
    fromCity: '',
    toCity: '',
    journeyDate: '',
    journeyTime: '',
    returnDate: '',
    carType: 'Sedan',
    estimatedFare: '',
    status: 'pending',
    adminNotes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.passengerName || !form.mobileNumber || !form.fromCity || !form.toCity) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create booking')
      }
      toast.success('Booking created successfully!')
      onCreated()
      onClose()
      // Reset form
      setForm({
        passengerName: '',
        mobileNumber: '',
        alternatePhone: '',
        email: '',
        tripType: 'outstation',
        journeyType: 'one-way',
        fromCity: '',
        toCity: '',
        journeyDate: '',
        journeyTime: '',
        returnDate: '',
        carType: 'Sedan',
        estimatedFare: '',
        status: 'pending',
        adminNotes: '',
      })
    } catch (err: any) {
      toast.error(err.message || 'Error creating booking')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#1A3263] to-[#233F78]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFC570] rounded-lg flex items-center justify-center">
              <Plus size={18} className="text-[#1A3263]" />
            </div>
            <h2 className="text-lg font-bold text-white">New Booking</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Section: Passenger Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Passenger Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="passengerName"
                  value={form.passengerName}
                  onChange={handleChange}
                  placeholder="Passenger name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Alternate Phone</label>
                <input
                  name="alternatePhone"
                  value={form.alternatePhone}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section: Trip Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Trip Type</label>
                <select
                  name="tripType"
                  value={form.tripType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                >
                  <option value="outstation">Outstation</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Journey Type</label>
                <select
                  name="journeyType"
                  value={form.journeyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                >
                  <option value="one-way">One Way</option>
                  <option value="round-trip">Round Trip</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  From City <span className="text-red-500">*</span>
                </label>
                <input
                  name="fromCity"
                  value={form.fromCity}
                  onChange={handleChange}
                  placeholder="e.g., (Aurangabad)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  To City <span className="text-red-500">*</span>
                </label>
                <input
                  name="toCity"
                  value={form.toCity}
                  onChange={handleChange}
                  placeholder="e.g., Pune"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Journey Date</label>
                <input
                  type="date"
                  name="journeyDate"
                  value={form.journeyDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Journey Time</label>
                <input
                  type="time"
                  name="journeyTime"
                  value={form.journeyTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                />
              </div>
              {form.journeyType === 'round-trip' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Car Type</label>
                <select
                  name="carType"
                  value={form.carType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                >
                  {CAR_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Admin Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Admin Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Fare (₹)</label>
                <input
                  type="number"
                  name="estimatedFare"
                  value={form.estimatedFare}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263]"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  name="adminNotes"
                  value={form.adminNotes}
                  onChange={handleChange}
                  placeholder="Internal notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3263] resize-none"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#1A3263] text-white rounded-lg text-sm font-bold hover:bg-[#233F78] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Create Booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
