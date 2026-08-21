import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Mail, Phone } from 'lucide-react'
import playerService from '../services/playerService'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import usePagination from '../hooks/usePagination'
import SearchBox from '../components/SearchBox'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Card from '../components/Card'
import Pagination from '../components/Pagination'

export default function PlayerList() {
  const { data, loading, error } = useFetch(() => playerService.getAll(), [])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    const list = data || []
    if (!debouncedSearch) return list
    return list.filter(
      (p) =>
        p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [data, debouncedSearch])

  const { page, totalPages, pageItems, goTo } = usePagination(filtered, 9)

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Roster
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold text-navy-900">Registered Players</h1>
        </div>
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name or email..." />
      </div>

      {loading && <Loader label="Loading players..." />}
      {!loading && error && <EmptyState title="Couldn't load players" description={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon={Users} title="No players found" description="Try a different search term." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((p) => (
              <Link key={p.id} to={`/players/${p.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-semibold text-white">
                      {p.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-navy-900">{p.name}</h3>
                      <p className="flex items-center gap-1.5 text-xs text-navy-700/60">
                        <Mail size={12} /> {p.email}
                      </p>
                    </div>
                  </div>
                  {p.phone && (
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-700/70">
                      <Phone size={14} /> {p.phone}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={goTo} />
        </>
      )}
    </div>
  )
}
