import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListTree,
  Trophy,
  Mail,
  Trophy as LogoIcon,
} from 'lucide-react'

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/players', label: 'Manage Players', icon: Users },
  { to: '/admin/schedule', label: 'Manage Schedule', icon: CalendarDays },
  { to: '/admin/upcoming-series', label: 'Manage Series', icon: ListTree },
  { to: '/admin/points-table', label: 'Manage Points Table', icon: Trophy },
  { to: '/admin/messages', label: 'Manage Messages', icon: Mail },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-navy-900 text-white md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
          <LogoIcon size={18} />
        </span>
        <span className="font-display text-lg font-bold">ESCL Admin</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-orange-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
