
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  CalendarDays,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react'

import upcomingSeriesService from '../services/upcomingSeriesService'
import useFetch from '../hooks/useFetch'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { formatDate } from '../utils/formatters'

const HERO_IMAGE = "url('/escl-stadium-hero.png')"
const SECTION_IMAGE = "url('/escl-stadium-hero%20(1)%20copy.png')"

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px w-8 bg-orange-500" />
        <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-display text-3xl font-extrabold tracking-wide text-[#F3F0E8] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
        {description}
      </p>
    </div>
  )
}

function StadiumSection({ children }) {
  return (
    <section className="escl-stadium-section relative isolate overflow-hidden bg-[#07111F]">
      <div
        aria-hidden="true"
        className="escl-section-background absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: SECTION_IMAGE }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#06101F]/85"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#071426]/65 via-[#081525]/75 to-[#050B14]/95"
      />

      <div
        aria-hidden="true"
        className="absolute -left-32 top-24 -z-10 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </div>
    </section>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="escl-card group flex min-w-[145px] items-center gap-4 rounded-2xl border border-white/10 bg-[#101D2D]/80 px-5 py-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-500/40">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400 transition duration-300 group-hover:bg-orange-500 group-hover:text-[#07111F]">
        <Icon size={20} />
      </div>

      <div>
        <p className="font-display text-2xl font-extrabold text-[#F5F1E8]">
          {value}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          {label}
        </p>
      </div>
    </div>
  )
}

function SeriesCard({ series, index, onDetails }) {
  return (
    <article
      className="escl-card escl-rise group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0C1929]/90 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-orange-950/20 sm:p-6"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/80 to-transparent"
      />

      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-orange-500/5 blur-3xl transition duration-500 group-hover:bg-orange-500/15"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
            <Trophy size={18} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Official Tournament
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-200">
              ESCL Championship
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-orange-300">
          SERIES {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative mt-7">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          The Next Chapter
        </p>

        <h3 className="font-display text-2xl font-extrabold leading-tight text-[#F3F0E8] transition-colors group-hover:text-orange-300">
          {series.seriesName}
        </h3>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-orange-500/40 via-white/10 to-transparent" />
      </div>

      <div className="relative mt-5 flex items-center gap-4 rounded-xl border border-orange-400/15 bg-[#111F30] p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-[#07111F] shadow-lg shadow-orange-950/20">
          <CalendarDays size={20} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-400">
            Series Date
          </p>

          <p className="mt-1 break-words font-display text-lg font-bold text-[#F3F0E8]">
            {formatDate(series.seriesDate)}
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex flex-1 items-start gap-3">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-orange-400"
        />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Tournament
          </p>

          <p className="mt-1 text-sm font-semibold leading-6 text-slate-200">
            Engineering Sports Championship League
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Official ESCL Series
          </p>
        </div>
      </div>

      <div className="relative mt-6 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => onDetails(series)}
          className="group/button flex w-full items-center justify-between gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-300 transition duration-200 hover:border-orange-400 hover:bg-orange-500 hover:text-[#07111F]"
        >
          <span>Explore Series Details</span>
          <ArrowRight
            size={17}
            className="transition-transform duration-200 group-hover/button:translate-x-1"
          />
        </button>
      </div>
    </article>
  )
}

function SeriesDetailsModal({ series, onClose }) {
  if (!series) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020711]/85 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="series-modal-title"
        className="relative my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B1727] text-[#F3F0E8] shadow-2xl shadow-black/50"
      >
        <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-orange-400 to-transparent" />

        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
              ESCL · Series Details
            </p>

            <h2
              id="series-modal-title"
              className="font-display text-xl font-extrabold leading-snug text-[#F3F0E8] sm:text-2xl"
            >
              {series.seriesName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close series details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          <div className="flex items-center gap-4 rounded-xl border border-orange-400/20 bg-[#111F30] p-4 sm:p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-[#07111F]">
              <CalendarDays size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">
                Series Date
              </p>

              <p className="mt-1 font-display text-lg font-bold text-[#F3F0E8]">
                {formatDate(series.seriesDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <Trophy
              size={20}
              className="mt-0.5 shrink-0 text-orange-400"
            />

            <div>
              <p className="font-semibold leading-6 text-[#F3F0E8]">
                Engineering Sports Championship League
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Official ESCL Series
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-[#07111F] transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0B1727]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UpcomingSeries() {
  const { data, loading, error } = useFetch(
    () => upcomingSeriesService.getAll(),
    []
  )

  const [selected, setSelected] = useState(null)
  const seriesList = Array.isArray(data) ? data : []

  return (
    <main className="min-h-screen bg-[#07111F] text-[#F3F0E8]">
      {/* HERO */}
      <section className="escl-hero-background relative isolate overflow-hidden bg-[#06101F]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center"
          style={{ backgroundImage: HERO_IMAGE }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-r from-[#050D19]/95 via-[#071426]/80 to-[#071426]/55"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-t from-[#07111F] via-transparent to-[#07111F]/30"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div
          aria-hidden="true"
          className="escl-glow absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full bg-orange-500/15 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="max-w-4xl">
            <div className="escl-rise inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-[#111D2B]/80 px-4 py-2 backdrop-blur-md">
              <Sparkles size={15} className="text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200 sm:text-xs">
                The Road to Glory
              </span>
            </div>



            <h1 className="escl-rise mt-7 font-display text-[2.8rem] font-black leading-[0.98] tracking-tight min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
              <span className="escl-animated-heading">UPCOMING</span>

              <span className="mt-2 block pb-2">
                <span className="escl-animated-heading">SERIES</span>
                <span className="text-[#F5F1E8]"></span>
              </span>
            </h1>



            <p className="escl-rise mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
              Every championship has a beginning. Explore the upcoming ESCL
              series, discover key dates, and get ready for the next chapter
              of cricket action.
            </p>

            <div className="escl-rise mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#upcoming-series-list"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-[#07111F] shadow-lg shadow-orange-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-400"
              >
                Explore Series
                <ArrowRight size={17} />
              </a>

              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-[#F3F0E8] backdrop-blur-md transition duration-200 hover:border-orange-400/50 hover:bg-white/10"
              >
                View Match Schedule
                <ChevronRight size={17} className="text-orange-400" />
              </Link>
            </div>

            <div className="escl-rise mt-10 flex flex-wrap gap-3 sm:gap-4">
              <StatCard
                label="Available Series"
                value={loading ? '...' : seriesList.length}
                icon={Trophy}
              />

              <StatCard
                label="Tournament"
                value="ESCL"
                icon={ShieldCheck}
              />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-10 right-8 hidden select-none font-display text-[180px] font-black leading-none text-white/[0.025] xl:block"
          >
            ESCL
          </div>
        </div>
      </section>

      {/* SERIES CONTENT */}
      <StadiumSection>
        <div id="upcoming-series-list" className="scroll-mt-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="The Road Ahead"
              title="All Upcoming Series"
              description="Stay connected with the next ESCL series and keep track of the important dates."
            />

            <div className="mb-8 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 backdrop-blur-md sm:flex">
              <Trophy size={15} className="text-orange-400" />
              Official ESCL Tournament
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-[#0C1929]/80 px-4 py-10 text-slate-200">
              <Loader label="Loading upcoming series..." />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-400/20 bg-[#111B29]/90 p-5">
              <EmptyState
                title="Couldn't load series"
                description={error}
              />
            </div>
          )}

          {!loading && !error && seriesList.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#0C1929]/80 px-4 py-10">
              <EmptyState
                icon={Trophy}
                title="No upcoming series"
                description="Check back soon for announcements."
              />
            </div>
          )}

          {!loading && !error && seriesList.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                  Showing{' '}
                  <span className="font-bold text-[#F3F0E8]">
                    {seriesList.length}
                  </span>{' '}
                  {seriesList.length === 1 ? 'series' : 'series'}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
                  ESCL Series
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {seriesList.map((series, index) => (
                  <SeriesCard
                    key={series.id ?? `${series.seriesName}-${index}`}
                    series={series}
                    index={index}
                    onDetails={setSelected}
                  />
                ))}
              </div>
            </>
          )}

          {/* BOTTOM CTA */}
          <div className="relative mt-12 overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-r from-[#132235] via-[#101C2B] to-[#151D29] p-6 sm:p-8 lg:mt-16">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[80px]"
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                  Keep the Game Going
                </p>

                <h3 className="mt-2 font-display text-2xl font-extrabold text-[#F3F0E8] sm:text-3xl">
                  Ready for the Next Match?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Check the match schedule and stay up to date with ESCL
                  cricket action.
                </p>
              </div>

              <Link
                to="/schedule"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-[#07111F] transition hover:bg-orange-400"
              >
                View Schedule
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </StadiumSection>

      {/* CUSTOM DARK SERIES MODAL */}
      <SeriesDetailsModal
        series={selected}
        onClose={() => setSelected(null)}
      />
    </main>
  )
}
