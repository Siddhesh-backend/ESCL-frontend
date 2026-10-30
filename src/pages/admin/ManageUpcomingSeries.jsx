
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

const EMPTY_FORM = {
  seriesName: '',
  seriesDate: '',
}

export default function ManageUpcomingSeries() {
  const { data, loading, error, refetch } = useFetch(
    () => upcomingSeriesService.getAll(),
    []
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
    const list = Array.isArray(data) ? data : []

    if (!debouncedSearch) return list

    return list.filter((series) =>
      series.seriesName
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    )
  }, [data, debouncedSearch])

  function openCreate() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setForm({
      seriesName: row.seriesName || '',
      seriesDate: row.seriesDate || '',
    })
    setErrors({})
    setModalOpen(true)
  }

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function validate() {
    const next = {}

    if (!isNotEmpty(form.seriesName)) {
      next.seriesName = 'Series name is required'
    }

    if (!isNotEmpty(form.seriesDate)) {
      next.seriesDate = 'Series date is required'
    }

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
    {
      key: 'seriesName',
      label: 'Series Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10">
            <Trophy size={17} className="text-orange-400" />
          </div>

          <span className="font-semibold text-slate-100">
            {row.seriesName}
          </span>
        </div>
      ),
    },
    {
      key: 'seriesDate',
      label: 'Series Date',
      render: (row) => (
        <span className="text-slate-300">
          {formatDate(row.seriesDate)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="rounded-lg p-2 text-sky-400 transition hover:bg-sky-400/10 hover:text-sky-300"
            aria-label={`Edit ${row.seriesName}`}
            title="Edit Series"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            aria-label={`Delete ${row.seriesName}`}
            title="Delete Series"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="relative min-h-full overflow-hidden bg-[#061326] p-4 text-white sm:p-6 lg:p-8">
      {/* Background Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/[0.06] blur-[100px]"
      />

      <div className="relative">
        {/* Page Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#243B53] pb-6">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3">
                <Trophy size={23} className="text-orange-400" />
              </div>

              <h1 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
                Manage Upcoming Series
              </h1>
            </div>

            <p className="text-sm text-slate-400 sm:ml-[58px]">
              Create, edit and manage your upcoming cricket series.
            </p>
          </div>

          <Button variant="primary" onClick={openCreate}>
            <Plus size={17} />
            Add Series
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-[#243B53] bg-[#0B1B30] p-4">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search series..."
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[#243B53] bg-[#0B1B30] p-8">
            <Loader label="Loading series..." />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-[#0B1B30] p-5">
            <EmptyState
              title="Couldn't load series"
              description={error}
            />
          </div>
        )}

        {/* Series Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] shadow-xl shadow-black/10">
            <Table
              columns={columns}
              data={filtered}
              emptyMessage="No series found."
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#243B53] bg-[#0B1B30] px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
              <Trophy size={26} className="text-orange-400" />
            </div>

            <h3 className="text-lg font-bold text-white">
              {search ? 'No matching series' : 'No series yet'}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {search
                ? 'Try another search term.'
                : 'Add your first upcoming series to get started.'}
            </p>

            {!search && (
              <div className="mt-5">
                <Button variant="primary" onClick={openCreate}>
                  <Plus size={16} />
                  Add Series
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add / Edit Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Series' : 'Add Series'}
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                loading={saving}
                onClick={handleSave}
              >
                {editingId ? 'Save Changes' : 'Create Series'}
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-5">
            <Input
              id="u-name"
              label="Series Name"
              value={form.seriesName}
              error={errors.seriesName}
              placeholder="Enter series name"
              onChange={(e) => update('seriesName', e.target.value)}
            />

            <Input
              id="u-date"
              label="Series Date"
              type="date"
              value={form.seriesDate}
              error={errors.seriesDate}
              onChange={(e) => update('seriesDate', e.target.value)}
            />
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Series"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                loading={deleting}
                onClick={handleDelete}
              >
                Delete Series
              </Button>
            </>
          }
        >
          <p className="text-sm leading-6 text-slate-300">
            Are you sure you want to delete{' '}
            <strong className="text-white">
              {deleteTarget?.seriesName}
            </strong>
            ? This action cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  )
}
