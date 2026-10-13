import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListTree,
  Trophy,
  Mail,
  Home,
} from 'lucide-react'

const LINKS = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    shortLabel: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/admin/players',
    label: 'Manage Players',
    shortLabel: 'Players',
    icon: Users,
  },
  {
    to: '/admin/schedule',
    label: 'Manage Schedule',
    shortLabel: 'Schedule',
    icon: CalendarDays,
  },
  {
    to: '/admin/upcoming-series',
    label: 'Manage Series',
    shortLabel: 'Series',
    icon: ListTree,
  },
  {
    to: '/admin/points-table',
    label: 'Manage Points Table',
    shortLabel: 'Points',
    icon: Trophy,
  },
  {
    to: '/admin/messages',
    label: 'Manage Messages',
    shortLabel: 'Messages',
    icon: Mail,
  },
]

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-900 text-white md:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
            <Trophy size={18} />
          </span>

          <span className="font-display text-lg font-bold">
            ESCL Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {/* Visit Website */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                ? 'bg-orange-500 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Home size={18} />
            Visit Home page
          </NavLink>

          <div className="my-2 border-t border-white/10" />

          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Admin mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy-900 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="grid grid-cols-7">
          {/* Website Home */}
          <NavLink
            to="/"
            end
            aria-label="Visit Website"
            className={({ isActive }) =>
              `focus-ring flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-3 text-center transition-colors ${isActive
                ? 'text-orange-400'
                : 'text-white/65 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Home size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="w-full truncate text-[9px] font-semibold leading-tight">
                  Website
                </span>
              </>
            )}
          </NavLink>

          {LINKS.map(({ to, shortLabel, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={shortLabel}
              className={({ isActive }) =>
                `focus-ring flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-3 text-center transition-colors ${isActive
                  ? 'text-orange-400'
                  : 'text-white/65 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span className="w-full truncate text-[9px] font-semibold leading-tight">
                    {shortLabel}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}