export default function Filter({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-medium text-navy-700">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring rounded-lg border border-navy-100 px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-orange-500"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
