
export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`
        rounded-2xl
        border border-[#243B53]
        bg-[#0B1B30]
        p-5
        shadow-lg shadow-black/10
        ${hover
          ? 'transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-[#10243B] hover:shadow-xl hover:shadow-black/20'
          : ''
        }
        ${className}
      `}
    >
      {children}
    </div>
  )
}
