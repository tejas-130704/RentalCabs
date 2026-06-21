'use client'

import { useState } from 'react'
import { cancelBooking } from '@/app/actions/bookings'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Clock, DollarSign, Trash2 } from 'lucide-react'

interface Booking {
  id: string
  pickupLocation: string
  dropoffLocation: string
  pickupTime: Date | string
  status: string
  fare: string | number | null
  distance: string | number | null
  passengerName: string
  passengerPhone: string
  vehicleId: string
}

export default function BookingsList({
  initialBookings,
}: {
  initialBookings: Booking[]
}) {
  const [bookings, setBookings] = useState(initialBookings)
  const [loading, setLoading] = useState(false)

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    setLoading(true)
    try {
      await cancelBooking(bookingId)
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ))
    } catch (error) {
      alert('Failed to cancel booking')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">From</span>
                  </div>
                  <p className="font-semibold text-foreground mb-4">
                    {booking.pickupLocation}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">To</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {booking.dropoffLocation}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(booking.pickupTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">
                      {formatTime(booking.pickupTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4">
                {booking.distance && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Distance</p>
                    <p className="font-semibold text-foreground">
                      {booking.distance} km
                    </p>
                  </div>
                )}
                {booking.fare && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fare</p>
                      <p className="font-semibold text-foreground">₹{booking.fare}</p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancel(booking.id)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
