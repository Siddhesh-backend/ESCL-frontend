import { Link } from 'react-router-dom'
import { Trophy, Camera, MessageCircle, Video, Radio } from 'lucide-react'
import { NAV_LINKS } from '../utils/constants'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
              <Trophy size={18} />
            </span>
            <span className="font-display text-xl font-bold">ESCL</span>
          </div>
          <p className="text-sm leading-relaxed">
            Engineering Sports Championship League — where campus cricket meets professional-grade
            competition.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-display text-base font-semibold text-white">Quick Links</h4>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-orange-400">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/about" className="transition-colors hover:text-orange-400">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-base font-semibold text-white">Contact</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li>escl.league@example.com</li>
            <li>+91 98765 43210</li>
            <li>Pune, Maharashtra, India</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-base font-semibold text-white">Follow ESCL</h4>
          <div className="flex gap-3">
            {[Camera, MessageCircle, Video, Radio].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                aria-label="Social link"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-orange-500 hover:text-orange-400"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Engineering Sports Championship League. All rights reserved.
      </div>
    </footer>
  )
}
