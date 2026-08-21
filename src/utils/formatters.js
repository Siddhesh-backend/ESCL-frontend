export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatTime(timeStr) {
  if (!timeStr) return '-'
  return timeStr
}

export function statusColor(status) {
  switch ((status || '').toUpperCase()) {
    case 'LIVE':
      return 'bg-orange-500 text-white'
    case 'UPCOMING':
      return 'bg-navy-100 text-navy-800'
    case 'COMPLETED':
      return 'bg-pitch-100 text-navy-700'
    case 'POSTPONED':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-pitch-100 text-navy-700'
  }
}
