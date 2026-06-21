'use client'

import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo-new.png"
              alt="Chh. Sambhajinagar (Aurangabad) Tour&Travel Logo"
              className="w-12 h-12 rounded-full object-cover object-center shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm sm:text-base text-[#1A3263] font-poppins whitespace-nowrap">Chh. Sambhajinagar</span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium font-poppins whitespace-nowrap">(Aurangabad) Tour&Travel</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-accent transition">
              Home
            </Link>
            <Link href="#booking-widget" className="text-sm font-medium text-foreground hover:text-accent transition">
              Book Cab
            </Link>
            <Link href="#fleet" className="text-sm font-medium text-foreground hover:text-accent transition">
              Fleet
            </Link>
            <Link href="#routes" className="text-sm font-medium text-foreground hover:text-accent transition">
              Routes
            </Link>
            <Link href="#contact" className="text-sm font-medium text-foreground hover:text-accent transition">
              Contact
            </Link>
          </div>

          {/* Phone Numbers - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+918421684040"
              className="bg-[#1A3263] hover:bg-[#233F78] text-white px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5"
            >
              <Phone size={14} />
              <span>+91-8421684040</span>
            </a>
            <a
              href="tel:+919422980970"
              className="bg-[#FFC570] hover:bg-[#ffb64d] text-[#1A3263] px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5"
            >
              <Phone size={14} />
              <span>+91-9422980970</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-foreground focus:outline-none"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3 pt-2 border-t border-border">
            <Link
              href="/"
              className="block text-sm font-medium text-foreground hover:text-accent transition"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#booking-widget"
              className="block text-sm font-medium text-foreground hover:text-accent transition"
              onClick={() => setMobileOpen(false)}
            >
              Book Cab
            </Link>
            <Link
              href="#fleet"
              className="block text-sm font-medium text-foreground hover:text-accent transition"
              onClick={() => setMobileOpen(false)}
            >
              Fleet
            </Link>
            <Link
              href="#routes"
              className="block text-sm font-medium text-foreground hover:text-accent transition"
              onClick={() => setMobileOpen(false)}
            >
              Routes
            </Link>
            <Link
              href="#contact"
              className="block text-sm font-medium text-foreground hover:text-accent transition"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href="tel:+918421684040"
                className="w-full bg-[#1A3263] text-white py-2 rounded-full font-bold text-sm text-center flex items-center justify-center gap-2"
              >
                <Phone size={14} />
                <span>+91-8421684040</span>
              </a>
              <a
                href="tel:+919422980970"
                className="w-full bg-[#FFC570] text-[#1A3263] py-2 rounded-full font-bold text-sm text-center flex items-center justify-center gap-2"
              >
                <Phone size={14} />
                <span>+91-9422980970</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
