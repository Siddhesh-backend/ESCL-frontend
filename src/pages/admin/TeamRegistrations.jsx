
import { useCallback, useEffect, useState } from 'react'
import {
    RefreshCw,
    Users,
    MapPin,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    Clock,
    ChevronDown,
    ChevronUp,
    IndianRupee,
    Save,
    RotateCcw,
} from 'lucide-react'
import api from '../../services/api'

const DEFAULT_ENTRY_FEE = 2500

export default function TeamRegistrations() {
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const [error, setError] = useState('')
    const [expandedId, setExpandedId] = useState(null)

    const [entryFee, setEntryFee] = useState(DEFAULT_ENTRY_FEE)
    const [feeInput, setFeeInput] = useState(String(DEFAULT_ENTRY_FEE))
    const [feeLoading, setFeeLoading] = useState(true)
    const [feeSaving, setFeeSaving] = useState(false)
    const [feeError, setFeeError] = useState('')
    const [feeSuccess, setFeeSuccess] = useState('')

    const fetchTeams = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const response = await api.get('/admin/team-registrations')
            const data = response.data

            setTeams(
                Array.isArray(data)
                    ? data
                    : data?.content || data?.data || []
            )
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Unable to load team registrations.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchEntryFee = useCallback(async () => {
        try {
            setFeeLoading(true)
            setFeeError('')

            const response = await api.get(
                '/admin/team-registration-settings/entry-fee'
            )

            const value =
                typeof response.data === 'number'
                    ? response.data
                    : Number(
                        response.data?.entryFee ??
                        response.data?.amount
                    )

            if (Number.isFinite(value) && value > 0) {
                setEntryFee(value)
                setFeeInput(String(value))
            }
        } catch (err) {
            setFeeError(
                err.response?.data?.message ||
                'Unable to load entry fee settings. Check backend API.'
            )
        } finally {
            setFeeLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTeams()
        fetchEntryFee()
    }, [fetchTeams, fetchEntryFee])

    const saveEntryFee = async (event) => {
        event.preventDefault()

        const amount = Number(feeInput)

        if (!Number.isFinite(amount) || amount <= 0) {
            setFeeError('Please enter a valid entry fee.')
            setFeeSuccess('')
            return
        }

        if (!Number.isInteger(amount)) {
            setFeeError('Entry fee must be a whole number.')
            setFeeSuccess('')
            return
        }

        try {
            setFeeSaving(true)
            setFeeError('')
            setFeeSuccess('')

            const response = await api.put(
                '/admin/team-registration-settings/entry-fee',
                { entryFee: amount }
            )

            const savedAmount = Number(
                response.data?.entryFee ?? amount
            )

            setEntryFee(savedAmount)
            setFeeInput(String(savedAmount))
            setFeeSuccess('Entry fee updated successfully.')
        } catch (err) {
            setFeeError(
                err.response?.data?.message ||
                'Unable to update entry fee. Please try again.'
            )
        } finally {
            setFeeSaving(false)
        }
    }

    // Admin can change Team Status at any time.
    // APPROVED requires VERIFIED payment.
    const updateStatus = async (teamId, status) => {
        const action = status.toLowerCase()

        if (
            status === 'APPROVED' &&
            teams.find(t => t.id === teamId)?.paymentStatus !== 'VERIFIED'
        ) {
            window.alert('Please verify payment before approving this team.')
            return
        }

        if (!window.confirm(`Are you sure you want to set team status to ${action}?`)) {
            return
        }

        try {
            setUpdatingId(teamId)

            await api.put(
                `/admin/team-registrations/${teamId}/status`,
                null,
                { params: { status } }
            )

            await fetchTeams()
            window.alert(`Team status updated to ${status}.`)
        } catch (err) {
            window.alert(
                err.response?.data?.message ||
                err.message ||
                'Unable to update team status.'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    // Admin can manually set Payment Status to any of the three statuses.
    const updatePaymentStatus = async (teamId, status) => {
        if (!window.confirm(`Are you sure you want to set payment status to ${status}?`)) {
            return
        }

        try {
            setUpdatingId(teamId)

            await api.put(
                `/team-registrations/${teamId}/payment-status`,
                null,
                { params: { status } }
            )

            await fetchTeams()
            window.alert(`Payment status updated to ${status}.`)
        } catch (err) {
            window.alert(
                err.response?.data?.message ||
                err.message ||
                'Unable to update payment status.'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    const statusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
            case 'VERIFIED':
                return 'bg-green-500/15 text-green-400 border-green-500/30'

            case 'REJECTED':
                return 'bg-red-500/15 text-red-400 border-red-500/30'

            default:
                return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
        }
    }

    const actionButton = (label, status, currentStatus, onClick, color, icon) => (
        <button
            key={status}
            onClick={onClick}
            disabled={updatingId !== null || currentStatus === status}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${color}`}
        >
            {updatingId !== null ? (
                <RefreshCw size={16} className="animate-spin" />
            ) : icon}
            {label}
        </button>
    )

    return (
        <div className="min-h-screen bg-[#080f20] p-4 text-white sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Page Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                            Tournament Management
                        </p>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                            Team Registrations
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            View registered teams, player rosters and registration status.
                        </p>
                    </div>

                    <button
                        onClick={fetchTeams}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Entry Fee Settings */}
                <section className="rounded-xl border border-orange-500/25 bg-gradient-to-br from-[#17243b] to-[#111c31] p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-orange-500/15 p-2">
                                    <IndianRupee size={20} className="text-orange-400" />
                                </div>
                                <h2 className="text-lg font-bold">
                                    Team Entry Fee Settings
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-slate-400">
                                Manage the registration fee for upcoming team registrations.
                            </p>

                            <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Current Entry Fee
                                </p>
                                {feeLoading ? (
                                    <p className="mt-1 text-sm text-slate-400">Loading fee...</p>
                                ) : (
                                    <p className="mt-1 text-3xl font-bold text-orange-400">
                                        ₹{entryFee.toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <form onSubmit={saveEntryFee} className="w-full space-y-3 lg:max-w-md">
                            <label htmlFor="entryFee" className="block text-sm font-semibold text-slate-300">
                                Update Entry Fee (₹)
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <IndianRupee
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="entryFee"
                                        type="number"
                                        min="1"
                                        step="1"
                                        required
                                        value={feeInput}
                                        onChange={(e) => {
                                            setFeeInput(e.target.value)
                                            setFeeError('')
                                            setFeeSuccess('')
                                        }}
                                        placeholder="Enter entry fee"
                                        disabled={feeLoading || feeSaving}
                                        className="w-full rounded-lg border border-slate-700 bg-[#080f20] py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-orange-500 disabled:opacity-50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={feeLoading || feeSaving}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {feeSaving ? (
                                        <RefreshCw size={16} className="animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {feeSaving ? 'Saving...' : 'Update Fee'}
                                </button>
                            </div>

                            {feeError && <p className="text-xs text-red-400">{feeError}</p>}
                            {feeSuccess && (
                                <p className="text-xs text-green-400">
                                    <CheckCircle size={13} className="mr-1 inline" />
                                    {feeSuccess}
                                </p>
                            )}

                            <p className="text-xs leading-5 text-slate-500">
                                Updated fee will apply only to new team registrations.
                                Existing registrations will retain their original fee.
                            </p>
                        </form>
                    </div>
                </section>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-[#111c31] p-5">
                        <p className="text-sm text-slate-400">Total Teams</p>
                        <p className="mt-2 text-3xl font-bold">{teams.length}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#111c31] p-5">
                        <p className="text-sm text-slate-400">Approved Teams</p>
                        <p className="mt-2 text-3xl font-bold text-green-400">
                            {teams.filter(t => t.teamStatus === 'APPROVED').length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#111c31] p-5">
                        <p className="text-sm text-slate-400">Pending Teams</p>
                        <p className="mt-2 text-3xl font-bold text-yellow-400">
                            {teams.filter(t => !['APPROVED', 'REJECTED'].includes(t.teamStatus)).length}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* Team List */}
                {loading ? (
                    <div className="py-16 text-center text-slate-400">
                        <RefreshCw className="mx-auto mb-3 animate-spin" />
                        Loading registrations...
                    </div>
                ) : teams.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-[#111c31] py-16 text-center">
                        <Users className="mx-auto mb-3 text-slate-500" size={36} />
                        <h3 className="font-semibold">No Team Registrations Yet</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            New team registrations will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {teams.map(team => (
                            <div
                                key={team.id}
                                className="overflow-hidden rounded-xl border border-white/10 bg-[#111c31]"
                            >
                                {/* Team Summary */}
                                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-lg font-bold">{team.teamName}</h2>
                                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(team.teamStatus)}`}>
                                                {team.teamStatus || 'PENDING'}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {team.collegeUniversity}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                                            <span className="flex items-center gap-2">
                                                <Users size={14} className="text-orange-400" />
                                                {team.captainFullName}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <MapPin size={14} className="text-orange-400" />
                                                {team.city}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Mail size={14} className="text-orange-400" />
                                                {team.captainEmail}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(team.paymentStatus)}`}>
                                            Payment: {team.paymentStatus || 'PENDING'}
                                        </span>

                                        <button
                                            onClick={() => setExpandedId(expandedId === team.id ? null : team.id)}
                                            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                                        >
                                            {expandedId === team.id ? 'Hide Details' : 'View Details'}
                                            {expandedId === team.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === team.id && (
                                    <div className="border-t border-white/10 bg-[#0c172a] p-5">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <p className="text-xs text-slate-500">Captain Contact</p>
                                                <p className="mt-1 flex items-center gap-2 text-sm">
                                                    <Phone size={14} />
                                                    {team.captainContactNumber || '—'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">Entry Fee</p>
                                                <p className="mt-1 text-sm">
                                                    ₹{team.entryFee?.toLocaleString('en-IN') ?? '—'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">Payment Status</p>
                                                <p className="mt-1 text-sm">
                                                    {team.paymentStatus || 'PENDING'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment Status Management */}
                                        <div className="mt-6 rounded-xl border border-orange-500/20 bg-[#111c31] p-4 sm:p-5">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-white">Payment Management</h3>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Admin can manually update payment status after checking the transaction.
                                                    </p>
                                                </div>

                                                <span className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(team.paymentStatus)}`}>
                                                    {team.paymentStatus || 'PENDING'}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-3">
                                                {actionButton(
                                                    'Set Pending',
                                                    'PENDING',
                                                    team.paymentStatus || 'PENDING',
                                                    () => updatePaymentStatus(team.id, 'PENDING'),
                                                    'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
                                                    <RotateCcw size={16} />
                                                )}

                                                {actionButton(
                                                    'Verify Payment',
                                                    'VERIFIED',
                                                    team.paymentStatus,
                                                    () => updatePaymentStatus(team.id, 'VERIFIED'),
                                                    'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20',
                                                    <CheckCircle size={16} />
                                                )}

                                                {actionButton(
                                                    'Reject Payment',
                                                    'REJECTED',
                                                    team.paymentStatus,
                                                    () => updatePaymentStatus(team.id, 'REJECTED'),
                                                    'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20',
                                                    <XCircle size={16} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Player Roster */}
                                        <h3 className="mb-3 mt-6 font-semibold text-orange-400">
                                            Player Roster ({team.players?.length || 0})
                                        </h3>

                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[560px] text-left text-sm">
                                                <thead className="border-b border-white/10 text-slate-400">
                                                    <tr>
                                                        <th className="py-3 pr-4">Player</th>
                                                        <th className="py-3 pr-4">College ID</th>
                                                        <th className="py-3 pr-4">Jersey No.</th>
                                                        <th className="py-3">Contact</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {(team.players || []).map(player => (
                                                        <tr key={player.id} className="border-b border-white/5">
                                                            <td className="py-3 pr-4">{player.fullName}</td>
                                                            <td className="py-3 pr-4">{player.collegeId}</td>
                                                            <td className="py-3 pr-4">{player.jerseyNumber ?? '—'}</td>
                                                            <td className="py-3">{player.contactNumber || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Team Status Management */}
                                        <div className="mt-6 rounded-xl border border-white/10 bg-[#111c31] p-4 sm:p-5">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-white">Team Status Management</h3>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Admin can change team status at any time.
                                                        Approval requires verified payment.
                                                    </p>
                                                </div>

                                                <span className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(team.teamStatus)}`}>
                                                    {team.teamStatus || 'PENDING'}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-3">
                                                {actionButton(
                                                    'Set Pending',
                                                    'PENDING',
                                                    team.teamStatus || 'PENDING',
                                                    () => updateStatus(team.id, 'PENDING'),
                                                    'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
                                                    <RotateCcw size={16} />
                                                )}

                                                {actionButton(
                                                    'Approve Team',
                                                    'APPROVED',
                                                    team.teamStatus,
                                                    () => updateStatus(team.id, 'APPROVED'),
                                                    'bg-green-600 text-white hover:bg-green-700',
                                                    <CheckCircle size={16} />
                                                )}

                                                {actionButton(
                                                    'Reject Team',
                                                    'REJECTED',
                                                    team.teamStatus,
                                                    () => updateStatus(team.id, 'REJECTED'),
                                                    'bg-red-600 text-white hover:bg-red-700',
                                                    <XCircle size={16} />
                                                )}
                                            </div>

                                            {team.paymentStatus !== 'VERIFIED' && (
                                                <p className="mt-3 flex items-center gap-2 text-xs text-yellow-400">
                                                    <Clock size={14} />
                                                    Payment must be verified before approving this team.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
