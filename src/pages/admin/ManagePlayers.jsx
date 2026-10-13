
import { useMemo, useState } from 'react'
import { Plus, Eye, Trash2, Users, FileDown } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import playerService from '../../services/playerService'
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
import {
  isValidEmail,
  isNotEmpty,
  minLength,
} from '../../utils/validators'

const EMPTY_FORM = {
  fullName: '',
  collegeName: '',
  branch: '',
  year: '',
  dob: '',
  position: '',
  experience: '',
  cricheroesUrl: '',
  basePrice: '',
  email: '',
  password: '',
  paymentMethod: '',
}

const PDF_COLUMNS = [
  { header: 'Name', dataKey: 'name' },
  { header: 'Email', dataKey: 'email' },
  { header: 'College', dataKey: 'college' },
  { header: 'Branch', dataKey: 'branch' },
  { header: 'Position', dataKey: 'position' },
]

const getPlayerName = (player) =>
  player?.fullName || player?.name || '-'

const getPlayerValue = (value) =>
  value === null || value === undefined || value === ''
    ? '-'
    : String(value)

export default function ManagePlayers() {
  const { data, loading, error, refetch } = useFetch(
    () => playerService.getAll(),
    []
  )

  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const players = Array.isArray(data) ? data : []

  const filtered = useMemo(() => {
    if (!debouncedSearch) {
      return players
    }

    const searchValue = debouncedSearch.toLowerCase()

    return players.filter((player) => {
      const name = getPlayerName(player).toLowerCase()
      const email = (player.email || '').toLowerCase()

      return (
        name.includes(searchValue) ||
        email.includes(searchValue)
      )
    })
  }, [players, debouncedSearch])

  function openCreate() {
    setForm({ ...EMPTY_FORM })
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

    if (!isNotEmpty(form.fullName)) {
      next.fullName = 'Full name is required'
    }

    if (!isNotEmpty(form.collegeName)) {
      next.collegeName = 'College name is required'
    }

    if (!isNotEmpty(form.branch)) {
      next.branch = 'Branch is required'
    }

    if (!isNotEmpty(form.year)) {
      next.year = 'Year is required'
    }

    if (!isNotEmpty(form.dob)) {
      next.dob = 'Date of birth is required'
    }

    if (!isNotEmpty(form.position)) {
      next.position = 'Playing position is required'
    }

    if (!isNotEmpty(form.experience)) {
      next.experience = 'Experience is required'
    }

    if (!isNotEmpty(form.cricheroesUrl)) {
      next.cricheroesUrl = 'CricHeroes URL is required'
    }

    if (!isValidEmail(form.email)) {
      next.email = 'Invalid email'
    }

    if (!isNotEmpty(form.paymentMethod)) {
      next.paymentMethod = 'Payment method is required'
    }

    if (!minLength(form.password, 6)) {
      next.password = 'Min 6 characters'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  async function handleSave() {
    if (!validate()) return

    setSaving(true)

    try {
      await playerService.create(form)

      showToast('Player created successfully', 'success')
      setModalOpen(false)
      setForm({ ...EMPTY_FORM })
      setErrors({})
      refetch()
    } catch (err) {
      showToast(err.message || 'Player creation failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      await playerService.remove(deleteTarget.id)

      showToast('Player deleted successfully', 'success')
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  function handleDownloadPdf() {
    if (loading || error) {
      showToast(
        'Please wait until the players list loads successfully.',
        'error'
      )
      return
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    doc.setFontSize(16)
    doc.text('ESCL - Registered Players', 14, 15)

    autoTable(doc, {
      columns: PDF_COLUMNS,
      body: players.map((player) => ({
        name: getPlayerName(player),
        email: getPlayerValue(player.email),
        college: getPlayerValue(player.collegeName),
        branch: getPlayerValue(player.branch),
        position: getPlayerValue(player.position),
      })),
      startY: 22,
      margin: {
        top: 15,
        right: 14,
        bottom: 18,
        left: 14,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fontStyle: 'bold',
      },
      showHead: 'everyPage',
    })

    const totalText = `Total Registered Players: ${players.length}`
    const pageHeight = doc.internal.pageSize.getHeight()
    const finalY = doc.lastAutoTable.finalY
    const footerSpace = 12

    let totalY = finalY + 9

    if (totalY > pageHeight - footerSpace) {
      doc.addPage()
      totalY = 18
    }

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(totalText, 14, totalY)

    doc.save('ESCL_Registered_Players.pdf')
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      render: (row) => getPlayerName(row),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => getPlayerValue(row.email),
    },
    {
      key: 'collegeName',
      label: 'College',
      render: (row) => getPlayerValue(row.collegeName),
    },
    {
      key: 'branch',
      label: 'Branch',
      render: (row) => getPlayerValue(row.branch),
    },
    {
      key: 'position',
      label: 'Position',
      render: (row) => getPlayerValue(row.position),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewTarget(row)}
            className="focus-ring rounded-lg p-1.5 text-navy-700 hover:bg-navy-100"
            aria-label={`View ${getPlayerName(row)}`}
            title="View Player"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="focus-ring rounded-lg p-1.5 text-loss hover:bg-red-50"
            aria-label={`Delete ${getPlayerName(row)}`}
            title="Delete Player"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  const detailFields = [
    { label: 'Full Name', value: viewTarget ? getPlayerName(viewTarget) : '-' },
    { label: 'Email', value: viewTarget?.email },
    { label: 'College', value: viewTarget?.collegeName },
    { label: 'Branch', value: viewTarget?.branch },
    { label: 'Year of Study', value: viewTarget?.year },
    { label: 'Date of Birth', value: viewTarget?.dob },
    { label: 'Playing Position', value: viewTarget?.position },
    { label: 'Experience', value: viewTarget?.experience },
    { label: 'CricHeroes URL', value: viewTarget?.cricheroesUrl },
    { label: 'Base Price', value: viewTarget?.basePrice },
    { label: 'Payment Method', value: viewTarget?.paymentMethod },
  ]

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">
            Manage Players
          </h1>

          <p className="text-sm text-navy-700/70">
            View, register and remove player registrations.
          </p>

          <p className="mt-1 text-sm font-medium text-navy-700">
            Total Registered Players: {players.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost"
            onClick={handleDownloadPdf}
          >
            <FileDown size={16} />
            Download PDF
          </Button>

          <Button variant="primary" onClick={openCreate}>
            <Plus size={16} />
            Add Player
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email..."
        />
      </div>

      {/* Loading */}
      {loading && <Loader label="Loading players..." />}

      {/* Error */}
      {!loading && error && (
        <EmptyState
          title="Couldn't load players"
          description={error}
        />
      )}

      {/* Players Table */}
      {!loading && !error && (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No players found."
        />
      )}

      {!loading && !error && players.length === 0 && (
        <div className="mt-4">
          <EmptyState
            icon={Users}
            title="No players yet"
            description="Add your first player to get started."
          />
        </div>
      )}

      {/* Add Player Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Player"
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
              Create Player
            </Button>
          </>
        }
      >
        <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-2">
          <Input
            id="p-fullName"
            label="Full Name"
            value={form.fullName}
            error={errors.fullName}
            onChange={(e) => update('fullName', e.target.value)}
          />

          <Input
            id="p-collegeName"
            label="College / University Name"
            value={form.collegeName}
            error={errors.collegeName}
            onChange={(e) => update('collegeName', e.target.value)}
          />

          <Input
            id="p-branch"
            label="Branch"
            value={form.branch}
            error={errors.branch}
            onChange={(e) => update('branch', e.target.value)}
          />

          <Input
            id="p-year"
            label="Year of Study"
            value={form.year}
            error={errors.year}
            onChange={(e) => update('year', e.target.value)}
          />

          <Input
            id="p-dob"
            label="Date of Birth"
            type="date"
            value={form.dob}
            error={errors.dob}
            onChange={(e) => update('dob', e.target.value)}
          />

          <Input
            id="p-position"
            label="Preferred Playing Position"
            value={form.position}
            error={errors.position}
            onChange={(e) => update('position', e.target.value)}
          />

          <Input
            id="p-experience"
            label="Level of Cricket Experience"
            value={form.experience}
            error={errors.experience}
            onChange={(e) => update('experience', e.target.value)}
          />

          <Input
            id="p-cricheroesUrl"
            label="CricHeroes Account URL"
            type="url"
            value={form.cricheroesUrl}
            error={errors.cricheroesUrl}
            onChange={(e) => update('cricheroesUrl', e.target.value)}
          />

          <Input
            id="p-basePrice"
            label="Base Price"
            type="number"
            value={form.basePrice}
            onChange={(e) => update('basePrice', e.target.value)}
          />

          <Input
            id="p-paymentMethod"
            label="Payment Method"
            value={form.paymentMethod}
            error={errors.paymentMethod}
            onChange={(e) => update('paymentMethod', e.target.value)}
          />

          <Input
            id="p-email"
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => update('email', e.target.value)}
          />

          <Input
            id="p-password"
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => update('password', e.target.value)}
          />
        </div>
      </Modal>

      {/* View Player Modal - Read Only */}
      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Player Details"
        footer={
          <Button
            variant="ghost"
            onClick={() => setViewTarget(null)}
          >
            Close
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {detailFields.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-navy-100 p-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-navy-700/60">
                {label}
              </p>

              {label === 'CricHeroes URL' && value ? (
                <a
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-sm text-orange-600 underline"
                >
                  Open Profile
                </a>
              ) : (
                <p className="mt-1 break-words text-sm font-medium text-navy-900">
                  {getPlayerValue(value)}
                </p>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Player"
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
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Are you sure you want to delete{' '}
          <strong>
            {getPlayerName(deleteTarget)}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
