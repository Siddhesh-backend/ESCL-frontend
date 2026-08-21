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

const NUMERIC_FIELDS = ['position', 'matchesPlayed', 'won', 'lost', 'tie', 'noResult', 'points']

export default function ManagePointsTable() {
  const { data, loading, error, refetch } = useFetch(() => pointsTableService.getAll(), [])
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
    return list.filter((r) => r.teamName?.toLowerCase().includes(debouncedSearch.toLowerCase()))
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
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!isNotEmpty(form.season)) next.season = 'Required'
    if (!isNotEmpty(form.teamName)) next.teamName = 'Required'
    ;['position', 'matchesPlayed', 'won', 'lost', 'points'].forEach((f) => {
      if (!isNotEmpty(String(form[f]))) next[f] = 'Required'
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form }
      NUMERIC_FIELDS.forEach((f) => {
        payload[f] = payload[f] === '' ? 0 : Number(payload[f])
      })
      payload.netRunRate = payload.netRunRate === '' ? 0 : Number(payload.netRunRate)

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
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="focus-ring rounded-lg p-1.5 text-navy-700 hover:bg-navy-100" aria-label="Edit">
            <Pencil size={16} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="focus-ring rounded-lg p-1.5 text-loss hover:bg-red-50" aria-label="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Manage Points Table</h1>
          <p className="text-sm text-navy-700/70">Create, edit and remove team standings.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} /> Add Standing
        </Button>
      </div>

      <div className="mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search team..." />
      </div>

      {loading && <Loader label="Loading points table..." />}
      {!loading && error && <EmptyState title="Couldn't load points table" description={error} />}
      {!loading && !error && <Table columns={columns} data={filtered} emptyMessage="No standings found." />}
      {!loading && !error && filtered.length === 0 && (
        <div className="mt-4">
          <EmptyState icon={Trophy} title="No standings yet" description="Add the first team standing." />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Standing' : 'Add Standing'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Create Standing'}
            </Button>
          </>
        }
      >
        <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-1">
          <Input id="pt-season" label="Season" value={form.season} error={errors.season} onChange={(e) => update('season', e.target.value)} />
          <Input id="pt-position" label="Position" type="number" value={form.position} error={errors.position} onChange={(e) => update('position', e.target.value)} />
          <Input id="pt-team" label="Team Name" className="col-span-2" value={form.teamName} error={errors.teamName} onChange={(e) => update('teamName', e.target.value)} />
          <Input id="pt-mp" label="Matches Played" type="number" value={form.matchesPlayed} error={errors.matchesPlayed} onChange={(e) => update('matchesPlayed', e.target.value)} />
          <Input id="pt-won" label="Won" type="number" value={form.won} error={errors.won} onChange={(e) => update('won', e.target.value)} />
          <Input id="pt-lost" label="Lost" type="number" value={form.lost} error={errors.lost} onChange={(e) => update('lost', e.target.value)} />
          <Input id="pt-tie" label="Tie" type="number" value={form.tie} onChange={(e) => update('tie', e.target.value)} />
          <Input id="pt-nr" label="No Result" type="number" value={form.noResult} onChange={(e) => update('noResult', e.target.value)} />
          <Input id="pt-nrr" label="Net Run Rate" type="text" value={form.netRunRate} onChange={(e) => update('netRunRate', e.target.value)} />
          <Input id="pt-points" label="Points" type="number" value={form.points} error={errors.points} onChange={(e) => update('points', e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Standing"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Are you sure you want to delete the standing for <strong>{deleteTarget?.teamName}</strong>?
        </p>
      </Modal>
    </div>
  )
}
