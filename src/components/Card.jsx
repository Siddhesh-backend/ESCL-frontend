export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`rounded-2xl border border-navy-100 bg-white p-5 shadow-sm ${
        hover ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
