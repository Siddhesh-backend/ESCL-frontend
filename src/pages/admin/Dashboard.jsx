
import { useEffect, useState } from 'react'
import {
  Users,
  CalendarDays,
  Trophy,
  Mail,
  TrendingUp,
  ArrowUpRight,
  Activity,
  BarChart3,
  ShieldCheck,
  RefreshCw,
  Clock3,
} from 'lucide-react'

import playerService from '../../services/playerService'
import scheduleService from '../../services/scheduleService'
import upcomingSeriesService from '../../services/upcomingSeriesService'
import contactService from '../../services/contactService'
import Card from '../../components/Card'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'

const STAT_CONFIG = [
  {
    key: 'players',
    label: 'Registered Players',
    description: 'Total player profiles',
    icon: Users,
    accent: 'text-orange-400',
    iconBg: 'bg-orange-500/10',
    iconBorder: 'border-orange-400/15',
  },
  {
    key: 'matches',
    label: 'Scheduled Matches',
    description: 'Matches in the schedule',
    icon: CalendarDays,
    accent: 'text-sky-400',
    iconBg: 'bg-sky-400/10',
    iconBorder: 'border-sky-400/15',
  },
  {
    key: 'series',
    label: 'Upcoming Series',
    description: 'Published series',
    icon: Trophy,
    accent: 'text-amber-300',
    iconBg: 'bg-amber-400/10',
    iconBorder: 'border-amber-400/15',
  },
  {
    key: 'messages',
    label: 'Contact Messages',
    description: 'Messages received',
    icon: Mail,
    accent: 'text-violet-300',
    iconBg: 'bg-violet-400/10',
    iconBorder: 'border-violet-400/15',
  },
]

function getCurrentDate() {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

function DashboardStat({ item, value }) {
  const Icon = item.icon

  return (
    <Card>
      <div className="group relative h-full overflow-hidden">
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025] blur-2xl transition group-hover:bg-orange-400/[0.08]" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-400">
              {item.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {item.description}
            </p>
          </div>

          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${item.iconBg} ${item.iconBorder} ${item.accent}`}
          >
            <Icon size={20} />
          </span>
        </div>

        <div className="relative mt-6 flex items-end justify-between gap-3">
          <p className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            {value.toLocaleString('en-IN')}
          </p>

          <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <Activity size={13} />
            Total
          </span>
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full w-1/3 rounded-full ${item.key === 'players' ? 'bg-orange-400' : item.key === 'matches' ? 'bg-sky-400' : item.key === 'series' ? 'bg-amber-300' : 'bg-violet-300'}`}
          />
        </div>
      </div>
    </Card>
  )
}

function AnalyticsPlaceholder({ icon: Icon, title, description }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-orange-400">
          <Icon size={19} />
        </span>
      </div>

      <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#071629]/60 px-5 py-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/15 bg-orange-500/[0.07] text-orange-400">
          <BarChart3 size={22} />
        </span>

        <p className="mt-4 text-sm font-semibold text-slate-300">
          Analytics not connected yet
        </p>

        <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
          Connect historical data to display accurate trends and visual reports here.
        </p>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setLoadError(false)

      const results = await Promise.allSettled([
        playerService.getAll(),
        scheduleService.getAll(),
        upcomingSeriesService.getAll(),
        contactService.getAll(),
      ])

      if (!active) return

      const [players, matches, series, messages] = results

      setStats({
        players: players.status === 'fulfilled'
          ? players.value?.length ?? 0
          : null,
        matches: matches.status === 'fulfilled'
          ? matches.value?.length ?? 0
          : null,
        series: series.status === 'fulfilled'
          ? series.value?.length ?? 0
          : null,
        messages: messages.status === 'fulfilled'
          ? messages.value?.length ?? 0
          : null,
      })

      setLoadError(results.some((result) => result.status === 'rejected'))
      setLoading(false)
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [refreshKey])

  const firstName = user?.email?.split('@')[0]
  const dateLabel = getCurrentDate()

  return (
    <main className="relative min-h-full overflow-hidden bg-[#061326] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      {/* Subtle dashboard background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-orange-500/[0.06] blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[28rem] h-80 w-80 rounded-full bg-blue-500/[0.05] blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1600px]">
        {/* Page header */}
        <header className="mb-8 flex flex-col gap-5 border-b border-white/[0.08] pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.55)]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-400">
                ESCL Administration
              </p>
            </div>

            <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              Welcome back
              {firstName ? (
                <>
                  <span className="text-orange-400">, {firstName}</span>
                </>
              ) : null}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Monitor your league activity, registrations and upcoming cricket events from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Clock3 size={16} className="text-orange-400" />
              <span className="text-xs font-medium text-slate-300">
                {dateLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-400/25 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:border-orange-400/50 hover:bg-orange-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* Summary section */}
        <section aria-labelledby="overview-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="overview-heading"
                className="font-display text-xl font-bold text-white"
              >
                League Overview
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Summary based on available ESCL records
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Admin overview
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#0b1b30]/80 p-10">
              <Loader label="Loading dashboard..." />
            </div>
          ) : (
            <>
              {loadError && (
                <div
                  role="status"
                  className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-sm leading-6 text-amber-200"
                >
                  Some data could not be loaded. Failed sections are shown as unavailable; try Refresh to retry.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STAT_CONFIG.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-white/[0.09] bg-[#0b1b30]/85 p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-orange-400/25 hover:bg-[#0d2037]"
                  >
                    <DashboardStat
                      item={item}
                      value={stats?.[item.key] ?? 0}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Analytics */}
        {!loading && (
          <section className="mt-9" aria-labelledby="analytics-heading">
            <div className="mb-4">
              <h2
                id="analytics-heading"
                className="font-display text-xl font-bold text-white"
              >
                Analytics & Insights
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Visual reporting will be available when historical analytics data is connected.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <AnalyticsPlaceholder
                icon={TrendingUp}
                title="Registrations Over Time"
                description="Track player registration trends across the season."
              />

              <AnalyticsPlaceholder
                icon={Trophy}
                title="Points Table Movement"
                description="Follow team standings and performance over time."
              />
            </div>
          </section>
        )}

        {/* Footer status */}
        <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-orange-400" />
            <span>ESCL Admin Dashboard</span>
          </div>

          <p className="text-xs text-slate-500">
            Statistics reflect the records currently returned by the services.
          </p>
        </footer>
      </div>
    </main>
  )
}
