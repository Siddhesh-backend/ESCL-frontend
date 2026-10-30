
import { useMemo, useState } from 'react'
import {
  Trophy,
  ArrowUpDown,
  Medal,
  ChevronDown,
  Sparkles,
} from 'lucide-react'

import pointsTableService from '../services/pointsTableService'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import SearchBox from '../components/SearchBox'

const HERO_IMAGE = "url('/escl-stadium-hero.png')"
const SECTION_IMAGE = "url('/escl-stadium-hero%20(1)%20copy.png')"

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

// Read tournament information from common API response shapes.
function getTournamentName(row) {
  return (
    row.tournamentName ||
    row.tournament?.name ||
    row.seriesName ||
    row.series?.seriesName ||
    ''
  )
}

function getTournamentId(row) {
  return (
    row.tournamentId ??
    row.tournament?.id ??
    row.seriesId ??
    row.series?.id ??
    getTournamentName(row)
  )
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px w-8 bg-orange-500" />
        <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-display text-3xl font-extrabold tracking-wide text-[#F3F0E8] sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}

function StatCard({ value, label, icon: Icon }) {
  return (
    <div className="escl-card flex min-w-[135px] items-center gap-4 rounded-2xl border border-white/10 bg-[#101D2D]/80 px-5 py-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-500/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
        <Icon size={19} />
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
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#071426]/70 via-[#081525]/80 to-[#050B14]/95"
      />

      <div
        aria-hidden="true"
        className="absolute -left-32 top-24 -z-10 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </div>
    </section>
  )
}

export default function PointsTable() {
  const { data, loading, error } = useFetch(
    () => pointsTableService.getAll(),
    []
  )

  const [search, setSearch] = useState('')
  const [selectedTournament, setSelectedTournament] = useState('all')
  const [sortKey, setSortKey] = useState('position')
  const [sortDir, setSortDir] = useState('asc')

  const debouncedSearch = useDebounce(search)

  const tournaments = useMemo(() => {
    const unique = new Map()

      ; (data || []).forEach((row) => {
        const name = getTournamentName(row)
        const id = getTournamentId(row)

        if (name && id !== undefined && id !== null) {
          unique.set(String(id), {
            id: String(id),
            name,
          })
        }
      })

    return Array.from(unique.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [data])

  const tournamentRows = useMemo(() => {
    const list = data || []

    if (selectedTournament === 'all') {
      return list
    }

    return list.filter(
      (row) => String(getTournamentId(row)) === selectedTournament
    )
  }, [data, selectedTournament])

  const rows = useMemo(() => {
    let list = tournamentRows.filter((row) =>
      !debouncedSearch
        ? true
        : row.teamName
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase())
    )

    list = [...list].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]

      if (
        va !== null &&
        vb !== null &&
        va !== '' &&
        vb !== '' &&
        Number.isFinite(Number(va)) &&
        Number.isFinite(Number(vb))
      ) {
        return sortDir === 'asc'
          ? Number(va) - Number(vb)
          : Number(vb) - Number(va)
      }

      const first = String(va ?? '')
      const second = String(vb ?? '')

      return sortDir === 'asc'
        ? first.localeCompare(second)
        : second.localeCompare(first)
    })

    return list
  }, [tournamentRows, debouncedSearch, sortKey, sortDir])

  const activeTournament = tournaments.find(
    (tournament) => tournament.id === selectedTournament
  )

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((direction) =>
        direction === 'asc' ? 'desc' : 'asc'
      )
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

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

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="escl-rise inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-[#111D2B]/80 px-4 py-2 backdrop-blur-md">
              <Sparkles size={15} className="text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200 sm:text-xs">
                Tournament Standings
              </span>
            </div>


            <h1 className="escl-rise mt-7 font-display text-[2.8rem] font-black leading-[0.98] tracking-tight min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
              <span className="escl-animated-heading">POINTS</span>

              <span className="mt-2 block pb-2">
                <span className="escl-animated-heading">TABLE</span>
                <span className="text-[#F5F1E8]"></span>
              </span>
            </h1>


            <p className="escl-rise mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
              Explore tournament standings, compare team performances,
              and follow every team's journey on the road to the title.
            </p>

            <div className="escl-rise mt-8 flex flex-wrap gap-3 sm:gap-4">
              <StatCard
                value={loading ? '...' : rows.length}
                label="Teams Listed"
                icon={Trophy}
              />

              <StatCard
                value={loading ? '...' : tournaments.length}
                label="Tournaments"
                icon={Medal}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TOURNAMENT SELECTOR + POINTS TABLE */}
      <StadiumSection>
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Tournament Rankings"
            title="League Points Table"
            description="Select a tournament to view its standings and compare participating teams."
          />

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto lg:min-w-[500px]">
            {/* TOURNAMENT DROPDOWN */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tournamentSelect"
                className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400"
              >
                Select Tournament
              </label>

              <div className="relative">
                <Trophy
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
                />

                <select
                  id="tournamentSelect"
                  value={selectedTournament}
                  onChange={(event) => {
                    setSelectedTournament(event.target.value)
                    setSortKey('position')
                    setSortDir('asc')
                  }}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#101F31] py-3 pl-11 pr-10 text-sm font-semibold text-[#F3F0E8] outline-none transition hover:border-orange-400/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15"
                >
                  <option value="all" className="bg-[#101F31] text-[#F3F0E8]">
                    All Tournaments
                  </option>

                  {tournaments.map((tournament) => (
                    <option
                      key={tournament.id}
                      value={tournament.id}
                      className="bg-[#101F31] text-[#F3F0E8]"
                    >
                      {tournament.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* TEAM SEARCH */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Search Team
              </label>

              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder="Search team..."
              />
            </div>
          </div>
        </div>

        {/* SELECTED TOURNAMENT */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0C1929]/80 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
              <Medal size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Currently Viewing
              </p>

              <h3 className="mt-1 font-display text-lg font-bold text-[#F3F0E8]">
                {activeTournament?.name ||
                  (selectedTournament === 'all'
                    ? 'All Tournaments'
                    : 'Selected Tournament')}
              </h3>
            </div>
          </div>

          <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300">
            {rows.length} {rows.length === 1 ? 'Team' : 'Teams'}
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#0C1929]/80 px-4 py-10">
            <Loader label="Loading points table..." />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-[#111B29]/90 p-5">
            <EmptyState
              title="Couldn't load points table"
              description={error}
            />
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && rows.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#0C1929]/80 px-4 py-10">
            <EmptyState
              icon={Trophy}
              title="No standings found"
              description={
                search
                  ? 'No teams match your search. Try another team name.'
                  : selectedTournament !== 'all'
                    ? 'No points table records are available for this tournament.'
                    : 'Tournament standings will appear here when data is available.'
              }
            />
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && rows.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0C1929]/95 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
                  <Trophy size={19} />
                </div>

                <div>
                  <h3 className="font-display font-bold text-[#F3F0E8]">
                    Points Standings
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Select a column heading to sort
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-white/10 bg-[#101F31] px-3 py-1.5 text-xs font-semibold text-slate-300">
                {rows.length} {rows.length === 1 ? 'Team' : 'Teams'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-[#101F31] text-slate-300">
                  <tr>
                    {COLUMNS.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="whitespace-nowrap border-b border-white/10 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          aria-label={`Sort by ${column.label}`}
                          className="flex items-center gap-1.5 rounded transition-colors hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                        >
                          {column.label}

                          <ArrowUpDown
                            size={12}
                            className={
                              sortKey === column.key
                                ? 'text-orange-400'
                                : 'text-slate-500'
                            }
                          />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.07]">
                  {rows.map((row, index) => {
                    const isTopFour = index < 4
                    const isFirst = index === 0

                    return (
                      <tr
                        key={row.id ?? `${row.teamName}-${index}`}
                        className={`transition-colors ${isTopFour
                          ? 'bg-orange-500/[0.045] hover:bg-orange-500/[0.09]'
                          : 'hover:bg-white/[0.035]'
                          }`}
                      >
                        <td className="whitespace-nowrap px-4 py-4">
                          {isFirst ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-mono text-sm font-bold text-[#07111F]">
                              {row.position ?? index + 1}
                            </div>
                          ) : (
                            <span className="pl-2 font-mono font-semibold text-slate-300">
                              {row.position ?? index + 1}
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#17263A] font-display text-sm font-extrabold text-orange-300">
                              {row.teamName?.charAt(0)?.toUpperCase() || '?'}
                            </div>

                            <span className="font-semibold text-[#F3F0E8]">
                              {row.teamName}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-mono text-slate-300">
                          {row.matchesPlayed}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-mono font-semibold text-emerald-400">
                          {row.won}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-mono text-slate-300">
                          {row.lost}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-mono text-slate-300">
                          {row.tie}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-mono text-slate-300">
                          {row.noResult}
                        </td>

                        <td
                          className={`whitespace-nowrap px-4 py-4 font-mono font-semibold ${Number(row.netRunRate) > 0
                            ? 'text-emerald-400'
                            : Number(row.netRunRate) < 0
                              ? 'text-rose-400'
                              : 'text-slate-300'
                            }`}
                        >
                          {row.netRunRate}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="inline-flex min-w-10 items-center justify-center rounded-lg border border-orange-400/20 bg-orange-500/10 px-3 py-1.5 font-mono font-bold text-orange-300">
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

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Standings are displayed using the tournament and team data returned by the backend.
        </p>
      </StadiumSection>
    </main>
  )
}
