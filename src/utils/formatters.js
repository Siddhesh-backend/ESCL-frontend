
export function formatDate(dateStr) {
  if (!dateStr) return '-'

  const d = new Date(dateStr)

  if (Number.isNaN(d.getTime())) return dateStr

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(timeStr) {
  if (!timeStr) return '-'
  return timeStr
}

export function statusColor(status) {
  switch ((status || '').toUpperCase()) {
    case 'LIVE':
      return 'bg-orange-500/15 text-orange-400 border border-orange-500/30'

    case 'UPCOMING':
      return 'bg-sky-500/10 text-sky-300 border border-sky-500/25'

    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'

    case 'POSTPONED':
      return 'bg-amber-500/10 text-amber-300 border border-amber-500/25'

    case 'CANCELLED':
      return 'bg-red-500/10 text-red-400 border border-red-500/25'

    default:
      return 'bg-slate-500/10 text-slate-300 border border-slate-500/25'
  }
}
