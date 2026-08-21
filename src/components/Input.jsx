export default function Input({ label, id, error, className = '', ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-navy-800">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`focus-ring w-full rounded-lg border px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-700/40 outline-none transition-colors ${
          error ? 'border-loss' : 'border-navy-100 focus:border-orange-500'
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs font-medium text-loss">{error}</span>}
    </div>
  )
}
