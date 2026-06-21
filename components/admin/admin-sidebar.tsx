'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  Car,
  Tag,
  MapPin,
  MessageSquare,
  Menu,
  X,
  Shield,
  Eye
} from 'lucide-react'

const MENU_ITEMS = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: ClipboardList,
  },
  {
    title: 'Fares',
    href: '/admin/fares',
    icon: Tag,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    title: 'Viewers',
    href: '/admin/viewers',
    icon: Eye,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-border shadow-md md:hidden hover:bg-muted transition-colors text-primary"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-[#0F2C59] text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-primary shrink-0">
            <Shield size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight tracking-wide">
              Chh. Sambhajinagar
            </h1>
            <p className="text-[10px] text-white/60 tracking-wider font-semibold uppercase">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            // Match the root /admin exactly or subpaths if it matches other paths
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#FFC570] text-[#0F2C59] shadow-lg shadow-black/10'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'stroke-[2.5]' : ''} />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">
            &copy; {new Date().getFullYear()} Rental Cabs
          </p>
        </div>
      </aside>
    </>
  )
}
