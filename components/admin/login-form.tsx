'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      toast.error('Please enter both username and password')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Logged in successfully!')
        // Force fully reload/redirect to /admin to ensure middleware session headers apply
        window.location.href = '/admin'
      } else {
        toast.error(data.error || 'Invalid credentials')
      }
    } catch (error) {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 bg-radial from-slate-100 to-slate-200">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-[#0F2C59] flex items-center justify-center text-[#FFC570] mb-4 shadow-md shadow-blue-900/20">
            <KeyRound size={24} className="stroke-[2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F2C59] tracking-tight">
            Admin Portal Access
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your bookings, fleet, and fares
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent text-sm transition-all bg-gray-50/50"
                  placeholder="Enter admin username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent text-sm transition-all bg-gray-50/50"
                  placeholder="Enter admin password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#0F2C59] hover:bg-[#1a4080] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F2C59] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg shadow-blue-900/10 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
