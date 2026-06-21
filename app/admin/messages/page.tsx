'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import {
  Search, Phone, User, Clock, Trash2, Edit, Eye, X, Loader2, RefreshCw, MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ContactMessage {
  id: string
  name: string
  whatsapp: string
  message: string
  createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null)
  const [editMsg, setEditMsg] = useState<ContactMessage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/contact')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        toast.error('Failed to load messages')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/contact/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Message deleted')
        setDeleteId(null)
        if (selectedMsg?.id === deleteId) {
          setSelectedMsg(null)
        }
        fetchMessages()
      } else {
        toast.error('Failed to delete message')
      }
    } catch {
      toast.error('Error deleting message')
    } finally {
      setDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editMsg) return
    if (!editMsg.name || !editMsg.whatsapp || !editMsg.message) {
      toast.error('All fields are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/contact/${editMsg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editMsg.name,
          whatsapp: editMsg.whatsapp,
          message: editMsg.message,
        }),
      })

      if (res.ok) {
        toast.success('Message updated')
        setEditMsg(null)
        fetchMessages()
      } else {
        toast.error('Failed to update message')
      }
    } catch {
      toast.error('Error updating message')
    } finally {
      setSaving(false)
    }
  }

  const filteredMessages = messages.filter((m) => {
    const term = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(term) ||
      m.whatsapp.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term)
    )
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <AdminHeader title="Customer Messages" />

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-5">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, WhatsApp, or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={fetchMessages}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <span className="text-xs text-gray-400 self-center">
                {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Messages List / Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="animate-spin text-[#0F2C59]" />
              <p className="text-sm text-gray-500">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No messages found</p>
              <p className="text-gray-400 text-sm mt-1">Contact form submissions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Sender</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Message Preview</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Received On</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{msg.id}
                        </span>
                      </td>

                      {/* Sender */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">{msg.name}</p>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                          <Phone size={11} className="text-green-600" />
                          <span className="text-gray-700">{msg.whatsapp}</span>
                        </div>
                      </td>

                      {/* Content Preview */}
                      <td className="px-5 py-4 max-w-xs truncate text-gray-600">
                        {msg.message}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                        {new Date(msg.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedMsg(msg)}
                            title="View Message"
                            className="p-1.5 text-[#1A3263] hover:bg-[#1A3263]/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setEditMsg(msg)}
                            title="Edit Message"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(msg.id)}
                            title="Delete Message"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Message?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently delete this message record. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Viewer Drawer */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedMsg(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#1A3263] to-[#233F78]">
              <div>
                <h2 className="text-lg font-bold text-white">Message Details</h2>
                <p className="text-white/60 text-xs font-mono mt-0.5">#{selectedMsg.id}</p>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-white/70 hover:text-white p-1.5 transition-colors cursor-pointer">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Sender Details Card */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <User size={15} className="text-[#1A3263]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sender Info</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-400 font-medium">Name:</span>
                    <span className="font-semibold text-gray-800">{selectedMsg.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-400 font-medium">WhatsApp Number:</span>
                    <a
                      href={`https://wa.me/${selectedMsg.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-green-600 hover:underline flex items-center gap-1"
                    >
                      {selectedMsg.whatsapp}
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 font-medium">Received At:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(selectedMsg.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content Card */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={15} className="text-[#1A3263]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message Content</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed shadow-sm min-h-[150px]">
                  {selectedMsg.message}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 flex gap-2">
              <button
                onClick={() => {
                  setEditMsg(selectedMsg)
                  setSelectedMsg(null)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit size={14} />
                Edit Message
              </button>
              <button
                onClick={() => setDeleteId(selectedMsg.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200 cursor-pointer"
                title="Delete message"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Editor Modal */}
      {editMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditMsg(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#1A3263] to-[#233F78]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit size={18} className="text-[#1A3263]" />
                </div>
                <h2 className="text-lg font-bold text-white">Edit Message</h2>
              </div>
              <button onClick={() => setEditMsg(null)} className="text-white/70 hover:text-white transition-colors cursor-pointer">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sender Name</label>
                <input
                  type="text"
                  value={editMsg.name}
                  onChange={(e) => setEditMsg({ ...editMsg, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={editMsg.whatsapp}
                  onChange={(e) => setEditMsg({ ...editMsg, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message Content</label>
                <textarea
                  value={editMsg.message}
                  onChange={(e) => setEditMsg({ ...editMsg, message: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditMsg(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[#1A3263] text-white rounded-lg text-sm font-bold hover:bg-[#233F78] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Save(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}
