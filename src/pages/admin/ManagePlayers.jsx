import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
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

export default function ManagePlayers() {
  const { data, loading, error, refetch } = useFetch(
    () => playerService.getAll(),
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
    const list = data || []

    if (!debouncedSearch) {
      return list
    }

    const searchValue = debouncedSearch.toLowerCase()

    return list.filter((p) => {
      const name = (p.fullName || p.name || '').toLowerCase()
      const email = (p.email || '').toLowerCase()

      return (
        name.includes(searchValue) ||
        email.includes(searchValue)
      )
    })
  }, [data, debouncedSearch])

  function openCreate() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(player) {
    setEditingId(player.id)

    setForm({
      fullName: player.fullName || player.name || '',
      collegeName: player.collegeName || '',
      branch: player.branch || '',
      year: player.year || '',
      dob: player.dob || '',
      position: player.position || '',
      experience: player.experience || '',
      cricheroesUrl: player.cricheroesUrl || '',
      basePrice: player.basePrice ?? '',
      email: player.email || '',
      password: '',
      paymentMethod: player.paymentMethod || '',
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

    if (!editingId && !minLength(form.password, 6)) {
      next.password = 'Min 6 characters'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  async function handleSave() {
    if (!validate()) return

    setSaving(true)

    try {
      if (editingId) {
        const updatePayload = {
          fullName: form.fullName,
          collegeName: form.collegeName,
          branch: form.branch,
          year: form.year,
          dob: form.dob,
          position: form.position,
          experience: form.experience,
          cricheroesUrl: form.cricheroesUrl,
          basePrice: form.basePrice,
          email: form.email,
          paymentMethod: form.paymentMethod,
        }

        await playerService.update(editingId, updatePayload)

        showToast('Player updated successfully', 'success')
      } else {
        await playerService.create(form)

        showToast('Player created successfully', 'success')
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

  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      render: (row) => row.fullName || row.name || '-',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'collegeName',
      label: 'College',
      render: (row) => row.collegeName || '-',
    },
    {
      key: 'branch',
      label: 'Branch',
      render: (row) => row.branch || '-',
    },
    {
      key: 'position',
      label: 'Position',
      render: (row) => row.position || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(row)}
            className="focus-ring rounded-lg p-1.5 text-navy-700 hover:bg-navy-100"
            aria-label="Edit"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => setDeleteTarget(row)}
            className="focus-ring rounded-lg p-1.5 text-loss hover:bg-red-50"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
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
            Create, edit and remove player registrations.
          </p>
        </div>

        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} />
          Add Player
        </Button>
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

      {/* Table */}
      {!loading && !error && (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No players found."
        />
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-4">
          <EmptyState
            icon={Users}
            title="No players yet"
            description="Add your first player to get started."
          />
        </div>
      )}

      {/* Add / Edit Player Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Player' : 'Add Player'}
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
              {editingId ? 'Save Changes' : 'Create Player'}
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
            onChange={(e) =>
              update('fullName', e.target.value)
            }
          />

          <Input
            id="p-collegeName"
            label="College / University Name"
            value={form.collegeName}
            error={errors.collegeName}
            onChange={(e) =>
              update('collegeName', e.target.value)
            }
          />

          <Input
            id="p-branch"
            label="Branch"
            value={form.branch}
            error={errors.branch}
            onChange={(e) =>
              update('branch', e.target.value)
            }
          />

          <Input
            id="p-year"
            label="Year of Study"
            value={form.year}
            error={errors.year}
            onChange={(e) =>
              update('year', e.target.value)
            }
          />

          <Input
            id="p-dob"
            label="Date of Birth"
            type="date"
            value={form.dob}
            error={errors.dob}
            onChange={(e) =>
              update('dob', e.target.value)
            }
          />

          <Input
            id="p-position"
            label="Preferred Playing Position"
            value={form.position}
            error={errors.position}
            onChange={(e) =>
              update('position', e.target.value)
            }
          />

          <Input
            id="p-experience"
            label="Level of Cricket Experience"
            value={form.experience}
            error={errors.experience}
            onChange={(e) =>
              update('experience', e.target.value)
            }
          />

          <Input
            id="p-cricheroesUrl"
            label="CricHeroes Account URL"
            type="url"
            value={form.cricheroesUrl}
            error={errors.cricheroesUrl}
            onChange={(e) =>
              update('cricheroesUrl', e.target.value)
            }
          />

          <Input
            id="p-basePrice"
            label="Base Price"
            type="number"
            value={form.basePrice}
            onChange={(e) =>
              update('basePrice', e.target.value)
            }
          />

          <Input
            id="p-paymentMethod"
            label="Payment Method"
            value={form.paymentMethod}
            error={errors.paymentMethod}
            onChange={(e) =>
              update('paymentMethod', e.target.value)
            }
          />

          <Input
            id="p-email"
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) =>
              update('email', e.target.value)
            }
          />

          {/* Password only for creating a new player */}
          {!editingId && (
            <Input
              id="p-password"
              label="Password"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={(e) =>
                update('password', e.target.value)
              }
            />
          )}

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
            {deleteTarget?.fullName || deleteTarget?.name}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>

    </div>
  )
}