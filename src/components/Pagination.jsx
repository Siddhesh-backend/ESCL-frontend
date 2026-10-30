
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const buttonClass =
    'flex h-10 w-10 items-center justify-center rounded-xl border border-[#243B53] bg-[#0B1B30] text-slate-300 transition-all duration-200 hover:border-orange-500/60 hover:bg-[#10243B] hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#243B53] disabled:hover:bg-[#0B1B30] disabled:hover:text-slate-300'

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-3 pt-6"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={buttonClass}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <span className="rounded-xl border border-[#243B53] bg-[#0B1B30] px-4 py-2.5 text-sm font-medium text-slate-300">
        Page <span className="font-bold text-orange-400">{page}</span>
        <span className="mx-2 text-slate-600">of</span>
        <span className="font-bold text-white">{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={buttonClass}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
