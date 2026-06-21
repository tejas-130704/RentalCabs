'use client'

import { useEffect, useState } from 'react'
import { StatCard } from '@/components/admin/stat-card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Eye, Users, Smartphone, Laptop, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

interface ViewerAnalytics {
  totalUnique: number
  todayUnique: number
  dailyStats: Array<{
    date: string
    formattedDate: string
    uniqueDevices: number
  }>
  recentHits: Array<{
    id: string
    device: string
    browser: string
    visitedAt: string
    userAgent: string
  }>
}

export function ViewersClientPage() {
  const [data, setData] = useState<ViewerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/viewers')
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else {
          toast.error('Failed to load viewer analytics')
        }
      } catch (error) {
        console.error('Error fetching viewer stats:', error)
        toast.error('Network error loading viewer stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-sm text-gray-500 font-poppins">Loading viewer analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-10 bg-white border border-border rounded-xl">
        <p className="text-gray-500 text-sm">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={Users}
          label="Total Unique Devices (All-Time)"
          value={data.totalUnique}
        />
        <StatCard
          icon={Eye}
          label="Today's Unique Devices"
          value={data.todayUnique}
          highlight={data.todayUnique > 0}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-base font-bold text-primary mb-1 font-poppins">Unique Devices — Last 30 Days</h3>
        <p className="text-xs text-gray-400 mb-6">Daily unique visitors (IP + User-Agent hashed)</p>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12, backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                formatter={(v: any) => [`${v}`, 'Unique Devices']}
              />
              <Bar dataKey="uniqueDevices" fill="#1A3263" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Hits Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-base font-bold text-primary font-poppins">Recent Visits</h3>
          <p className="text-xs text-gray-400 mt-1">Live feed of the latest 50 visitor transactions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Browser</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.recentHits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">
                    No visitor logs recorded yet.
                  </td>
                </tr>
              ) : (
                data.recentHits.map((hit) => (
                  <tr key={hit.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900 whitespace-nowrap">
                      {new Date(hit.visitedAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {hit.device === 'Mobile' ? (
                          <Smartphone size={12} className="text-slate-500" />
                        ) : (
                          <Laptop size={12} className="text-slate-500" />
                        )}
                        {hit.device}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <Globe size={12} className="text-blue-500" />
                        {hit.browser}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono truncate max-w-xs" title={hit.userAgent}>
                      {hit.userAgent}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
