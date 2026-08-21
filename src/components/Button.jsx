const VARIANTS = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white',
  secondary: 'bg-navy-900 hover:bg-navy-800 text-white',
  outline: 'border border-navy-900 text-navy-900 hover:bg-navy-100',
  ghost: 'text-navy-900 hover:bg-navy-100',
  danger: 'bg-loss hover:bg-red-700 text-white',
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
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  )
}
