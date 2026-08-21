import { Users, CalendarDays, Trophy, Mail, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import playerService from '../../services/playerService'
import scheduleService from '../../services/scheduleService'
import upcomingSeriesService from '../../services/upcomingSeriesService'
import contactService from '../../services/contactService'
import Card from '../../components/Card'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'

const STAT_CONFIG = [
  { key: 'players', label: 'Registered Players', icon: Users },
  { key: 'matches', label: 'Scheduled Matches', icon: CalendarDays },
  { key: 'series', label: 'Upcoming Series', icon: Trophy },
  { key: 'messages', label: 'Contact Messages', icon: Mail },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      playerService.getAll(),
      scheduleService.getAll(),
      upcomingSeriesService.getAll(),
      contactService.getAll(),
    ]).then(([players, matches, series, messages]) => {
      setStats({
        players: players.status === 'fulfilled' ? players.value?.length || 0 : 0,
        matches: matches.status === 'fulfilled' ? matches.value?.length || 0 : 0,
        series: series.status === 'fulfilled' ? series.value?.length || 0 : 0,
        messages: messages.status === 'fulfilled' ? messages.value?.length || 0 : 0,
      })
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy-900">
          Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-navy-700/70">Here's how ESCL is looking today.</p>
      </div>

      {loading ? (
        <Loader label="Loading dashboard..." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
              <Card key={key}>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
                    <Icon size={18} />
                  </span>
                  <TrendingUp size={16} className="text-win" />
                </div>
                <div className="stat-num mt-4 text-3xl font-bold text-navy-900">{stats?.[key] ?? 0}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-navy-700/50">{label}</div>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Card>
              <h3 className="font-display text-lg font-semibold text-navy-900">Registrations Over Time</h3>
              <div className="mt-4 flex h-48 items-center justify-center rounded-xl border border-dashed border-navy-100 text-sm text-navy-700/40">
                Chart placeholder — connect analytics data
              </div>
            </Card>
            <Card>
              <h3 className="font-display text-lg font-semibold text-navy-900">Points Table Movement</h3>
              <div className="mt-4 flex h-48 items-center justify-center rounded-xl border border-dashed border-navy-100 text-sm text-navy-700/40">
                Chart placeholder — connect analytics data
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
