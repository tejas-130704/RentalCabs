'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminHeaderProps {
  title: string
  username?: string
}

export function AdminHeader({ title, username }: AdminHeaderProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

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
    <header className="sticky top-0 bg-white border-b border-border p-4 md:p-6 flex items-center justify-between z-20">
      <h2 className="text-xl md:text-2xl font-bold text-primary pl-12 md:pl-0">{title}</h2>

      <div className="flex items-center gap-4">
        {username && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <User size={20} className="text-primary" />
              <span className="hidden sm:inline text-sm font-medium text-foreground">{username}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-muted w-full transition-colors rounded-lg"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
