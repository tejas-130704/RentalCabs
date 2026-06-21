'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingConfirmationModalProps {
  open: boolean
  bookingData?: {
    bookingId: string
    fromCity: string
    toCity: string
    journeyDate: string
    carType: string
    passengerName: string
    mobileNumber: string
  }
  onClose: () => void
}

export default function BookingConfirmationModal({
  open,
  bookingData,
  onClose,
}: BookingConfirmationModalProps) {
  const [copied, setCopied] = useState(false)

  const copyBookingId = () => {
    if (bookingData) {
      navigator.clipboard.writeText(bookingData.bookingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const whatsappMessage = bookingData
    ? `Hi, I just booked a cab (ID: #${bookingData.bookingId}) from ${bookingData.fromCity} to ${bookingData.toCity} on ${bookingData.journeyDate}`
    : ''

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-hidden bg-card text-card-foreground border border-border rounded-2xl sm:rounded-2xl p-4 sm:p-5">
        <DialogHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <CheckCircle size={48} className="text-green-500 animate-bounce" />
          </div>
          <DialogTitle className="text-xl font-bold text-primary">
            Booking Received!
          </DialogTitle>
        </DialogHeader>

        {bookingData && (
          <div className="space-y-4">
            {/* Booking ID */}
            <div className="bg-muted rounded-xl p-2.5 text-center border border-accent">
              <p className="text-xs text-muted-foreground mb-1">Your Booking ID</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-primary font-mono leading-none">
                  #{bookingData.bookingId}
                </p>
                <button
                  onClick={copyBookingId}
                  className="text-xs text-secondary hover:text-primary font-semibold cursor-pointer"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Trip Summary</h3>
              <div className="space-y-1 text-xs border border-border/50 rounded-lg p-2.5 bg-background/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-semibold text-foreground">{bookingData.fromCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-semibold text-foreground">{bookingData.toCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold text-foreground">{bookingData.journeyDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-semibold text-foreground">{bookingData.carType}</span>
                </div>
              </div>
            </div>

            {/* Notification */}
            <div className="bg-accent/10 rounded-lg p-2.5 border-l-4 border-accent text-center">
              <p className="text-xs text-muted-foreground">
                Our team will call you at <span className="font-semibold text-primary">{bookingData.mobileNumber}</span> shortly
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:+919422980970"
                className="flex items-center justify-center gap-1.5 bg-primary hover:bg-[#233F78] text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 hover:shadow-lg text-xs text-center"
              >
                <Phone size={14} />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/919422980970?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BA58] text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 hover:shadow-lg text-xs text-center"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs border-border hover:bg-muted text-foreground cursor-pointer"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
