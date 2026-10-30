
import { Link } from 'react-router-dom'
import { Trophy, Camera, MessageCircle, Video, Radio, MapPin, Mail, Phone } from 'lucide-react'
import { NAV_LINKS } from '../utils/constants'

const SOCIAL_LINKS = [
  { Icon: Camera, label: 'Instagram', href: '#', color: 'hover:text-pink-400' },
  { Icon: MessageCircle, label: 'WhatsApp', href: '#', color: 'hover:text-green-400' },
  { Icon: Video, label: 'YouTube', href: '#', color: 'hover:text-red-400' },
  { Icon: Radio, label: 'Live Updates', href: '#', color: 'hover:text-orange-400' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#243B53] bg-[#061326] text-slate-400">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:px-8 lg:py-14">
        {/* Brand */}
        <div>
          <Link to="/" className="mb-4 inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition-transform duration-300 hover:scale-105">
              <Trophy size={21} />
            </span>

            <span className="font-display text-2xl font-extrabold tracking-wide text-white">
              ESCL<span className="text-orange-500">.</span>
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-7 text-slate-400">
            Engineering Sports Championship League — where campus cricket meets professional-grade
            competition.
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
            <MapPin size={14} className="shrink-0 text-orange-500" />
            <span>Pune, Maharashtra, India</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Quick Links
          </h4>

          <div className="mb-4 h-0.5 w-10 rounded-full bg-orange-500" />

          <ul className="flex flex-col gap-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-orange-400"
                >
                  <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-orange-500" />
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-orange-400"
              >
                <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-orange-500" />
                About ESCL
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Contact Us
          </h4>

          <div className="mb-4 h-0.5 w-10 rounded-full bg-orange-500" />

          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#243B53] bg-[#0B1B30] text-orange-400">
                <Mail size={16} />
              </span>
              <div className="min-w-0 pt-1">
                <p className="mb-1 text-xs text-slate-500">Email</p>
                <a
                  href="mailto:escl.league@example.com"
                  className="break-all text-slate-300 transition-colors hover:text-orange-400"
                >
                  escl.league@example.com
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#243B53] bg-[#0B1B30] text-orange-400">
                <Phone size={16} />
              </span>
              <div className="min-w-0 pt-1">
                <p className="mb-1 text-xs text-slate-500">Phone</p>
                <a
                  href="tel:+919876543210"
                  className="text-slate-300 transition-colors hover:text-orange-400"
                >
                  +91 98765 43210
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Follow ESCL
          </h4>

          <div className="mb-4 h-0.5 w-10 rounded-full bg-orange-500" />

          <p className="mb-5 text-sm leading-6 text-slate-400">
            Stay connected for tournament updates, match highlights and league announcements.
          </p>

          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(({ Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#243B53] bg-[#0B1B30] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/60 hover:bg-[#10243B] ${color}`}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[#243B53] bg-[#0B1B30] p-3">
            <p className="text-xs leading-5 text-slate-400">
              <span className="font-semibold text-orange-400">ESCL</span> — Bringing campus cricket
              communities together.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-[#243B53] bg-[#050F1E]/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} Engineering Sports Championship League. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built for the love of cricket <span className="text-orange-500">♥</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
