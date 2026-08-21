import { Search } from 'lucide-react'

export default function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-700/50" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded-lg border border-navy-100 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500"
      />
    </div>
  )
}
