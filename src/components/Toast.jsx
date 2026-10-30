
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const STYLES = {
  success: {
    bg: 'border-emerald-500/30 bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    icon: CheckCircle2,
  },
  error: {
    bg: 'border-red-500/30 bg-red-500/10',
    iconColor: 'text-red-400',
    icon: AlertTriangle,
  },
  info: {
    bg: 'border-orange-500/30 bg-[#10243B]',
    iconColor: 'text-orange-400',
    icon: Info,
  },
}

export default function Toast({ message, type = 'info', onClose }) {
  const { bg, icon: Icon, iconColor } = STYLES[type] || STYLES.info

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-slate-100 shadow-xl shadow-black/20 backdrop-blur-sm ${bg}`}
    >
      <Icon size={19} className={`shrink-0 ${iconColor}`} />

      <span className="min-w-0 flex-1 break-words leading-5">
        {message}
      </span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <X size={16} />
      </button>
    </div>
  )
}
