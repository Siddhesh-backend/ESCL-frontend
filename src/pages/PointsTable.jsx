
import { useMemo, useState } from 'react'
import { Trophy, ArrowUpDown, Medal, Search } from 'lucide-react'
import pointsTableService from '../services/pointsTableService'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import SearchBox from '../components/SearchBox'

const COLUMNS = [
  { key: 'position', label: 'Pos' },
  { key: 'teamName', label: 'Team' },
  { key: 'matchesPlayed', label: 'P' },
  { key: 'won', label: 'W' },
  { key: 'lost', label: 'L' },
  { key: 'tie', label: 'T' },
  { key: 'noResult', label: 'NR' },
  { key: 'netRunRate', label: 'NRR' },
  { key: 'points', label: 'Pts' },
]

export default function PointsTable() {
  const { data, loading, error } = useFetch(
    () => pointsTableService.getAll(),
    []
  )

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [sortKey, setSortKey] = useState('position')
  const [sortDir, setSortDir] = useState('asc')

  const rows = useMemo(() => {
    let list = (data || []).filter((r) =>
      !debouncedSearch
        ? true
        : r.teamName
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase())
    )

    list = [...list].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]

      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va
      }

      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va))
    })

    return list
  }, [data, debouncedSearch, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="bg-slate-50">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
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
        <div className="absolute inset-0 opacity-[0.06]">
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
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            <Trophy size={15} />
            Tournament Standings
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Points{' '}
            <span className="text-orange-500">
              Table
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            Track every team's journey through the ESCL season — wins,
            losses, points and net run rate, all in one place.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-4">

            {/* Teams */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">

              <div className="stat-num text-3xl font-bold text-orange-400">
                {data?.length || 0}
              </div>

              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/50">
                Teams
              </div>

            </div>

            {/* Season */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">

              <div className="stat-num text-3xl font-bold text-white">
                ESCL
              </div>

              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/50">
                Current Season
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

          <div>

            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Standings
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              League Rankings
            </h2>

          </div>

          {/* Search */}
          <div className="w-full sm:w-auto">

            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Search team..."
            />

          </div>

        </div>


        {/* =========================================================
            LOADING
        ========================================================= */}
        {loading && (
          <Loader label="Loading points table..." />
        )}


        {/* =========================================================
            ERROR
        ========================================================= */}
        {!loading && error && (
          <EmptyState
            title="Couldn't load points table"
            description={error}
          />
        )}


        {/* =========================================================
            EMPTY
        ========================================================= */}
        {!loading &&
          !error &&
          rows.length === 0 && (
            <EmptyState
              icon={Trophy}
              title="No standings yet"
              description="Points table updates after matches begin."
            />
          )}


        {/* =========================================================
            TABLE
        ========================================================= */}
        {!loading &&
          !error &&
          rows.length > 0 && (

            <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">

              {/* Table Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 bg-white px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                    <Medal size={20} />
                  </div>

                  <div>

                    <h3 className="font-display font-semibold text-navy-900">
                      Current Standings
                    </h3>

                    <p className="text-xs text-navy-700/50">
                      Click any column to sort
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  {rows.length} Teams
                </span>

              </div>


              {/* Responsive Table */}
              <div className="overflow-x-auto">

                <table className="min-w-[800px] w-full text-sm">

                  {/* Header */}
                  <thead className="bg-navy-900 text-white">

                    <tr>

                      {COLUMNS.map((col) => (

                        <th
                          key={col.key}
                          className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                        >

                          <button
                            onClick={() => toggleSort(col.key)}
                            className="focus-ring flex items-center gap-1.5 rounded transition-colors hover:text-orange-300"
                          >

                            {col.label}

                            <ArrowUpDown
                              size={12}
                              className={
                                sortKey === col.key
                                  ? 'text-orange-400'
                                  : 'opacity-40'
                              }
                            />

                          </button>

                        </th>

                      ))}

                    </tr>

                  </thead>


                  {/* Body */}
                  <tbody className="divide-y divide-navy-100">

                    {rows.map((row, idx) => {

                      const isTopFour = idx < 4
                      const isFirst = idx === 0

                      return (

                        <tr
                          key={row.id}
                          className={`transition-colors ${
                            isTopFour
                              ? 'bg-orange-50/60 hover:bg-orange-50'
                              : 'bg-white hover:bg-slate-50'
                          }`}
                        >

                          {/* Position */}
                          <td className="px-4 py-4">

                            <div className="flex items-center gap-2">

                              {isFirst ? (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-sm">
                                  1
                                </div>
                              ) : (
                                <span className="stat-num pl-2 font-semibold text-navy-700">
                                  {row.position}
                                </span>
                              )}

                            </div>

                          </td>


                          {/* Team */}
                          <td className="px-4 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-xs font-bold text-white">
                                {row.teamName?.charAt(0)?.toUpperCase()}
                              </div>

                              <span className="font-semibold text-navy-900">
                                {row.teamName}
                              </span>

                            </div>

                          </td>


                          {/* Played */}
                          <td className="stat-num px-4 py-4">
                            {row.matchesPlayed}
                          </td>


                          {/* Won */}
                          <td className="stat-num px-4 py-4 font-semibold text-green-600">
                            {row.won}
                          </td>


                          {/* Lost */}
                          <td className="stat-num px-4 py-4">
                            {row.lost}
                          </td>


                          {/* Tie */}
                          <td className="stat-num px-4 py-4">
                            {row.tie}
                          </td>


                          {/* No Result */}
                          <td className="stat-num px-4 py-4">
                            {row.noResult}
                          </td>


                          {/* NRR */}
                          <td
                            className={`stat-num px-4 py-4 font-medium ${
                              Number(row.netRunRate) > 0
                                ? 'text-green-600'
                                : Number(row.netRunRate) < 0
                                ? 'text-red-500'
                                : 'text-navy-700'
                            }`}
                          >
                            {row.netRunRate}
                          </td>


                          {/* Points */}
                          <td className="px-4 py-4">

                            <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-orange-100 px-3 py-1.5 font-bold text-orange-600">
                              {row.points}
                            </span>

                          </td>

                        </tr>

                      )

                    })}

                  </tbody>

                </table>

              </div>

            </div>

          )}


        {/* Backend Note */}
        <p className="mt-4 text-xs text-navy-700/50">
          Season shown reflects the current default season from the backend.
        </p>

      </section>

    </div>
  )
}

