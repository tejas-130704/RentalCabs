'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Car } from 'lucide-react'
import { BookingFormSchema } from '@/lib/validations'
import BookingConfirmationModal from './booking-confirmation-modal'
import { toast } from 'react-hot-toast'

interface BookingData {
  bookingId: string
  fromCity: string
  toCity: string
  journeyDate: string
  carType: string
  passengerName: string
  mobileNumber: string
}

export function BookingWidget() {
  const [loading, setLoading] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  const [formData, setFormData] = useState({
    tripType: 'outstation' as const,
    journeyType: 'one-way' as const,
    fromCity: '',
    toCity: '',
    journeyDate: '',
    journeyTime: '',
    returnDate: '',
    carType: 'Sedan',
    passengerName: '',
    mobileNumber: '',
    alternatePhone: '',
    email: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const carTypes = [
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      // Validate form
      const validated = BookingFormSchema.parse(formData)

      // Call API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validated),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking')
      }

      // Show confirmation modal
      setBookingData(result.data)
      setConfirmationOpen(true)

      // Reset form
      setFormData({
        tripType: 'outstation',
        journeyType: 'one-way',
        fromCity: '',
        toCity: '',
        journeyDate: '',
        journeyTime: '',
        returnDate: '',
        carType: 'Sedan',
        passengerName: '',
        mobileNumber: '',
        alternatePhone: '',
        email: '',
      })

      toast.success('Booking created successfully!')
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('validation')) {
          // Parse validation errors
          toast.error('Please check your form for errors')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div id="booking-widget" className="bg-card border border-border text-card-foreground rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Book Your Ride Now</h2>
        <p className="text-muted-foreground mb-6">Quick and easy cab booking in just 3 steps</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Trip Type
              </label>
              <select
                name="tripType"
                value={formData.tripType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="outstation">Outstation</option>
                <option value="local">Local</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Journey Type
              </label>
              <select
                name="journeyType"
                value={formData.journeyType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
              </select>
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                From City
              </label>
              <input
                type="text"
                name="fromCity"
                value={formData.fromCity}
                onChange={handleInputChange}
                placeholder="e.g., (Aurangabad)"
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.fromCity && (
                <p className="text-red-500 text-sm mt-1">{errors.fromCity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                To City
              </label>
              <input
                type="text"
                name="toCity"
                value={formData.toCity}
                onChange={handleInputChange}
                placeholder="e.g., Pune"
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.toCity && (
                <p className="text-red-500 text-sm mt-1">{errors.toCity}</p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Journey Date
              </label>
              <input
                type="date"
                name="journeyDate"
                value={formData.journeyDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.journeyDate && (
                <p className="text-red-500 text-sm mt-1">{errors.journeyDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Journey Time
              </label>
              <input
                type="time"
                name="journeyTime"
                value={formData.journeyTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.journeyTime && (
                <p className="text-red-500 text-sm mt-1">{errors.journeyTime}</p>
              )}
            </div>
          </div>

          {/* Return Date (if round trip) */}
          {formData.journeyType === 'round-trip' && (
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Return Date
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Car Type */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              <Car className="inline w-4 h-4 mr-1" />
              Select Car Type
            </label>
            <select
              name="carType"
              value={formData.carType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {carTypes.map((car) => (
                <option key={car} value={car}>
                  {car}
                </option>
              ))}
            </select>
          </div>

          {/* Passenger Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                name="passengerName"
                value={formData.passengerName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.passengerName && (
                <p className="text-red-500 text-sm mt-1">{errors.passengerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
              )}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Alternate Phone (Optional)
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleInputChange}
                placeholder="Alternate contact"
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-border bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/95 text-accent-foreground font-bold py-3 text-lg rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 cursor-pointer dark:bg-secondary dark:text-white dark:hover:bg-secondary/80"
          >
            {loading ? 'Booking...' : 'Book Now'}
          </Button>
        </form>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center border-t border-border pt-6">
          <div>
            <p className="text-2xl font-bold text-accent">24/7</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">50K+</p>
            <p className="text-sm text-muted-foreground">Happy Riders</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">₹5</p>
            <p className="text-sm text-muted-foreground">Min Fare</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <BookingConfirmationModal
        open={confirmationOpen}
        bookingData={bookingData || undefined}
        onClose={() => setConfirmationOpen(false)}
      />
    </>
  )
}
