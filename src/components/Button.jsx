
const VARIANTS = {
  primary:
    'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/10',

  secondary:
    'border border-[#30445C] bg-[#10243B] text-white hover:bg-[#193550]',

  outline:
    'border border-orange-500/50 bg-transparent text-orange-400 hover:bg-orange-500/10',

  ghost:
    'bg-transparent text-slate-300 hover:bg-[#10243B] hover:text-white',

  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/10',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        focus-ring inline-flex items-center justify-center gap-2
        rounded-xl px-4 py-2.5
        text-sm font-semibold
        transition-all duration-200
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-orange-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-[#061326]
        disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant] || VARIANTS.primary}
        ${className}
      `}
      {...rest}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}

      {children}
    </button>
  )
}
