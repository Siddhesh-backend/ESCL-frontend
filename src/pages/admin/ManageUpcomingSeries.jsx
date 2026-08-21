import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Trophy } from 'lucide-react'
import upcomingSeriesService from '../../services/upcomingSeriesService'
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
import { formatDate } from '../../utils/formatters'

const EMPTY_FORM = { seriesName: '', seriesDate: '' }

export default function ManageUpcomingSeries() {
  const { data, loading, error, refetch } = useFetch(() => upcomingSeriesService.getAll(), [])
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
    return list.filter((s) => s.seriesName?.toLowerCase().includes(debouncedSearch.toLowerCase()))
  }, [data, debouncedSearch])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setForm({ seriesName: row.seriesName, seriesDate: row.seriesDate })
    setErrors({})
    setModalOpen(true)
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!isNotEmpty(form.seriesName)) next.seriesName = 'Required'
    if (!isNotEmpty(form.seriesDate)) next.seriesDate = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId) {
        await upcomingSeriesService.update(editingId, form)
        showToast('Series updated', 'success')
      } else {
        await upcomingSeriesService.create(form)
        showToast('Series created', 'success')
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
      await upcomingSeriesService.remove(deleteTarget.id)
      showToast('Series deleted', 'success')
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'seriesName', label: 'Series Name' },
    { key: 'seriesDate', label: 'Series Date', render: (r) => formatDate(r.seriesDate) },
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
          <h1 className="font-display text-2xl font-bold text-navy-900">Manage Upcoming Series</h1>
          <p className="text-sm text-navy-700/70">Create, edit and remove upcoming series.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} /> Add Series
        </Button>
      </div>

      <div className="mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search series..." />
      </div>

      {loading && <Loader label="Loading series..." />}
      {!loading && error && <EmptyState title="Couldn't load series" description={error} />}
      {!loading && !error && <Table columns={columns} data={filtered} emptyMessage="No series found." />}
      {!loading && !error && filtered.length === 0 && (
        <div className="mt-4">
          <EmptyState icon={Trophy} title="No series yet" description="Add your first upcoming series." />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Series' : 'Add Series'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Create Series'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="u-name" label="Series Name" value={form.seriesName} error={errors.seriesName} onChange={(e) => update('seriesName', e.target.value)} />
          <Input id="u-date" label="Series Date" type="date" value={form.seriesDate} error={errors.seriesDate} onChange={(e) => update('seriesDate', e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Series"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Are you sure you want to delete <strong>{deleteTarget?.seriesName}</strong>?
        </p>
      </Modal>
    </div>
  )
}
