
import { useMemo, useState } from 'react'
import { CalendarDays, Clock, MapPin, Search, Trophy } from 'lucide-react'
import scheduleService from '../services/scheduleService'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import usePagination from '../hooks/usePagination'
import SearchBox from '../components/SearchBox'
import Filter from '../components/Filter'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import { formatDate, statusColor } from '../utils/formatters'
import { MATCH_STATUS } from '../utils/constants'

export default function Schedule() {
  const { data, loading, error } = useFetch(
    () => scheduleService.getAll(),
    []
  )

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    const list = data || []

    return list.filter((m) => {
      const matchesSearch =
        !debouncedSearch ||
        m.matchName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.seriesName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.venue?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.city?.toLowerCase().includes(debouncedSearch.toLowerCase())

      const matchesStatus = !status || m.status === status

      return matchesSearch && matchesStatus
    })
  }, [data, debouncedSearch, status])

  const { page, totalPages, pageItems, goTo } = usePagination(
    filtered,
    6
  )

  return (
    <div className="bg-slate-50">

      {/* ================= HERO ================= */}
      <section
        className="relative overflow-hidden bg-navy-900 bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: "url('escl-stadium-hero.png')",
        }}
      >
        

        {/* Dark image overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06172c]/95 via-[#081d36]/50 to-[#08172d]/60" />

        {/* Soft bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06172c]/50 to-transparent" />

        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.035]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Orange Glow */}
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            <CalendarDays size={15} />
            Fixtures
          </div>

          {/* Title */}
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Match{' '}
            <span className="text-orange-500">
              Schedule
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            Follow every ESCL fixture, from upcoming clashes to completed
            matches. Find venues, timings and match status in one place.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
              <div className="stat-num text-3xl font-bold text-orange-400">
                {data?.length || 0}
              </div>

              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/50">
                Total Fixtures
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
              <div className="stat-num text-3xl font-bold text-white">
                {filtered.length}
              </div>

              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/50">
                Showing
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Search / Filter */}
        <div className="mb-10 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Search Info */}
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Search size={22} />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-navy-900">
                  Find a Match
                </h2>

                <p className="text-sm text-navy-700/60">
                  Search by match, series, venue or city
                </p>
              </div>

            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder="Search match, venue or city..."
              />

              <Filter
                label=""
                value={status}
                onChange={setStatus}
                options={MATCH_STATUS}
              />

            </div>

          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

          <div>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Fixtures
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              All Matches
            </h2>
          </div>

          <div className="hidden items-center gap-2 text-sm text-navy-700/60 sm:flex">
            <Trophy size={17} className="text-orange-500" />
            ESCL Tournament
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <Loader label="Loading schedule..." />
        )}

        {/* Error */}
        {!loading && error && (
          <EmptyState
            title="Couldn't load schedule"
            description={error}
          />
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filtered.length === 0 && (
            <EmptyState
              icon={CalendarDays}
              title="No matches found"
              description="Try adjusting your search or filters."
            />
          )}

        {/* Match Cards */}
        {!loading &&
          !error &&
          filtered.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {pageItems.map((m) => (
                  <Card
                    key={m.id}
                    hover
                    className="overflow-hidden"
                  >

                    {/* Card Header */}
                    <div className="-mx-6 -mt-6 mb-5 bg-navy-900 px-6 py-5 text-white">

                      <div className="flex items-start justify-between gap-3">

                        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                          <Trophy
                            size={14}
                            className="text-orange-500"
                          />
                          {m.seriesName}
                        </span>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                            m.status
                          )}`}
                        >
                          {m.status}
                        </span>

                      </div>

                      <h3 className="mt-4 font-display text-xl font-bold">
                        {m.matchName}
                      </h3>

                    </div>

                    {/* Match Date */}
                    <div className="mb-5 flex items-center gap-4 rounded-xl bg-orange-50 p-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
                        <CalendarDays size={20} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-500">
                          Match Date
                        </p>

                        <p className="mt-1 font-display font-semibold text-navy-900">
                          {formatDate(m.matchDate)}
                        </p>
                      </div>

                    </div>

                    {/* Match Details */}
                    <div className="space-y-4 text-sm">

                      <div className="flex items-start gap-3">

                        <MapPin
                          size={18}
                          className="mt-0.5 shrink-0 text-navy-700/40"
                        />

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-700/40">
                            Venue
                          </p>

                          <p className="mt-1 font-medium text-navy-900">
                            {m.venue}
                          </p>

                          <p className="text-sm text-navy-700/60">
                            {m.city}
                          </p>
                        </div>

                      </div>

                      <div className="flex items-start gap-3">

                        <Clock
                          size={18}
                          className="mt-0.5 shrink-0 text-navy-700/40"
                        />

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-700/40">
                            Match Time
                          </p>

                          <p className="mt-1 font-medium text-navy-900">
                            {m.matchTime}
                          </p>

                          <p className="text-sm text-navy-700/60">
                            {m.gmtTime} GMT
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-4">

                      <span className="text-xs font-semibold uppercase tracking-wide text-navy-700/40">
                        ESCL Fixture
                      </span>

                      <span className="text-sm font-semibold text-orange-500">
                        Match Details →
                      </span>

                    </div>

                  </Card>
                ))}

              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={goTo}
              />
            </>
          )}

      </section>
    </div>
  )
}
