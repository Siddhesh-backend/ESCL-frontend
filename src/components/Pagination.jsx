import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="focus-ring rounded-lg border border-navy-100 p-2 text-navy-900 disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="stat-num text-sm font-medium text-navy-800">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="focus-ring rounded-lg border border-navy-100 p-2 text-navy-900 disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
