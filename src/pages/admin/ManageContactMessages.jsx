import { useMemo, useState } from 'react'
import { Trash2, Mail, Eye } from 'lucide-react'
import contactService from '../../services/contactService'
import useFetch from '../../hooks/useFetch'
import useDebounce from '../../hooks/useDebounce'
import Table from '../../components/Table'
import SearchBox from '../../components/SearchBox'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../context/ToastContext'

export default function ManageContactMessages() {
  const { data, loading, error, refetch } = useFetch(() => contactService.getAll(), [])
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const list = data || []
    if (!debouncedSearch) return list
    return list.filter(
      (m) =>
        m.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.company?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [data, debouncedSearch])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await contactService.remove(deleteTarget.id)
      showToast('Message deleted', 'success')
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
    { key: 'company', label: 'Company' },
    { key: 'matchInterest', label: 'Interest' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setViewTarget(row)} className="focus-ring rounded-lg p-1.5 text-navy-700 hover:bg-navy-100" aria-label="View">
            <Eye size={16} />
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
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900">Manage Contact Messages</h1>
        <p className="text-sm text-navy-700/70">Review and manage messages submitted through the contact form.</p>
      </div>

      <div className="mb-5">
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name, email or company..." />
      </div>

      {loading && <Loader label="Loading messages..." />}
      {!loading && error && <EmptyState title="Couldn't load messages" description={error} />}
      {!loading && !error && <Table columns={columns} data={filtered} emptyMessage="No messages found." />}
      {!loading && !error && filtered.length === 0 && (
        <div className="mt-4">
          <EmptyState icon={Mail} title="No messages yet" description="Submissions from the contact page will appear here." />
        </div>
      )}

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title={viewTarget?.name}>
        {viewTarget && (
          <div className="flex flex-col gap-3 text-sm text-navy-700">
            <p><strong>Email:</strong> {viewTarget.email}</p>
            {viewTarget.company && <p><strong>Company:</strong> {viewTarget.company}</p>}
            {viewTarget.phone && <p><strong>Phone:</strong> {viewTarget.phone}</p>}
            {viewTarget.matchInterest && <p><strong>Match Interest:</strong> {viewTarget.matchInterest}</p>}
            <p><strong>Message:</strong></p>
            <p className="rounded-lg bg-pitch-50 p-3">{viewTarget.message}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Message"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Are you sure you want to delete the message from <strong>{deleteTarget?.name}</strong>?
        </p>
      </Modal>
    </div>
  )
}
