'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { BookingsTable } from '@/components/admin/bookings-table'
import { BookingDetailDrawer } from '@/components/admin/booking-detail-drawer'
import { CreateBookingModal } from '@/components/admin/create-booking-modal'
import {
  Search, Download, Plus, ChevronLeft, ChevronRight,
  Trash2, Loader2, RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  passengerName: string
  mobileNumber: string
  fromCity: string
  toCity: string
  carType: string
  tripType: string
  journeyType: string
  journeyDate: string
  estimatedFare?: number | null
  email?: string | null
  status: string
  createdAt: string
}

interface PaginatedResponse {
  bookings: Booking[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function BookingsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)
  const LIMIT = 20

  const fetchBookings = useCallback(async (currentPage = page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (fromDate) params.append('from', fromDate)
      if (toDate) params.append('to', toDate)
      params.append('page', String(currentPage))
      params.append('limit', String(LIMIT))

      const response = await fetch(`/api/admin/bookings?${params}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        toast.error('Failed to load bookings')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, fromDate, toDate, page])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchBookings(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, statusFilter, fromDate, toDate])

  useEffect(() => {
    fetchBookings(page)
  }, [page])

  const handleDelete = async (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/bookings/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Booking deleted')
        setDeleteId(null)
        fetchBookings(page)
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Error deleting booking')
    } finally {
      setDeleting(false)
    }
  }

  const handleExport = () => {
    if (!data?.bookings) return
    const csv = [
      ['Booking ID', 'Name', 'Mobile', 'From', 'To', 'Car', 'Trip Type', 'Journey Date', 'Fare', 'Status', 'Created'],
      ...data.bookings.map(b => [
        b.id,
        b.passengerName,
        b.mobileNumber,
        b.fromCity,
        b.toCity,
        b.carType,
        b.tripType,
        b.journeyDate ? new Date(b.journeyDate).toLocaleDateString('en-IN') : '',
        b.estimatedFare != null ? `₹${b.estimatedFare}` : '',
        b.status,
        new Date(b.createdAt).toLocaleString('en-IN'),
      ]),
    ]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported!')
  }

  const bookings = data?.bookings || []
  const totalPages = data?.totalPages || 1
  const total = data?.total || 0

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <AdminHeader title="Bookings Management" />

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-5">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, mobile, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              title="From date"
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C59] text-gray-600"
            />
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              title="To date"
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C59] text-gray-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => fetchBookings(page)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
            >
              <Download size={14} />
              Export CSV
            </button>
            <div className="flex-1" />
            <span className="text-xs text-gray-400 self-center">
              {total} booking{total !== 1 ? 's' : ''} total
            </span>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F2C59] text-white rounded-lg hover:bg-[#1a4080] text-sm font-bold transition-colors shadow-sm"
            >
              <Plus size={16} />
              New Booking
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="animate-spin text-[#0F2C59]" />
              <p className="text-sm text-gray-500">Loading bookings...</p>
            </div>
          ) : (
            <BookingsTable
              bookings={bookings}
              onViewDetails={setSelectedId}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-3 shadow-sm gap-3">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              Page {page} of {totalPages} · {total} results
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors shrink-0"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              {/* Page numbers */}
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                        p === page
                          ? 'bg-[#0F2C59] text-white'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors shrink-0"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Booking?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently remove this booking. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <BookingDetailDrawer
        bookingId={selectedId}
        onClose={() => setSelectedId(null)}
        onUpdate={() => fetchBookings(page)}
        onDelete={(id) => {
          setSelectedId(null)
          fetchBookings(page)
        }}
      />

      {/* Create Modal */}
      <CreateBookingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => fetchBookings(1)}
      />
    </div>
  )
}
