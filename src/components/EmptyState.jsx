export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy-100 px-6 py-16 text-center">
      {Icon && (
        <div className="rounded-full bg-orange-100 p-4 text-orange-500">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-navy-700/70">{description}</p>}
      {action}
    </div>
  )
}
