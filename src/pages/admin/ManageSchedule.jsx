import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-react'
import scheduleService from '../../services/scheduleService'
import useFetch from '../../hooks/useFetch'
import useDebounce from '../../hooks/useDebounce'
import Table from '../../components/Table'
import SearchBox from '../../components/SearchBox'
import Filter from '../../components/Filter'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Input from '../../components/Input'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../context/ToastContext'
import { isNotEmpty } from '../../utils/validators'
import { formatDate, statusColor } from '../../utils/formatters'
import { MATCH_STATUS } from '../../utils/constants'

const EMPTY_FORM = {
  seriesName: '',
  matchName: '',
  venue: '',
  city: '',
  matchDate: '',
  matchTime: '',
  gmtTime: '',
  localTime: '',
  status: 'UPCOMING',
}

export default function ManageSchedule() {
  const { data, loading, error, refetch } = useFetch(() => scheduleService.getAll(), [])
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
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
    return list.filter((m) => {
      const matchesSearch =
        !debouncedSearch ||
        m.matchName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.venue?.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesStatus = !status || m.status === status
      return matchesSearch && matchesStatus
    })
  }, [data, debouncedSearch, status])

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
    ;['seriesName', 'matchName', 'venue', 'city', 'matchDate', 'matchTime', 'status'].forEach((field) => {
      if (!isNotEmpty(form[field])) next[field] = 'Required'
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId) {
        await scheduleService.update(editingId, form)
        showToast('Match updated', 'success')
      } else {
        await scheduleService.create(form)
        showToast('Match created', 'success')
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
      await scheduleService.remove(deleteTarget.id)
      showToast('Match deleted', 'success')
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'seriesName', label: 'Series' },
    { key: 'matchName', label: 'Match' },
    { key: 'venue', label: 'Venue' },
    { key: 'city', label: 'City' },
    { key: 'matchDate', label: 'Date', render: (r) => formatDate(r.matchDate) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(r.status)}`}>{r.status}</span>
      ),
    },
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
          <h1 className="font-display text-2xl font-bold text-navy-900">Manage Schedule</h1>
          <p className="text-sm text-navy-700/70">Create, edit and remove match fixtures.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} /> Add Match
        </Button>
      </div>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchBox value={search} onChange={setSearch} placeholder="Search match or venue..." />
        <Filter value={status} onChange={setStatus} options={MATCH_STATUS} />
      </div>

      {loading && <Loader label="Loading schedule..." />}
      {!loading && error && <EmptyState title="Couldn't load schedule" description={error} />}
      {!loading && !error && (
        <Table columns={columns} data={filtered} emptyMessage="No matches found." />
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="mt-4">
          <EmptyState icon={CalendarDays} title="No matches yet" description="Add your first fixture to get started." />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Match' : 'Add Match'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Create Match'}
            </Button>
          </>
        }
      >
        <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
          <Input id="s-series" label="Series Name" value={form.seriesName} error={errors.seriesName} onChange={(e) => update('seriesName', e.target.value)} />
          <Input id="s-match" label="Match Name" value={form.matchName} error={errors.matchName} onChange={(e) => update('matchName', e.target.value)} />
          <Input id="s-venue" label="Venue" value={form.venue} error={errors.venue} onChange={(e) => update('venue', e.target.value)} />
          <Input id="s-city" label="City" value={form.city} error={errors.city} onChange={(e) => update('city', e.target.value)} />
          <Input id="s-date" label="Match Date" type="date" value={form.matchDate} error={errors.matchDate} onChange={(e) => update('matchDate', e.target.value)} />
          <Input id="s-time" label="Match Time" type="time" value={form.matchTime} error={errors.matchTime} onChange={(e) => update('matchTime', e.target.value)} />
          <Input id="s-gmt" label="GMT Time" value={form.gmtTime} onChange={(e) => update('gmtTime', e.target.value)} />
          <Input id="s-local" label="Local Time" value={form.localTime} onChange={(e) => update('localTime', e.target.value)} />
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="s-status" className="text-sm font-medium text-navy-800">Status</label>
            <select
              id="s-status"
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="focus-ring rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500"
            >
              {MATCH_STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Match"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Are you sure you want to delete <strong>{deleteTarget?.matchName}</strong>?
        </p>
      </Modal>
    </div>
  )
}
