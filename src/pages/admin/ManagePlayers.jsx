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
import { isValidEmail, isValidPhone, isNotEmpty, minLength } from '../../utils/validators'

const EMPTY_FORM = { name: '', email: '', phone: '', password: '' }

export default function ManagePlayers() {
  const { data, loading, error, refetch } = useFetch(() => playerService.getAll(), [])
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
    return list.filter(
      (p) =>
        p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [data, debouncedSearch])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(player) {
    setEditingId(player.id)
    setForm({ name: player.name, email: player.email, phone: player.phone, password: '' })
    setErrors({})
    setModalOpen(true)
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!isNotEmpty(form.name)) next.name = 'Required'
    if (!isValidEmail(form.email)) next.email = 'Invalid email'
    if (!isValidPhone(form.phone)) next.phone = 'Invalid phone'
    if (!editingId && !minLength(form.password, 6)) next.password = 'Min 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId) {
        await playerService.update(editingId, form)
        showToast('Player updated', 'success')
      } else {
        await playerService.create(form)
        showToast('Player created', 'success')
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
      showToast('Player deleted', 'success')
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
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
          <h1 className="font-display text-2xl font-bold text-navy-900">Manage Players</h1>
          <p className="text-sm text-navy-700/70">Create, edit and remove player registrations.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} /> Add Player
        </Button>
      </div>

      <div className="mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name or email..." />
      </div>

      {loading && <Loader label="Loading players..." />}
      {!loading && error && <EmptyState title="Couldn't load players" description={error} />}
      {!loading && !error && (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No players found."
        />
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="mt-4">
          <EmptyState icon={Users} title="No players yet" description="Add your first player to get started." />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Player' : 'Add Player'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Create Player'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="p-name" label="Name" value={form.name} error={errors.name} onChange={(e) => update('name', e.target.value)} />
          <Input id="p-email" label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => update('email', e.target.value)} />
          <Input id="p-phone" label="Phone" type="tel" value={form.phone} error={errors.phone} onChange={(e) => update('phone', e.target.value)} />
          {!editingId && (
            <Input id="p-password" label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => update('password', e.target.value)} />
          )}
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Player"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
