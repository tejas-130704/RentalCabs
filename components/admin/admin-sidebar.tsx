'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, BarChart3, Clipboard, DollarSign, Truck, MapPin, LogOut, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/bookings', label: 'Bookings', icon: Clipboard },
  { href: '/admin/fares', label: 'Cab Fares', icon: DollarSign },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      toast.success('Logged out')
      window.location.href = '/admin/login'
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 md:hidden z-50 p-2 bg-primary text-white rounded-lg"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-primary text-white transform transition-transform duration-300 z-40 md:z-0 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo-new.png"
              alt="Chh. Sambhajinagar (Aurangabad) Tour&Travel Logo"
              className="w-14 h-14 rounded-full object-cover object-center shrink-0 border border-white/20"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold">Chh. Sambhajinagar</span>
              <span className="text-[10px] text-[#F5C767] uppercase font-semibold tracking-wider font-poppins">Tour & Travel</span>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-accent text-primary' : 'hover:bg-secondary'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-secondary my-6" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
