
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }

    if (open) document.addEventListener('keydown', onKey)

    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] text-white shadow-2xl shadow-black/40">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#243B53] px-6 py-5">
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-orange-500/10 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[calc(90vh-145px)] overflow-y-auto p-6 text-slate-200">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#243B53] bg-[#08172A] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
