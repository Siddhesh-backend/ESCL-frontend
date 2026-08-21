export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-700">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-navy-100 border-t-orange-500" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
