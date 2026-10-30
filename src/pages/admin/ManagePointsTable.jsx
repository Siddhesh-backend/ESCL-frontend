import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Trophy } from 'lucide-react'
import pointsTableService from '../../services/pointsTableService'
import useFetch from '../../hooks/useFetch'
import useDebounce from '../../hooks/useDebounce'
import Table from '../../components/Table'
import SearchBox from '../../components/SearchBox'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Input from '../../components/Input'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../context/ToastContext'
import { isNotEmpty } from '../../utils/validators'

const EMPTY_FORM = {
  season: '',
  position: '',
  teamName: '',
  matchesPlayed: '',
  won: '',
  lost: '',
  tie: '',
  noResult: '',
  netRunRate: '',
  points: '',
}

const NUMERIC_FIELDS = [
  'position',
  'matchesPlayed',
  'won',
  'lost',
  'tie',
  'noResult',
  'points',
]

export default function ManagePointsTable() {
  const { data, loading, error, refetch } = useFetch(
    () => pointsTableService.getAll(),
    [],
  )
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const list = data || []

    if (!debouncedSearch) return list

    return list.filter((row) =>
      row.teamName?.toLowerCase().includes(debouncedSearch.toLowerCase()),
    )
  }, [data, debouncedSearch])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setForm({ ...EMPTY_FORM, ...row })
    setErrors({})
    setModalOpen(true)
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validate() {
    const next = {}

    if (!isNotEmpty(form.season)) next.season = 'Required'
    if (!isNotEmpty(form.teamName)) next.teamName = 'Required'

      ;['position', 'matchesPlayed', 'won', 'lost', 'points'].forEach((field) => {
        if (!isNotEmpty(String(form[field]))) next[field] = 'Required'
      })

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSave() {
    if (!validate()) return

    setSaving(true)

    try {
      const payload = { ...form }

      NUMERIC_FIELDS.forEach((field) => {
        payload[field] =
          payload[field] === '' ? 0 : Number(payload[field])
      })

      payload.netRunRate =
        payload.netRunRate === '' ? 0 : Number(payload.netRunRate)

      if (editingId) {
        await pointsTableService.update(editingId, payload)
        showToast('Standing updated', 'success')
      } else {
        await pointsTableService.create(payload)
        showToast('Standing created', 'success')
      }

      setModalOpen(false)
      refetch()
    } catch (err) {
      showToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      await pointsTableService.remove(deleteTarget.id)
      showToast('Standing deleted', 'success')
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'season', label: 'Season' },
    { key: 'position', label: 'Pos' },
    { key: 'teamName', label: 'Team' },
    { key: 'matchesPlayed', label: 'P' },
    { key: 'won', label: 'W' },
    { key: 'lost', label: 'L' },
    { key: 'tie', label: 'T' },
    { key: 'noResult', label: 'NR' },
    { key: 'netRunRate', label: 'NRR' },
    { key: 'points', label: 'Pts' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="focus-ring rounded-lg border border-[#30445C] bg-[#10243B] p-2 text-orange-400 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-300"
            aria-label="Edit standing"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="focus-ring rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
            aria-label="Delete standing"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061326] p-4 text-white sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
              <Trophy size={15} />
              Tournament Control
            </div>

            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Manage Points Table
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Create, edit and manage tournament team standings.
            </p>
          </div>

          <Button variant="primary" onClick={openCreate}>
            <Plus size={16} />
            Add Standing
          </Button>
        </div>

        <div className="mb-5 rounded-2xl border border-[#243B53] bg-[#0B1B30] p-4">
          <div className="mb-3 text-sm font-semibold text-slate-200">
            Search standings
          </div>

          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search by team name..."
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] shadow-lg shadow-black/10">
          <div className="flex items-center justify-between gap-3 border-b border-[#243B53] bg-[#10243B] px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-semibold text-white">Team Standings</h2>
              <p className="mt-1 text-xs text-slate-400">
                Tournament performance and points
              </p>
            </div>

            {!loading && !error && (
              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                {filtered.length} {filtered.length === 1 ? 'Team' : 'Teams'}
              </span>
            )}
          </div>

          <div className="p-3 sm:p-4">
            {loading && <Loader label="Loading points table..." />}

            {!loading && error && (
              <EmptyState
                title="Couldn't load points table"
                description={error}
              />
            )}

            {!loading && !error && (
              <Table
                columns={columns}
                data={filtered}
                emptyMessage="No standings found."
              />
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="mt-4">
                <EmptyState
                  icon={Trophy}
                  title="No standings yet"
                  description="Add the first team standing."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Standing' : 'Add Standing'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="primary"
              loading={saving}
              onClick={handleSave}
            >
              {editingId ? 'Save Changes' : 'Create Standing'}
            </Button>
          </>
        }
      >
        <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
          <Input
            id="pt-season"
            label="Season"
            value={form.season}
            error={errors.season}
            onChange={(e) => update('season', e.target.value)}
          />

          <Input
            id="pt-position"
            label="Position"
            type="number"
            value={form.position}
            error={errors.position}
            onChange={(e) => update('position', e.target.value)}
          />

          <Input
            id="pt-team"
            label="Team Name"
            className="sm:col-span-2"
            value={form.teamName}
            error={errors.teamName}
            onChange={(e) => update('teamName', e.target.value)}
          />

          <Input
            id="pt-mp"
            label="Matches Played"
            type="number"
            value={form.matchesPlayed}
            error={errors.matchesPlayed}
            onChange={(e) => update('matchesPlayed', e.target.value)}
          />

          <Input
            id="pt-won"
            label="Won"
            type="number"
            value={form.won}
            error={errors.won}
            onChange={(e) => update('won', e.target.value)}
          />

          <Input
            id="pt-lost"
            label="Lost"
            type="number"
            value={form.lost}
            error={errors.lost}
            onChange={(e) => update('lost', e.target.value)}
          />

          <Input
            id="pt-tie"
            label="Tie"
            type="number"
            value={form.tie}
            onChange={(e) => update('tie', e.target.value)}
          />

          <Input
            id="pt-nr"
            label="No Result"
            type="number"
            value={form.noResult}
            onChange={(e) => update('noResult', e.target.value)}
          />

          <Input
            id="pt-nrr"
            label="Net Run Rate"
            type="text"
            value={form.netRunRate}
            onChange={(e) => update('netRunRate', e.target.value)}
          />

          <Input
            id="pt-points"
            label="Points"
            type="number"
            value={form.points}
            error={errors.points}
            onChange={(e) => update('points', e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Standing"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>

            <Button
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-slate-300">
          Are you sure you want to delete the standing for{' '}
          <strong className="text-white">{deleteTarget?.teamName}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}