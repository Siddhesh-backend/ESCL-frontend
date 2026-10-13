import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Menu,
  X,
  Trophy,
  ShieldCheck,
  Home,
  CalendarDays,
  Users,
  TableProperties,
  Mail,
} from 'lucide-react'
import { NAV_LINKS } from '../utils/constants'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

const MOBILE_NAV_LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Players', to: '/players', icon: Users },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Points', to: '/points-table', icon: TableProperties },
  { label: 'Contact', to: '/contact', icon: Mail },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const isAdmin = user?.role === 'ADMIN'

  const closeMenu = () => setOpen(false)

  const linkClass = ({ isActive }) =>
    `group relative py-2 text-sm font-semibold uppercase tracking-wide
     transition-all duration-300
     ${isActive ? 'text-orange-400' : 'text-white/75 hover:text-white'}
     after:absolute after:-bottom-1 after:left-0 after:h-[2px]
     after:rounded-full after:bg-orange-500
     after:transition-all after:duration-300
     ${isActive ? 'after:w-full' : 'after:w-0 group-hover:after:w-full'}`

  return (
    <>
      <header
        className="
          sticky top-0 z-50
          border-b border-white/10
          bg-[#0b1d35]/90
          shadow-[0_8px_30px_rgba(0,0,0,0.18)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto flex h-[72px] max-w-7xl
            items-center justify-between
            px-4 sm:px-6 lg:px-8
          "
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <span
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-gradient-to-br from-orange-400 to-orange-600
                text-white shadow-[0_6px_20px_rgba(249,115,22,0.28)]
                transition-all duration-300
                group-hover:scale-105
                group-hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)]
              "
            >
              <Trophy size={20} strokeWidth={2.3} />
            </span>

            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-extrabold tracking-wide text-white">
                ESCL
              </span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Engineering Sports
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex lg:gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button
                      variant="outline"
                      className="
                        !flex !items-center !gap-2
                        !border-white/25 !bg-white/[0.04] !text-white
                        hover:!border-orange-400 hover:!bg-orange-500/10
                        hover:!text-orange-300
                      "
                    >
                      <ShieldCheck size={16} />
                      Dashboard
                    </Button>
                  </Link>
                )}

                <Button
                  variant="primary"
                  onClick={logout}
                  className="
                    !shadow-[0_5px_18px_rgba(249,115,22,0.22)]
                    hover:!shadow-[0_7px_22px_rgba(249,115,22,0.35)]
                  "
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="
                      !border-white/30 !bg-white/[0.03] !text-white
                      hover:!border-orange-400 hover:!bg-orange-500/10
                      hover:!text-orange-300
                    "
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    variant="primary"
                    className="
                      !shadow-[0_5px_18px_rgba(249,115,22,0.22)]
                      hover:!shadow-[0_7px_22px_rgba(249,115,22,0.35)]
                    "
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="
              flex h-10 w-10 items-center justify-center rounded-xl
              border border-white/10 bg-white/[0.05] text-white
              transition-all duration-200
              hover:border-orange-400/40 hover:bg-orange-500/10
              md:hidden
            "
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation-menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div
            id="mobile-navigation-menu"
            className="
              border-t border-white/10 bg-[#0b1d35]/98
              px-4 pb-5 shadow-[0_15px_35px_rgba(0,0,0,0.25)]
              backdrop-blur-xl md:hidden
            "
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1.5 pt-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${isActive
                      ? 'bg-orange-500 text-white shadow-[0_5px_18px_rgba(249,115,22,0.2)]'
                      : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile Authentication Actions */}
              <div className="mt-3 border-t border-white/10 pt-4">
                {isAuthenticated ? (
                  <div className="flex gap-2.5">
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex-1"
                        onClick={closeMenu}
                      >
                        <Button
                          variant="outline"
                          className="
                            !flex !w-full !items-center !justify-center !gap-2
                            !border-white/25 !text-white
                          "
                        >
                          <ShieldCheck size={16} />
                          Dashboard
                        </Button>
                      </Link>
                    )}

                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => {
                        logout()
                        closeMenu()
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    <Link
                      to="/login"
                      className="flex-1"
                      onClick={closeMenu}
                    >
                      <Button
                        variant="outline"
                        className="!w-full !border-white/25 !text-white"
                      >
                        Login
                      </Button>
                    </Link>

                    <Link
                      to="/register"
                      className="flex-1"
                      onClick={closeMenu}
                    >
                      <Button variant="primary" className="!w-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Fixed Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile bottom navigation"
        className="
          fixed inset-x-0 bottom-0 z-40
          border-t border-white/10
          bg-[#0b1d35]/95
          shadow-[0_-4px_20px_rgba(0,0,0,0.18)]
          backdrop-blur-xl
          md:hidden
        "
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {MOBILE_NAV_LINKS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold transition-colors ${isActive
                  ? 'text-orange-400'
                  : 'text-white/65 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}