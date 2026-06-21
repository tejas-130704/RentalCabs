'use client'

import { BookingStatusBadge } from './booking-status-badge'
import { Eye, Trash2, MapPin, Car, Phone, Calendar, ArrowRight } from 'lucide-react'

interface Booking {
  id: string
  passengerName: string
  mobileNumber: string
  fromCity: string
  toCity: string
  carType: string
  tripType: string
  journeyType: string
  journeyDate: string
  estimatedFare?: number | null
  email?: string | null
  status: string
  createdAt: string
}

interface BookingsTableProps {
  bookings: Booking[]
  onViewDetails: (id: string) => void
  onDelete: (id: string) => void
}

export function BookingsTable({ bookings, onViewDetails, onDelete }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No bookings found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new booking</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Booking ID</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Route</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Car / Type</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Journey Date</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Fare</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Booked On</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-blue-50/40 transition-colors group"
            >
              {/* ID */}
              <td className="px-5 py-4 whitespace-nowrap">
                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{booking.id}
                </span>
              </td>

              {/* Customer */}
              <td className="px-5 py-4 whitespace-nowrap">
                <p className="font-semibold text-gray-900">{booking.passengerName}</p>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                  <Phone size={11} />
                  {booking.mobileNumber}
                </div>
              </td>

              {/* Route */}
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#1A3263] shrink-0" />
                  <span className="font-medium text-gray-900">{booking.fromCity}</span>
                  <ArrowRight size={12} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{booking.toCity}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5 pl-5">
                  {booking.tripType} • {booking.journeyType.replace('-', ' ')}
                </div>
              </td>

              {/* Car / Type */}
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <Car size={13} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700 font-medium">{booking.carType}</span>
                </div>
              </td>

              {/* Journey Date */}
              <td className="px-5 py-4 whitespace-nowrap text-gray-600 text-sm">
                {booking.journeyDate
                  ? new Date(booking.journeyDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </td>

              {/* Fare */}
              <td className="px-5 py-4 whitespace-nowrap">
                {booking.estimatedFare != null ? (
                  <span className="font-bold text-[#1A3263]">
                    ₹{booking.estimatedFare.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">Not set</span>
                )}
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <BookingStatusBadge status={booking.status} />
              </td>

              {/* Booked On */}
              <td className="px-5 py-4 whitespace-nowrap text-gray-400 text-xs">
                {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>

              {/* Actions */}
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onViewDetails(booking.id)}
                    title="View / Edit"
                    className="p-1.5 text-[#1A3263] hover:bg-[#1A3263]/10 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(booking.id)}
                    title="Delete"
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
