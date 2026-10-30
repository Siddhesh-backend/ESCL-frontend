
export default function Filter({ label, value, onChange, options }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-xl
          border border-[#30445C]
          bg-[#061326] px-3 py-3
          text-sm font-medium text-white
          outline-none transition-colors
          focus:border-orange-500
          focus:ring-2 focus:ring-orange-500/20
        "
      >
        <option
          value=""
          className="bg-[#0B1B30] text-white"
        >
          All
        </option>

        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="bg-[#0B1B30] text-white"
          >
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
