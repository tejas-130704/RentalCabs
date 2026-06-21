'use client'

import { useEffect, useState } from 'react'
import { StatCard } from './stat-card'
import { BookingStatusBadge } from './booking-status-badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  BarChart3, Clock, CheckCircle, AlertCircle, IndianRupee,
  CalendarDays, ArrowRight, Car
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Analytics {
  todayCount: number
  pendayCount: number
  confirmedThisWeek: number
  completedCount: number
  totalCount: number
  totalRevenue: number
  last7Days: Array<{ date: string; count: number }>
  statusBreakdown: Array<{ status: string; count: number }>
  recentBookings: Array<{
    id: string
    passengerName: string
    mobileNumber: string
    fromCity: string
    toCity: string
    carType: string
    status: string
    createdAt: string
    estimatedFare?: number | null
  }>
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F5C767',
  confirmed: '#22c55e',
  completed: '#3b82f6',
  cancelled: '#ef4444',
}

export function DashboardContent() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarDays}
          label="Today's Bookings"
          value={analytics?.todayCount ?? 0}
        />
        <StatCard
          icon={Clock}
          label="Pending Bookings"
          value={analytics?.pendayCount ?? 0}
          highlight={!!analytics?.pendayCount && analytics.pendayCount > 0}
        />
        <StatCard
          icon={CheckCircle}
          label="Confirmed This Week"
          value={analytics?.confirmedThisWeek ?? 0}
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${(analytics?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <h3 className="text-base font-bold text-primary mb-1">Bookings — Last 7 Days</h3>
          <p className="text-xs text-gray-400 mb-4">Daily booking volume</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics?.last7Days || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`${v}`, 'Count']}
              />
              <Bar dataKey="count" fill="#1A3263" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown Pie */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="text-base font-bold text-primary mb-1">Status Breakdown</h3>
          <p className="text-xs text-gray-400 mb-4">All-time distribution</p>
          {analytics && analytics.statusBreakdown.some(s => s.count > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={analytics.statusBreakdown.filter(s => s.count > 0)}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={35}
                  >
                    {analytics.statusBreakdown.filter(s => s.count > 0).map(entry => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any, name: any) => [v, String(name || '').charAt(0).toUpperCase() + String(name || '').slice(1)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {analytics.statusBreakdown.map(s => (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] || '#ccc' }} />
                      <span className="text-gray-600 capitalize">{s.status}</span>
                    </div>
                    <span className="font-bold text-gray-800">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No booking data yet
            </div>
          )}
        </div>
      </div>

      {/* Summary + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Summary */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="text-base font-bold text-primary mb-4">Quick Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total All-Time', value: analytics?.totalCount ?? 0, color: 'text-gray-800' },
              { label: 'Today', value: analytics?.todayCount ?? 0, color: 'text-[#1A3263]' },
              { label: 'Pending Action', value: analytics?.pendayCount ?? 0, color: 'text-amber-600' },
              { label: 'Confirmed (week)', value: analytics?.confirmedThisWeek ?? 0, color: 'text-green-600' },
              { label: 'Completed', value: analytics?.completedCount ?? 0, color: 'text-blue-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{label}</span>
                <span className={`font-bold text-lg ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-primary">Recent Bookings</h3>
            <a href="/admin/bookings" className="text-xs text-[#F5C767] font-bold hover:underline">
              View All →
            </a>
          </div>
          {analytics?.recentBookings && analytics.recentBookings.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentBookings.map(b => (
                <div
                  key={b.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="w-9 h-9 bg-[#1A3263]/10 rounded-full flex items-center justify-center shrink-0">
                    <Car size={16} className="text-[#1A3263]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{b.passengerName}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <span>{b.fromCity}</span>
                      <ArrowRight size={10} />
                      <span>{b.toCity}</span>
                      <span className="text-gray-300 mx-1">•</span>
                      <span>{b.carType}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <BookingStatusBadge status={b.status} />
                    {b.estimatedFare != null && (
                      <p className="text-xs font-bold text-[#1A3263] mt-1">
                        ₹{b.estimatedFare.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BarChart3 size={32} className="text-gray-300 mb-2" />
              <p className="text-gray-400 text-sm">No bookings yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
