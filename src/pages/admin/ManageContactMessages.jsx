import { useMemo, useState } from 'react'
import { Trash2, Mail, Eye, MessageSquare } from 'lucide-react'
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
  const { data, loading, error, refetch } = useFetch(
    () => contactService.getAll(),
    [],
  )
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const list = data || []

    if (!debouncedSearch) return list

    const query = debouncedSearch.toLowerCase()

    return list.filter(
      (message) =>
        message.name?.toLowerCase().includes(query) ||
        message.email?.toLowerCase().includes(query) ||
        message.company?.toLowerCase().includes(query),
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewTarget(row)}
            className="focus-ring rounded-lg border border-[#30445C] bg-[#10243B] p-2 text-orange-400 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-300"
            aria-label="View message"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="focus-ring rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
            aria-label="Delete message"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061326] p-4 text-white sm:p-6 lg:p-8">
      {/* Background accents */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10">
        {/* Page header */}
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            <Mail size={15} />
            Communication Center
          </div>

          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Manage Contact Messages
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Review and manage messages submitted through the contact form.
          </p>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-[#243B53] bg-[#0B1B30] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <MessageSquare size={16} className="text-orange-400" />
            Search Messages
          </div>

          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email or company..."
          />
        </div>

        {/* Messages table */}
        <div className="overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] shadow-lg shadow-black/10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#243B53] bg-[#10243B] px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-semibold text-white">
                Contact Submissions
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Messages received from website visitors
              </p>
            </div>

            {!loading && !error && (
              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'Message' : 'Messages'}
              </span>
            )}
          </div>

          <div className="p-3 sm:p-4">
            {loading && <Loader label="Loading messages..." />}

            {!loading && error && (
              <EmptyState
                title="Couldn't load messages"
                description={error}
              />
            )}

            {!loading && !error && (
              <Table
                columns={columns}
                data={filtered}
                emptyMessage="No messages found."
              />
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="mt-4">
                <EmptyState
                  icon={Mail}
                  title="No messages yet"
                  description="Submissions from the contact page will appear here."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View message modal */}
      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title={viewTarget?.name || 'Contact Message'}
      >
        {viewTarget && (
          <div className="flex flex-col gap-4 text-sm text-slate-300">
            <div className="rounded-xl border border-[#243B53] bg-[#10243B] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </p>
              <p className="font-medium text-white">{viewTarget.name}</p>
            </div>

            <div className="rounded-xl border border-[#243B53] bg-[#10243B] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </p>
              <p className="break-all text-orange-300">
                {viewTarget.email}
              </p>
            </div>

            {viewTarget.company && (
              <div className="rounded-xl border border-[#243B53] bg-[#10243B] p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Company
                </p>
                <p className="text-white">{viewTarget.company}</p>
              </div>
            )}

            {viewTarget.phone && (
              <div className="rounded-xl border border-[#243B53] bg-[#10243B] p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Phone
                </p>
                <p className="text-white">{viewTarget.phone}</p>
              </div>
            )}

            {viewTarget.matchInterest && (
              <div className="rounded-xl border border-[#243B53] bg-[#10243B] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Match Interest
                </p>
                <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                  {viewTarget.matchInterest}
                </span>
              </div>
            )}

            <div>
              <p className="mb-2 font-semibold text-white">Message</p>
              <div className="whitespace-pre-wrap break-words rounded-xl border border-[#243B53] bg-[#061326] p-4 leading-6 text-slate-300">
                {viewTarget.message || 'No message content provided.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                onClick={() => setViewTarget(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Message"
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
              <Trash2 size={16} />
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-slate-300">
          Are you sure you want to delete the message from{' '}
          <strong className="text-white">
            {deleteTarget?.name}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}