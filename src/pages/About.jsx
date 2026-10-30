import { Target, Eye, Users, PlayCircle } from 'lucide-react'
import Card from '../components/Card'

const ORGANIZERS = [
  { name: 'League Office', role: 'Tournament Operations' },
  { name: 'Campus Sports Council', role: 'Governance & Compliance' },
  { name: 'ESCL Media Desk', role: 'Broadcast & Press' },
]

const VIDEOS = [
  {
    id: 'trrHDQuLBuA',
    title: 'Legends League Cricket Match Highlights',
  },
  {
    id: 'X56V0LhoDw4',
    title: 'Legends League Cricket Match Highlights',
  },
  {
    id: 'Tj9xPsdcxJM',
    title: 'ICC Cricket World Cup Celebration',
  },
  {
    id: 'ShGUTA2WZOM',
    title: 'Entertainers Cricket League Promo',
  },
]

export default function About() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#061326] text-white">
      {/* ABOUT HERO */}
      <section
        className="relative overflow-hidden bg-[#071a31] py-20 text-center text-white sm:py-24"
        style={{
          backgroundImage: "url('/escl-stadium-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#061326]/95 via-[#081d36]/80 to-[#08172d]/70" />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061326] to-transparent" />

        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-orange-500/15 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl px-4">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            About Us
          </span>

          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            About ESCL
          </h1>

          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            The Engineering Sports Championship League is a season-long
            cricket tournament that brings engineering campuses together
            under one professionally run competition.
          </p>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card hover>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
              <Target size={22} />
            </div>

            <h2 className="font-display text-xl font-semibold text-white">
              Our Mission
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              To give every engineering campus access to a structured,
              fairly officiated cricket league that rewards consistent
              performance across a full season.
            </p>
          </Card>

          <Card hover>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
              <Eye size={22} />
            </div>

            <h2 className="font-display text-xl font-semibold text-white">
              Our Vision
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              To become the benchmark inter-college cricket league,
              known for transparent standings, reliable scheduling and
              a genuinely competitive points race.
            </p>
          </Card>
        </div>
      </section>

      {/* ORGANIZERS */}
      <section className="border-y border-[#243B53] bg-[#0B1B30] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                <Users size={21} />
              </div>

              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Organizers
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              The teams and groups supporting ESCL operations.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ORGANIZERS.map((organizer) => (
              <Card key={organizer.name} hover>
                <div className="mb-4 h-1 w-12 rounded-full bg-orange-500" />

                <h3 className="font-display text-lg font-semibold text-white">
                  {organizer.name}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {organizer.role}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CRICKET VIDEOS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
              <PlayCircle size={21} />
            </div>

            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              ESCL Cricket Videos
            </h2>
          </div>

          <p className="text-sm text-slate-400">
            Explore cricket highlights, celebrations and tournament videos.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((video) => (
            <div
              key={video.id}
              className="group overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-950/20"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#061326]">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  <PlayCircle size={14} />
                  Cricket Video
                </div>

                <h3 className="text-sm font-semibold leading-6 text-slate-200">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}