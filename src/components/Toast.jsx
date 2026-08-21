import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const STYLES = {
  success: { bg: 'bg-win', icon: CheckCircle2 },
  error: { bg: 'bg-loss', icon: AlertTriangle },
  info: { bg: 'bg-navy-900', icon: Info },
}

export default function Toast({ message, type = 'info', onClose }) {
  const { bg, icon: Icon } = STYLES[type] || STYLES.info
  return (
    <div className={`flex items-center gap-3 rounded-xl ${bg} px-4 py-3 text-sm text-white shadow-lg`}>
      <Icon size={18} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} aria-label="Dismiss" className="focus-ring rounded-full p-0.5 hover:bg-white/20">
        <X size={14} />
      </button>
    </div>
  )
}
