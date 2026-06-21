export function BookingStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-accent/20', text: 'text-accent', label: 'Pending' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
