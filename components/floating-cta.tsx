'use client'

import { Phone, MessageCircle, Car } from 'lucide-react'

function FloatingCTA() {
  const whatsappNumber = '917774887006'
  const phoneNumber = '+917774887006'
  const whatsappMessage = "Hi, I want to book a cab from Chh. Sambhajinagar (Aurangabad) Tour&Travel"

  return (
    <>
      {/* Desktop Floating Buttons */}
      <div className="hidden md:flex fixed bottom-8 right-8 flex-col gap-4 z-50">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20BA58] text-white flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-bounce"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} fill="currentColor" />
        </a>

        {/* Call Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 dark:bg-secondary"
          aria-label="Call us"
        >
          <Phone size={28} fill="currentColor" className="text-accent dark:text-white dark:fill-white" />
        </a>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-2xl">
        <div className="grid grid-cols-3 gap-0 p-4 max-w-lg mx-auto">
          {/* Call Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Phone size={24} className="text-primary" />
            <span className="text-xs font-semibold text-primary">Call</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={24} className="text-[#25D366]" />
            <span className="text-xs font-semibold text-[#25D366]">WhatsApp</span>
          </a>

          {/* Book Now Button */}
          <button
            onClick={() => document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Car size={24} className="text-accent" />
            <span className="text-xs font-semibold text-accent">Book</span>
          </button>
        </div>
      </div>

      {/* Mobile Safe Area Padding */}
      {/* <div className="md:hidden h-20" /> */}
    </>
  )
}

export { FloatingCTA }
export default FloatingCTA
