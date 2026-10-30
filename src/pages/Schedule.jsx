
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Trophy,
  Radio,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'

import scheduleService from '../services/scheduleService'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import usePagination from '../hooks/usePagination'
import SearchBox from '../components/SearchBox'
import Filter from '../components/Filter'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import { formatDate } from '../utils/formatters'
import { MATCH_STATUS } from '../utils/constants'

const HERO_IMAGE = "url('/escl-stadium-hero.png')"
const SECTION_IMAGE = "url('/escl-stadium-hero%20(1)%20copy.png')"

function StadiumSection({ children, className = '' }) {
  return (
    <section
      className={`escl-stadium-section relative isolate overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="escl-section-background pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: SECTION_IMAGE,
          opacity: 0.30,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#071426]/90 via-[#071426]/95 to-[#071426]/90"
      />

      {children}
    </section>
  )
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-orange-400 sm:text-xs">
        <span className="h-[2px] w-7 bg-orange-500" />
        {eyebrow}
      </p>

      <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
        {title}
        <span className="text-orange-400">.</span>
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300/80 sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-300/10 bg-[#09182b]/75 p-4 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-orange-500/[0.06] sm:min-w-36 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <Icon size={19} className="text-orange-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,.6)]" />
      </div>

      <p className="stat-num mt-3 text-3xl font-bold text-orange-300">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300/65">
        {label}
      </p>
    </div>
  )
}

function MatchCard({ match }) {
  const status = String(match.status || 'Scheduled').toLowerCase()

  const statusTone =
    status.includes('complete') || status.includes('finished')
      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
      : status.includes('live') || status.includes('progress')
        ? 'border-orange-400/30 bg-orange-400/10 text-orange-300'
        : status.includes('cancel')
          ? 'border-rose-400/25 bg-rose-400/10 text-rose-300'
          : 'border-sky-400/20 bg-sky-400/10 text-sky-300'

  return (
    <article className="escl-card group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-300/10 bg-[#0b1b30]/80 shadow-[0_18px_55px_rgba(0,0,0,.25)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-60" />

      {/* Match heading */}
      <div className="relative overflow-hidden border-b border-slate-300/10 bg-gradient-to-br from-[#142c49]/95 via-[#0d2038]/95 to-[#091629]/95 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-orange-500/[0.09] blur-3xl transition duration-500 group-hover:bg-orange-500/20" />

        <div className="relative flex items-start justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-300/75">
            <Trophy size={15} className="shrink-0 text-orange-400" />
            <span className="break-words">{match.seriesName || 'ESCL Fixture'}</span>
          </span>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${statusTone}`}
          >
            {match.status || 'Scheduled'}
          </span>
        </div>

        <h3 className="relative mt-5 break-words font-display text-2xl font-bold leading-tight text-slate-100 sm:text-3xl">
          {match.matchName}
        </h3>

        <div className="mt-5 h-px bg-gradient-to-r from-orange-400/60 via-slate-400/15 to-transparent" />
      </div>

      {/* Match information */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-xl border border-orange-400/15 bg-orange-500/[0.06] p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-300">
            <CalendarDays size={19} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-300/80">
              Match date
            </p>

            <p className="mt-1 break-words text-sm font-bold text-slate-100">
              {formatDate(match.matchDate)}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300/10 bg-slate-300/[0.04] text-orange-300">
              <MapPin size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Venue
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-slate-200">
                {match.venue || 'Venue to be announced'}
              </p>

              {match.city && (
                <p className="mt-1 break-words text-xs text-slate-400">
                  {match.city}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300/10 bg-slate-300/[0.04] text-orange-300">
              <Clock3 size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Match time
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-200">
                {match.matchTime || 'Time to be announced'}
              </p>

              {match.gmtTime && (
                <p className="mt-1 text-xs text-slate-400">
                  {match.gmtTime} GMT
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-300/10 pt-4">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            ESCL fixture
          </span>

          <Link
            to="/schedule"
            className="group/details inline-flex items-center gap-2 text-xs font-extrabold text-orange-300 transition-colors hover:text-amber-200"
          >
            Match Details
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/details:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Schedule() {
  const { data, loading, error } = useFetch(
    () => scheduleService.getAll(),
    [],
  )

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    const list = data || []

    return list.filter((match) => {
      const query = debouncedSearch.toLowerCase()

      const matchesSearch =
        !query ||
        match.matchName?.toLowerCase().includes(query) ||
        match.seriesName?.toLowerCase().includes(query) ||
        match.venue?.toLowerCase().includes(query) ||
        match.city?.toLowerCase().includes(query)

      const matchesStatus = !status || match.status === status

      return matchesSearch && matchesStatus
    })
  }, [data, debouncedSearch, status])

  const { page, totalPages, pageItems, goTo } = usePagination(
    filtered,
    6,
  )

  return (
    <main className="schedule-page min-h-screen overflow-x-clip bg-[#071426] text-slate-200">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#071426] pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20">
        <div
          aria-hidden="true"
          className="escl-hero-background absolute inset-0 -z-30 bg-cover bg-[center_42%]"
          style={{ backgroundImage: HERO_IMAGE }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-r from-[#040b18]/90 via-[#071426]/70 to-[#071426]/45"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-t from-[#071426] via-[#071426]/25 to-[#071426]/25"
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="escl-glow absolute -right-24 top-10 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px] sm:h-96 sm:w-96" />
          <div className="escl-glow absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px] sm:h-96 sm:w-96" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:64px_64px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <div className="escl-rise max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-[#09182b]/85 px-3 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-orange-200 shadow-[0_0_35px_rgba(249,115,22,.1)] backdrop-blur-xl sm:px-4 sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-orange-400" />
              </span>

              <Radio size={14} />
              Engineering Students Cricket League
            </div>

            <h1 className="mt-7 font-display text-[2.8rem] font-black leading-[0.98] tracking-tight min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
              <span className="escl-animated-heading">Match</span>

              <span className="mt-2 block pb-2">
                <span className="escl-animated-heading">Schedule</span>
                <span className="text-slate-100"></span>
              </span>
            </h1>


            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/85 sm:text-lg sm:leading-8">
              Every fixture. Every rivalry. Every chance to make history.
              Explore match dates, venues and timings throughout the ESCL
              championship.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-200/80 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-400" />
                Championship fixtures
              </span>

              <span className="hidden text-slate-500 sm:inline">/</span>

              <span className="inline-flex items-center gap-2">
                <Zap size={16} className="text-orange-400" />
                Follow the action
              </span>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:gap-4">
              <StatCard
                icon={CalendarDays}
                value={data?.length || 0}
                label="Total fixtures"
              />

              <StatCard
                icon={SlidersHorizontal}
                value={filtered.length}
                label="Matching fixtures"
              />
            </div>

            <Link
              to="/upcoming-series"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-orange-300 transition-colors hover:text-amber-200"
            >
              Explore upcoming series
              <ChevronRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent" />
      </section>

      {/* SCHEDULE CONTENT */}
      <StadiumSection className="min-h-[60vh] py-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,.08),transparent_42%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and filter panel */}
          <div className="escl-rise rounded-2xl border border-slate-300/10 bg-[#0b1b30]/80 p-4 shadow-[0_20px_65px_rgba(0,0,0,.25)] backdrop-blur-2xl sm:p-6 lg:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-300">
                  <Search size={22} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-400">
                    Find your fixture
                  </p>

                  <h2 className="mt-1 font-display text-2xl font-bold text-slate-100 sm:text-3xl">
                    Search Matches
                  </h2>

                  <p className="mt-1 text-xs leading-6 text-slate-300/70 sm:text-sm">
                    Search by match, series, venue or city.
                  </p>
                </div>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:w-[54%]">
                <div className="min-w-0 [&_input]:!w-full [&_input]:!min-w-0 [&_input]:!rounded-xl [&_input]:!border [&_input]:!border-slate-400/20 [&_input]:!bg-[#071426] [&_input]:!text-slate-200 [&_input]:placeholder:!text-slate-400 [&_input]:focus:!border-orange-400/60 [&_input]:focus:!ring-2 [&_input]:focus:!ring-orange-400/10">
                  <SearchBox
                    value={search}
                    onChange={setSearch}
                    placeholder="Search match, venue or city..."
                  />
                </div>

                <div className="min-w-0 [&_select]:!w-full [&_select]:!min-w-0 [&_select]:!rounded-xl [&_select]:!border [&_select]:!border-slate-400/20 [&_select]:!bg-[#071426] [&_select]:!text-slate-200 [&_select]:!color-scheme-dark">
                  <Filter
                    label=""
                    value={status}
                    onChange={setStatus}
                    options={MATCH_STATUS}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-300/10 pt-4">
              <p className="text-xs text-slate-300/65">
                {loading
                  ? 'Retrieving fixtures...'
                  : `${filtered.length} fixture${filtered.length === 1 ? '' : 's'} found`}
              </p>

              {(search || status) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setStatus('')
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-orange-400/20 bg-orange-500/[0.07] px-3 py-2 text-xs font-bold text-orange-300 transition hover:border-orange-400/50 hover:bg-orange-500/15"
                >
                  Clear filters
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Match list heading */}
          <div className="mb-7 mt-12 flex flex-wrap items-end justify-between gap-4 sm:mt-16">
            <SectionHeading
              eyebrow="The road to glory"
              title="All Matches"
              description="Explore the fixtures and get ready for every moment of the championship."
            />

            <div className="hidden items-center gap-2 pb-1 text-xs font-bold text-slate-300/70 sm:flex">
              <Trophy size={17} className="text-orange-400" />
              ESCL Championship
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="rounded-2xl border border-slate-300/10 bg-[#0b1b30]/65 px-4 py-12 backdrop-blur-xl">
              <Loader label="Loading schedule..." />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="rounded-2xl border border-rose-400/20 bg-[#0b1b30]/80 p-5 sm:p-7">
              <EmptyState
                title="Couldn't load schedule"
                description={error}
              />
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div className="rounded-2xl border border-slate-300/10 bg-[#0b1b30]/70 p-5 backdrop-blur-xl sm:p-8">
              <EmptyState
                icon={CalendarDays}
                title="No matches found"
                description="Try adjusting your search or filters."
              />
            </div>
          )}

          {/* Match cards */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="schedule-matches-grid">
                {pageItems.map((match, index) => (
                  <div
                    key={match.id}
                    className="escl-rise min-w-0"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <MatchCard match={match} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-9 rounded-2xl border border-slate-300/10 bg-[#0b1b30]/75 p-3 backdrop-blur-xl sm:p-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={goTo}
                  />
                </div>
              )}
            </>
          )}

          {/* Bottom call to action */}
          {!loading && !error && filtered.length > 0 && (
            <div className="mt-12 overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-r from-[#0d2038]/95 via-[#102541]/90 to-[#0b1b30]/95 p-5 shadow-xl sm:mt-16 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-400">
                    Stay in the game
                  </p>

                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-100 sm:text-3xl">
                    The next big moment awaits.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300/75">
                    Discover the upcoming series and follow the ESCL journey.
                  </p>
                </div>

                <Link
                  to="/upcoming-series"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-5 py-3 text-sm font-extrabold text-orange-200 transition duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-orange-500/20"
                >
                  Upcoming Series
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      </StadiumSection>
    </main>
  )
}
