
import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Eye,
  Trash2,
  Users,
  FileDown,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import playerService from '../../services/playerService'
import api from '../../services/api'
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

const getPlayerName = (player) =>
  player?.fullName || player?.name || '-'

const getPlayerValue = (value) =>
  value === null || value === undefined || value === ''
    ? '-'
    : String(value)

const getList = (data) => {
  if (Array.isArray(data)) return data
  return data?.content || data?.data || []
}

export default function ManagePlayers() {
  const { data, loading, error, refetch } = useFetch(
    () => playerService.getAll(),
    []
  )

  const { showToast } = useToast()

  const [teams, setTeams] = useState([])
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [teamsError, setTeamsError] = useState('')

  const [invitedOpen, setInvitedOpen] = useState(true)
  const [teamPlayersOpen, setTeamPlayersOpen] = useState(true)
  const [pdfMenuOpen, setPdfMenuOpen] = useState(false)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch team registrations separately
  async function fetchTeams() {
    try {
      setTeamsLoading(true)
      setTeamsError('')

      const response = await api.get('/admin/team-registrations')
      setTeams(getList(response.data))
    } catch (err) {
      setTeamsError(
        err.message || 'Unable to load team registration players.'
      )
    } finally {
      setTeamsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const players = Array.isArray(data) ? data : []

  // Flatten players from all registered teams
  const teamPlayers = useMemo(() => {
    return teams.flatMap((team) =>
      (team.players || []).map((player) => ({
        ...player,
        teamId: team.id,
        teamName: team.teamName,
        collegeUniversity: team.collegeUniversity,
      }))
    )
  }, [teams])

  // Identify team player IDs to avoid duplicate entries
  const teamPlayerIds = useMemo(() => {
    return new Set(
      teamPlayers
        .filter((player) => player.id !== null && player.id !== undefined)
        .map((player) => String(player.id))
    )
  }, [teamPlayers])

  // Only invited registrations remain in this list
  const invitedPlayers = useMemo(() => {
    return players.filter(
      (player) => !teamPlayerIds.has(String(player.id))
    )
  }, [players, teamPlayerIds])

  // Search invited players
  const filteredInvitedPlayers = useMemo(() => {
    if (!debouncedSearch) return invitedPlayers

    const searchValue = debouncedSearch.toLowerCase()

    return invitedPlayers.filter((player) => {
      const name = getPlayerName(player).toLowerCase()
      const email = (player.email || '').toLowerCase()
      const college = (player.collegeName || '').toLowerCase()

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        college.includes(searchValue)
      )
    })
  }, [invitedPlayers, debouncedSearch])

  // Search team registration players
  const filteredTeamPlayers = useMemo(() => {
    if (!debouncedSearch) return teamPlayers

    const searchValue = debouncedSearch.toLowerCase()

    return teamPlayers.filter((player) => {
      return (
        getPlayerName(player).toLowerCase().includes(searchValue) ||
        (player.collegeId || '').toLowerCase().includes(searchValue) ||
        (player.contactNumber || '').toLowerCase().includes(searchValue) ||
        (player.teamName || '').toLowerCase().includes(searchValue)
      )
    })
  }, [teamPlayers, debouncedSearch])

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
      showToast(
        err.message || 'Player creation failed',
        'error'
      )
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

  // Download separate PDFs for invited and team players
  function downloadPdf(type) {
    if (type === 'invited' && (loading || error)) {
      showToast(
        'Please wait until invited players load successfully.',
        'error'
      )
      return
    }

    if (type === 'team' && (teamsLoading || teamsError)) {
      showToast(
        'Please wait until team players load successfully.',
        'error'
      )
      return
    }

    const isInvited = type === 'invited'

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const columns = isInvited
      ? [
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'College', dataKey: 'college' },
        { header: 'Branch', dataKey: 'branch' },
        { header: 'Position', dataKey: 'position' },
      ]
      : [
        { header: 'Player Name', dataKey: 'name' },
        { header: 'Team Name', dataKey: 'team' },
        { header: 'College ID', dataKey: 'collegeId' },
        { header: 'Jersey No.', dataKey: 'jersey' },
        { header: 'Contact', dataKey: 'contact' },
      ]

    const body = isInvited
      ? invitedPlayers.map((player) => ({
        name: getPlayerName(player),
        email: getPlayerValue(player.email),
        college: getPlayerValue(player.collegeName),
        branch: getPlayerValue(player.branch),
        position: getPlayerValue(player.position),
      }))
      : teamPlayers.map((player) => ({
        name: getPlayerName(player),
        team: getPlayerValue(player.teamName),
        collegeId: getPlayerValue(player.collegeId),
        jersey: getPlayerValue(player.jerseyNumber),
        contact: getPlayerValue(player.contactNumber),
      }))

    const title = isInvited
      ? 'ESCL - Invited Player Registrations'
      : 'ESCL - Team Registration Players'

    const fileName = isInvited
      ? 'ESCL_Invited_Players.pdf'
      : 'ESCL_Team_Registration_Players.pdf'

    doc.setFontSize(16)
    doc.text(title, 14, 15)

    autoTable(doc, {
      columns,
      body,
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

    const totalText = `Total Players: ${body.length}`
    const pageHeight = doc.internal.pageSize.getHeight()
    let totalY = doc.lastAutoTable.finalY + 9

    if (totalY > pageHeight - 12) {
      doc.addPage()
      totalY = 18
    }

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(totalText, 14, totalY)

    doc.save(fileName)
    setPdfMenuOpen(false)
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
            className="focus-ring rounded-lg border border-transparent p-2 text-sky-300 transition hover:border-sky-400/20 hover:bg-sky-400/10"
            aria-label={`View ${getPlayerName(row)}`}
            title="View Player"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="focus-ring rounded-lg border border-transparent p-2 text-red-400 transition hover:border-red-400/20 hover:bg-red-500/10"
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
    {
      label: 'Full Name',
      value: viewTarget ? getPlayerName(viewTarget) : '-',
    },
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
    <div className="relative min-h-full overflow-hidden bg-[#061326] p-4 text-white sm:p-6 lg:p-8">
      {/* Background glow effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-orange-500/[0.06] blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[30rem] h-72 w-72 rounded-full bg-blue-500/[0.05] blur-[100px]"
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#243B53] pb-6">
          <div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white">
              Manage Players
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage invited players and team registration rosters separately.
            </p>

            <p className="mt-3 inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300">
              Total Players: {invitedPlayers.length + teamPlayers.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* PDF Download Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setPdfMenuOpen((current) => !current)}
              >
                <FileDown size={16} />
                Download PDF
                <ChevronDown size={16} />
              </Button>

              {pdfMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[#243B53] bg-[#10233B] shadow-2xl">
                  <button
                    type="button"
                    onClick={() => downloadPdf('invited')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition hover:bg-orange-500/10"
                  >
                    <FileDown size={17} className="text-orange-400" />
                    <span>
                      <span className="block font-semibold">
                        Invited Players PDF
                      </span>
                      <span className="text-xs text-slate-400">
                        {invitedPlayers.length} players
                      </span>
                    </span>
                  </button>

                  <div className="border-t border-[#243B53]" />

                  <button
                    type="button"
                    onClick={() => downloadPdf('team')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition hover:bg-sky-500/10"
                  >
                    <FileDown size={17} className="text-sky-400" />
                    <span>
                      <span className="block font-semibold">
                        Team Registration PDF
                      </span>
                      <span className="text-xs text-slate-400">
                        {teamPlayers.length} players
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              onClick={openCreate}
            >
              <Plus size={16} />
              Add Player
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-[#243B53] bg-[#0B1B30] p-3 sm:p-4">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, college ID or team..."
          />
        </div>

        {/* Invited Player Registrations */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] shadow-xl shadow-black/10">
          <button
            type="button"
            onClick={() => setInvitedOpen((current) => !current)}
            className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left transition hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-400">
                <Users size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Invited Player Registrations
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Players registered through the invited player form.
                </p>
              </div>

              <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                {invitedPlayers.length}
              </span>
            </div>

            {invitedOpen
              ? <ChevronUp size={20} className="text-slate-400" />
              : <ChevronDown size={20} className="text-slate-400" />}
          </button>

          {invitedOpen && (
            <div className="border-t border-[#243B53] p-4 sm:p-5">
              {loading && (
                <Loader label="Loading invited players..." />
              )}

              {!loading && error && (
                <EmptyState
                  title="Couldn't load invited players"
                  description={error}
                />
              )}

              {!loading && !error && (
                <>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-slate-400">
                      Showing {filteredInvitedPlayers.length} of {invitedPlayers.length} invited players
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-[#243B53]">
                    <Table
                      columns={columns}
                      data={filteredInvitedPlayers}
                      emptyMessage="No invited players found."
                    />
                  </div>

                  {invitedPlayers.length === 0 && (
                    <div className="mt-4">
                      <EmptyState
                        icon={Users}
                        title="No invited players yet"
                        description="Invited player registrations will appear here."
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        {/* Team Registration Players */}
        <section className="overflow-hidden rounded-2xl border border-[#243B53] bg-[#0B1B30] shadow-xl shadow-black/10">
          <button
            type="button"
            onClick={() => setTeamPlayersOpen((current) => !current)}
            className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left transition hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-3 text-sky-300">
                <Users size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Team Registration Players
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Players registered as part of a team roster.
                </p>
              </div>

              <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">
                {teamPlayers.length}
              </span>
            </div>

            {teamPlayersOpen
              ? <ChevronUp size={20} className="text-slate-400" />
              : <ChevronDown size={20} className="text-slate-400" />}
          </button>

          {teamPlayersOpen && (
            <div className="border-t border-[#243B53] p-4 sm:p-5">
              {teamsLoading && (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
                  <RefreshCw size={17} className="animate-spin" />
                  Loading team registration players...
                </div>
              )}

              {!teamsLoading && teamsError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="text-sm text-red-300">
                    {teamsError}
                  </p>

                  <button
                    type="button"
                    onClick={fetchTeams}
                    className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
                  >
                    <RefreshCw size={15} />
                    Retry
                  </button>
                </div>
              )}

              {!teamsLoading && !teamsError && (
                <>
                  <p className="mb-3 text-sm text-slate-400">
                    Showing {filteredTeamPlayers.length} of {teamPlayers.length} team players
                  </p>

                  {filteredTeamPlayers.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No team players found"
                      description="Team registration players will appear here."
                    />
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-[#243B53]">
                      <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="border-b border-[#243B53] bg-[#10233B] text-xs uppercase tracking-wide text-slate-400">
                          <tr>
                            <th className="px-4 py-4">Player Name</th>
                            <th className="px-4 py-4">Team Name</th>
                            <th className="px-4 py-4">College ID</th>
                            <th className="px-4 py-4">Jersey No.</th>
                            <th className="px-4 py-4">Contact</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredTeamPlayers.map((player, index) => (
                            <tr
                              key={player.id ?? `${player.teamId}-${index}`}
                              className="border-b border-[#243B53]/70 transition last:border-0 hover:bg-white/[0.025]"
                            >
                              <td className="px-4 py-4 font-semibold text-white">
                                {getPlayerName(player)}
                              </td>

                              <td className="px-4 py-4">
                                <span className="rounded-lg border border-orange-400/20 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                                  {getPlayerValue(player.teamName)}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-slate-300">
                                {getPlayerValue(player.collegeId)}
                              </td>

                              <td className="px-4 py-4 text-slate-300">
                                {getPlayerValue(player.jerseyNumber)}
                              </td>

                              <td className="px-4 py-4 text-slate-300">
                                {getPlayerValue(player.contactNumber)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>

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

        {/* View Player Modal */}
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
                className="rounded-xl border border-[#243B53] bg-[#0B1B30] p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {label}
                </p>

                {label === 'CricHeroes URL' && value ? (
                  <a
                    href={String(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-sm text-orange-400 underline"
                  >
                    Open Profile
                  </a>
                ) : (
                  <p className="mt-1 break-words text-sm font-medium text-white">
                    {getPlayerValue(value)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
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
          <p className="text-sm leading-6 text-slate-300">
            Are you sure you want to delete{' '}
            <strong className="text-white">
              {getPlayerName(deleteTarget)}
            </strong>
            ? This action cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  )
}
