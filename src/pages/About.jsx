import { Target, Eye, Users } from 'lucide-react'
import Card from '../components/Card'

const ORGANIZERS = [
  { name: 'League Office', role: 'Tournament Operations' },
  { name: 'Campus Sports Council', role: 'Governance & Compliance' },
  { name: 'ESCL Media Desk', role: 'Broadcast & Press' },
]

export default function About() {
  return (
    <div>
      {/* ABOUT HERO */}
      <section
        className="relative overflow-hidden bg-[#071a31] py-20 text-center text-white"
        style={{
          backgroundImage: "url('/escl-stadium-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Same dark treatment as Schedule page */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06172c]/95 via-[#081d36]/60 to-[#08172d]/50" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#071a31] to-transparent" />

        {/* Orange atmospheric glow */}
        <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-orange-500/15 blur-[100px]" />

        {/* Hero content */}
        <div className="relative mx-auto max-w-3xl px-4">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            About Us
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            About ESCL
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
            The Engineering Sports Championship League is a season-long cricket tournament that
            brings engineering campuses together under one professionally run competition.
          </p>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <Target size={20} />
            </div>
            <h2 className="font-display text-xl font-semibold text-navy-900">Our Mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
              To give every engineering campus access to a structured, fairly officiated cricket
              league that rewards consistent performance across a full season.
            </p>
          </Card>

          <Card>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <Eye size={20} />
            </div>
            <h2 className="font-display text-xl font-semibold text-navy-900">Our Vision</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
              To become the benchmark inter-college cricket league, known for transparent standings,
              reliable scheduling and a genuinely competitive points race.
            </p>
          </Card>
        </div>
      </section>

      {/* ORGANIZERS */}
      <section className="bg-pitch-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <Users size={22} className="text-orange-500" />
            <h2 className="font-display text-2xl font-bold text-navy-900">Organizers</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {ORGANIZERS.map((o) => (
              <Card key={o.name}>
                <h3 className="font-display text-lg font-semibold text-navy-900">{o.name}</h3>
                <p className="mt-1 text-sm text-navy-700/70">{o.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
{/* GALLERY */}
<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
  <h2 className="mb-6 font-display text-2xl font-bold text-navy-900">
    Gallery
  </h2>

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

    {/* Gallery Image 1 */}
    <div
      className="
        group
        aspect-square
        overflow-hidden
        rounded-2xl
        border border-navy-100
        bg-pitch-50
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <img
        src="/gallery-1.jpg"
        alt="ESCL Gallery"
        className="
          h-full
          w-full
          object-cover
          transition-transform duration-500
          group-hover:scale-105
        "
      />
    </div>

    {/* Gallery Image 2 */}
    <div
      className="
        group
        aspect-square
        overflow-hidden
        rounded-2xl
        border border-navy-100
        bg-pitch-50
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <img
        src="/gallery-2.jpg"
        alt="ESCL Gallery"
        className="
          h-full
          w-full
          object-cover
          transition-transform duration-500
          group-hover:scale-105
        "
      />
    </div>

    {/* HOME IMAGE — Stadium Only */}
    <div
      className="
        group
        aspect-square
        overflow-hidden
        rounded-2xl
        border border-navy-100
        bg-pitch-50
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <img
        src="/escl-stadium-hero.png"
        alt="ESCL Stadium"
        className="
          h-full
          w-full
          object-cover
          scale-[1.65]
          object-center
          transition-transform duration-500
          group-hover:scale-[1.72]
        "
      />
    </div>

    {/* SCHEDULE IMAGE — Helmet Only */}
    <div
      className="
        group
        aspect-square
        overflow-hidden
        rounded-2xl
        border border-navy-100
        bg-pitch-50
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <img
        src="/schedule-bg.jpg
        "
        alt="ESCL Cricket Helmet"
        className="
          h-full
          w-full
          object-cover
          scale-[1.85]
          object-[95%_80%]
          transition-transform duration-500
          group-hover:scale-[1.85]
        "
      />
    </div>

  </div>
</section>
    </div>
  )
}