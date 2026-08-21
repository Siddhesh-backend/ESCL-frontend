import { useParams, Link } from 'react-router-dom'
import { Mail, Phone, Pencil, ArrowLeft } from 'lucide-react'
import playerService from '../services/playerService'
import useFetch from '../hooks/useFetch'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

export default function PlayerDetails() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { data: player, loading, error } = useFetch(() => playerService.getById(id), [id])

  if (loading) return <Loader label="Loading player..." />
  if (error) return <EmptyState title="Couldn't load player" description={error} />
  if (!player) return <EmptyState title="Player not found" />

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <Link to="/players" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:underline">
        <ArrowLeft size={14} /> Back to roster
      </Link>

      <div className="rounded-2xl border border-navy-100 p-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-900 font-display text-3xl font-semibold text-white">
          {player.name?.charAt(0)?.toUpperCase() || '?'}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-navy-900">{player.name}</h1>

        <div className="mt-6 flex flex-col gap-3 text-left">
          <div className="flex items-center gap-3 rounded-xl border border-navy-100 p-4">
            <Mail size={18} className="text-orange-500" />
            <span className="text-sm text-navy-900">{player.email}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-navy-100 p-4">
            <Phone size={18} className="text-orange-500" />
            <span className="text-sm text-navy-900">{player.phone}</span>
          </div>
        </div>

        {isAuthenticated && (
          <Link to={`/players/${player.id}/edit`} className="mt-6 inline-block">
            <Button variant="outline">
              <Pencil size={14} /> Edit Player
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
