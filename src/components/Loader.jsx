
export default function Loader({ label = 'Loading...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-16 text-slate-300"
    >
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-[#243B53] border-t-orange-500" />
        <span className="h-2 w-2 rounded-full bg-orange-400" />
      </span>

      <span className="text-sm font-medium tracking-wide text-slate-400">
        {label}
      </span>
    </div>
  )
}
