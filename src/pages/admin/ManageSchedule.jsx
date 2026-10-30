
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
  const { data, loading, error, refetch } = useFetch(
    () => scheduleService.getAll(),
    []
  )

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
    const list = Array.isArray(data) ? data : []

    return list.filter((match) => {
      const searchValue = debouncedSearch.toLowerCase()

      const matchesSearch =
        !searchValue ||
        match.matchName?.toLowerCase().includes(searchValue) ||
        match.venue?.toLowerCase().includes(searchValue) ||
        match.seriesName?.toLowerCase().includes(searchValue) ||
        match.city?.toLowerCase().includes(searchValue)

      const matchesStatus = !status || match.status === status

      return matchesSearch && matchesStatus
    })
  }, [data, debouncedSearch, status])

  function openCreate() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
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
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function validate() {
    const next = {}

      ;[
        'seriesName',
        'matchName',
        'venue',
        'city',
        'matchDate',
        'matchTime',
        'status',
      ].forEach((field) => {
        if (!isNotEmpty(form[field])) {
          next[field] = 'Required'
        }
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
    {
      key: 'seriesName',
      label: 'Series',
    },
    {
      key: 'matchName',
      label: 'Match',
    },
    {
      key: 'venue',
      label: 'Venue',
    },
    {
      key: 'city',
      label: 'City',
    },
    {
      key: 'matchDate',
      label: 'Date',
      render: (row) => formatDate(row.matchDate),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold ${statusColor(row.status)}`}
        >
          {row.status}
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
            aria-label={`Edit ${row.matchName}`}
            title="Edit Match"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            aria-label={`Delete ${row.matchName}`}
            title="Delete Match"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="relative min-h-full overflow-hidden bg-[#061326] p-4 text-white sm:p-6 lg:p-8">
      {/* Background Effects */}
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
                <CalendarDays className="text-orange-400" size={23} />
              </div>

              <h1 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
                Manage Schedule
              </h1>
            </div>

            <p className="text-sm text-slate-400 sm:ml-[58px]">
              Create, edit and manage match fixtures.
            </p>
          </div>

          <Button variant="primary" onClick={openCreate}>
            <Plus size={17} />
            Add Match
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#243B53] bg-[#0B1B30] p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Search match, series, venue or city..."
            />
          </div>

          <div className="w-full sm:w-52">
            <Filter
              value={status}
              onChange={setStatus}
              options={MATCH_STATUS}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[#243B53] bg-[#0B1B30] p-8">
            <Loader label="Loading schedule..." />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-[#0B1B30] p-5">
            <EmptyState
              title="Couldn't load schedule"
              description={error}
            />
          </div>
        )}

        {/* Schedule Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] shadow-xl shadow-black/10">
            <Table
              columns={columns}
              data={filtered}
              emptyMessage="No matches found."
            />
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#243B53] bg-[#0B1B30] px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
              <CalendarDays size={26} className="text-orange-400" />
            </div>

            <h3 className="text-lg font-bold text-white">
              No matches found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {search || status
                ? 'Try changing your search or status filter.'
                : 'Add your first fixture to get started.'}
            </p>

            {!search && !status && (
              <div className="mt-5">
                <Button variant="primary" onClick={openCreate}>
                  <Plus size={16} />
                  Add Match
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add / Edit Match Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Match' : 'Add Match'}
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
                {editingId ? 'Save Changes' : 'Create Match'}
              </Button>
            </>
          }
        >
          <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
            <Input
              id="s-series"
              label="Series Name"
              value={form.seriesName}
              error={errors.seriesName}
              onChange={(e) => update('seriesName', e.target.value)}
            />

            <Input
              id="s-match"
              label="Match Name"
              value={form.matchName}
              error={errors.matchName}
              onChange={(e) => update('matchName', e.target.value)}
            />

            <Input
              id="s-venue"
              label="Venue"
              value={form.venue}
              error={errors.venue}
              onChange={(e) => update('venue', e.target.value)}
            />

            <Input
              id="s-city"
              label="City"
              value={form.city}
              error={errors.city}
              onChange={(e) => update('city', e.target.value)}
            />

            <Input
              id="s-date"
              label="Match Date"
              type="date"
              value={form.matchDate}
              error={errors.matchDate}
              onChange={(e) => update('matchDate', e.target.value)}
            />

            <Input
              id="s-time"
              label="Match Time"
              type="time"
              value={form.matchTime}
              error={errors.matchTime}
              onChange={(e) => update('matchTime', e.target.value)}
            />

            <Input
              id="s-gmt"
              label="GMT Time"
              value={form.gmtTime}
              onChange={(e) => update('gmtTime', e.target.value)}
            />

            <Input
              id="s-local"
              label="Local Time"
              value={form.localTime}
              onChange={(e) => update('localTime', e.target.value)}
            />

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label
                htmlFor="s-status"
                className="text-sm font-semibold text-slate-300"
              >
                Match Status
              </label>

              <select
                id="s-status"
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full rounded-xl border border-[#30445C] bg-[#061326] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              >
                {MATCH_STATUS.map((item) => {
                  const value =
                    typeof item === 'string' ? item : item.value

                  const label =
                    typeof item === 'string'
                      ? item
                      : item.label

                  return (
                    <option
                      key={value}
                      value={value}
                      className="bg-[#0B1B30] text-white"
                    >
                      {label}
                    </option>
                  )
                })}
              </select>

              {errors.status && (
                <p className="text-xs text-red-400">
                  {errors.status}
                </p>
              )}
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Match"
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
                Delete Match
              </Button>
            </>
          }
        >
          <p className="text-sm leading-6 text-slate-300">
            Are you sure you want to delete{' '}
            <strong className="text-white">
              {deleteTarget?.matchName}
            </strong>
            ? This action cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  )
}
