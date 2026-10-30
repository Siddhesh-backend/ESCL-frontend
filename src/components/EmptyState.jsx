
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#30445C] bg-[#0B1B30]/70 px-6 py-14 text-center sm:py-16">
      {Icon && (
        <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
          <Icon size={28} strokeWidth={1.8} />
        </div>
      )}

      <h3 className="mt-2 text-lg font-bold text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
