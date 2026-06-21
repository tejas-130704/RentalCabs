import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo-new.png"
                alt="Chh. Sambhajinagar (Aurangabad) Tour&Travel Logo"
                className="w-16 h-16 rounded-full object-cover object-center shrink-0 border border-primary-foreground/20"
              />
              <div className="flex flex-col leading-tight">
                <h3 className="font-bold text-lg text-[#FFC570]">Chh. Sambhajinagar</h3>
                <span className="text-xs text-primary-foreground/85">(Aurangabad) Tour&Travel</span>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Welcome to Chh. Sambhajinagar (Aurangabad) Tour&Travel, your trusted partner in the world of transportation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="/" className="hover:text-[#FFC570] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#booking-widget" className="hover:text-[#FFC570] transition">
                  Book a Ride
                </Link>
              </li>
              <li>
                <Link href="#fleet" className="hover:text-[#FFC570] transition">
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link href="#routes" className="hover:text-[#FFC570] transition">
                  Popular Routes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Airport Transfer</li>
              <li>Local Package Tours</li>
              <li>Outstation Round Trip</li>
              <li>One-Way Drop Taxi</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFC570]" />
                <a href="tel:+919422980970" className="hover:underline">+91-9422980970</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFC570]" />
                <a href="mailto:contact@cabs.com" className="hover:underline">contact@cabs.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#FFC570]" />
                <span>CM/5, Thakre Nagar, Maha Laxmi Chowk, N-2, Cidco, (Aurangabad) - 431001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} Chh. Sambhajinagar (Aurangabad) Tour&Travel. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="hover:underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
