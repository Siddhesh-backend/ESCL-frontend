
import { Search } from 'lucide-react'

export default function SearchBox({
  value,
  onChange,
  placeholder = 'Search...',
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          focus-ring w-full rounded-xl
          border border-[#30445C]
          bg-[#061326] text-white
          py-3 pl-10 pr-3 text-sm
          placeholder:text-slate-500
          outline-none transition-colors
          focus:border-orange-500
          focus:ring-2 focus:ring-orange-500/20
        "
      />
    </div>
  )
}
