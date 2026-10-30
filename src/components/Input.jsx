
export default function Input({
  label,
  id,
  error,
  className = '',
  ...rest
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-200"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full rounded-xl border
          bg-[#061326]
          px-3.5 py-3
          text-sm font-medium text-white
          placeholder:text-slate-500
          outline-none transition-all duration-200
          focus:border-orange-500
          focus:ring-2 focus:ring-orange-500/20
          disabled:cursor-not-allowed disabled:opacity-60
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-[#30445C]'
          }
          ${className}
        `}
        {...rest}
      />

      {error && (
        <span className="text-xs font-medium text-red-400">
          {error}
        </span>
      )}
    </div>
  )
}
