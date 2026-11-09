
import { useEffect, useState } from 'react'
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    ClipboardList,
    Handshake,
    Film,
    Settings,
    Plus,
    Search,
    Trophy,
    Target,
    UserRound,
    TrendingUp,
    ArrowUpRight,
    ShieldCheck,
    Trash2,
    Pencil,
    X,
    RefreshCw,
    ExternalLink,
} from 'lucide-react'

import api from '../../services/api'

const SECTIONS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'matches', label: 'Matches', icon: CalendarDays },
    { id: 'scorecard', label: 'Scorecard', icon: ClipboardList },
    { id: 'sponsors', label: 'Sponsors', icon: Handshake },
    { id: 'highlights', label: 'Highlights', icon: Film },
    { id: 'settings', label: 'Settings', icon: Settings },
]

const EMPTY_SCHEDULE = {
    seriesName: '',
    matchName: '',
    venue: '',
    city: '',
    matchDate: '',
    matchTime: '',
    gmtTime: '',
    localTime: '',
    status: 'Upcoming',
}

const EMPTY_RESULT = {
    matchTitle: '',
    team1Name: '',
    team2Name: '',
    team1Score: '',
    team2Score: '',
    winner: '',
    resultSummary: '',
    matchDate: '',
}

const EMPTY_POINTS = {
    season: '2026',
    position: '',
    teamName: '',
    matchesPlayed: '',
    won: '',
    lost: '',
    tie: '',
    noResult: '',
    netRunRate: '',
    points: '',
}

const EMPTY_MEDIA = {
    title: '',
    description: '',
    youtubeUrl: '',
    category: 'Match Highlights',
}

const EMPTY_DETAILS = {
    tournamentName: '',
    description: '',
    venue: '',
    startDate: '',
    endDate: '',
    rules: '',
}

function SectionHeading({ eyebrow, title, description, action, onAction }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {description}
                </p>
            </div>

            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                    <Plus size={17} />
                    {action}
                </button>
            )}
        </div>
    )
}

function StatCard({ label, value, note, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-navy-900 p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
                    <p className="mt-2 text-xs text-slate-500">{note}</p>
                </div>
                <span className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                    <Icon size={21} />
                </span>
            </div>
        </div>
    )
}

function EmptyState({ title, description, action, onAction }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-12 text-center">
            <Trophy className="mx-auto text-orange-400" size={30} />
            <h3 className="mt-4 font-bold text-white">{title}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {description}
            </p>
            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
                >
                    <Plus size={16} />
                    {action}
                </button>
            )}
        </div>
    )
}

function Field({ label, value, onChange, placeholder = '', type = 'text', required = false }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </span>
            <input
                type={type}
                required={required}
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
            />
        </label>
    )
}

function TextAreaField({ label, value, onChange, placeholder = '', rows = 3 }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </span>
            <textarea
                rows={rows}
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full resize-y rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500"
            />
        </label>
    )
}

function SelectField({ label, value, onChange, options }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </span>
            <select
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    )
}

function ActionButtons({ onEdit, onDelete }) {
    return (
        <div className="flex items-center gap-2">
            {onEdit && (
                <button
                    type="button"
                    onClick={onEdit}
                    className="rounded-lg p-2 text-orange-300 hover:bg-orange-500/10"
                    title="Edit"
                >
                    <Pencil size={17} />
                </button>
            )}
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                    title="Delete"
                >
                    <Trash2 size={17} />
                </button>
            )}
        </div>
    )
}

export default function TournamentManagement() {
    const [activeSection, setActiveSection] = useState('overview')
    const [search, setSearch] = useState('')
    const [notice, setNotice] = useState('')
    const [loading, setLoading] = useState(false)

    const [teams, setTeams] = useState([])
    const [matches, setMatches] = useState([])
    const [results, setResults] = useState([])
    const [pointsTable, setPointsTable] = useState([])
    const [sponsors, setSponsors] = useState([])
    const [media, setMedia] = useState([])
    const [tournamentDetails, setTournamentDetails] = useState([])

    const [showMatchForm, setShowMatchForm] = useState(false)
    const [showResultForm, setShowResultForm] = useState(false)
    const [showPointsForm, setShowPointsForm] = useState(false)
    const [showMediaForm, setShowMediaForm] = useState(false)
    const [showDetailsForm, setShowDetailsForm] = useState(false)

    const [editingMatchId, setEditingMatchId] = useState(null)
    const [editingResultId, setEditingResultId] = useState(null)
    const [editingPointsId, setEditingPointsId] = useState(null)
    const [editingMediaId, setEditingMediaId] = useState(null)
    const [editingDetailsId, setEditingDetailsId] = useState(null)

    const [matchForm, setMatchForm] = useState(EMPTY_SCHEDULE)
    const [resultForm, setResultForm] = useState(EMPTY_RESULT)
    const [pointsForm, setPointsForm] = useState(EMPTY_POINTS)
    const [mediaForm, setMediaForm] = useState(EMPTY_MEDIA)
    const [detailsForm, setDetailsForm] = useState(EMPTY_DETAILS)

    const [selectedDetailsId, setSelectedDetailsId] = useState(null)

    const notify = (message) => {
        setNotice(message)
        window.setTimeout(() => setNotice(''), 3500)
    }

    const getErrorMessage = (error) =>
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'Something went wrong. Please try again.'

    const getList = (response) =>
        Array.isArray(response.data) ? response.data : []

    const loadTeams = async () => {
        const response = await api.get('/admin/team-registrations')
        setTeams(getList(response))
    }

    const loadMatches = async () => {
        const response = await api.get('/schedules')
        setMatches(getList(response))
    }

    const loadResults = async () => {
        const response = await api.get('/match-results')
        setResults(getList(response))
    }

    const loadPointsTable = async () => {
        const response = await api.get('/points-table')
        setPointsTable(getList(response))
    }

    const loadSponsors = async () => {
        const response = await api.get('/admin/sponsor-registrations')
        setSponsors(getList(response))
    }

    const loadMedia = async () => {
        const response = await api.get('/tournament-media')
        setMedia(getList(response))
    }

    const loadTournamentDetails = async () => {
        const response = await api.get('/tournament-details')
        setTournamentDetails(getList(response))
    }

    const loadAllData = async () => {
        setLoading(true)

        const tasks = [
            loadTeams,
            loadMatches,
            loadResults,
            loadPointsTable,
            loadSponsors,
            loadMedia,
            loadTournamentDetails,
        ]

        const responses = await Promise.allSettled(tasks.map((task) => task()))

        const failed = responses.filter((item) => item.status === 'rejected')

        if (failed.length > 0) {
            console.error('Tournament data loading errors:', failed)
            notify('Some data could not be loaded. Check backend/API connection.')
        }

        setLoading(false)
    }

    useEffect(() => {
        loadAllData()
    }, [])

    const refreshCurrentSection = async () => {
        try {
            setLoading(true)

            const loaders = {
                overview: loadAllData,
                teams: loadTeams,
                matches: loadMatches,
                scorecard: async () => {
                    await Promise.all([loadResults(), loadPointsTable()])
                },
                sponsors: loadSponsors,
                highlights: loadMedia,
                settings: loadTournamentDetails,
            }

            await loaders[activeSection]()
        } catch (error) {
            notify(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    const updateTeamStatus = async (id, status) => {
        try {
            await api.put(
                `/admin/team-registrations/${id}/status`,
                null,
                { params: { status } }
            )

            await loadTeams()
            notify(`Team ${status.toLowerCase()} successfully.`)
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const updateSponsorStatus = async (id, status) => {
        try {
            await api.put(
                `/admin/sponsor-registrations/${id}/status`,
                null,
                { params: { status } }
            )

            await loadSponsors()
            notify(`Sponsor ${status.toLowerCase()} successfully.`)
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const saveMatch = async (event) => {
        event.preventDefault()

        try {
            const payload = { ...matchForm }

            if (editingMatchId) {
                await api.put(`/schedules/${editingMatchId}`, payload)
                notify('Match schedule updated successfully.')
            } else {
                await api.post('/schedules', payload)
                notify('Match schedule created successfully.')
            }

            setShowMatchForm(false)
            setEditingMatchId(null)
            setMatchForm(EMPTY_SCHEDULE)
            await loadMatches()
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const editMatch = (match) => {
        setMatchForm({
            seriesName: match.seriesName || '',
            matchName: match.matchName || '',
            venue: match.venue || '',
            city: match.city || '',
            matchDate: match.matchDate || '',
            matchTime: match.matchTime || '',
            gmtTime: match.gmtTime || '',
            localTime: match.localTime || '',
            status: match.status || 'Upcoming',
        })

        setEditingMatchId(match.id)
        setShowMatchForm(true)
    }

    const deleteMatch = async (id) => {
        if (!window.confirm('Are you sure you want to delete this match schedule?')) return

        try {
            await api.delete(`/schedules/${id}`)
            await loadMatches()
            notify('Match schedule deleted successfully.')
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const saveResult = async (event) => {
        event.preventDefault()

        try {
            const payload = {
                ...resultForm,
                team1Score: Number(resultForm.team1Score),
                team2Score: Number(resultForm.team2Score),
                matchDate: resultForm.matchDate || null,
            }

            if (editingResultId) {
                await api.put(`/match-results/${editingResultId}`, payload)
                notify('Match result updated successfully.')
            } else {
                await api.post('/match-results', payload)
                notify('Match result added successfully.')
            }

            setShowResultForm(false)
            setEditingResultId(null)
            setResultForm(EMPTY_RESULT)
            await loadResults()
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const editResult = (result) => {
        setResultForm({
            matchTitle: result.matchTitle || '',
            team1Name: result.team1Name || '',
            team2Name: result.team2Name || '',
            team1Score: result.team1Score ?? '',
            team2Score: result.team2Score ?? '',
            winner: result.winner || '',
            resultSummary: result.resultSummary || '',
            matchDate: result.matchDate || '',
        })

        setEditingResultId(result.id)
        setShowResultForm(true)
    }

    const deleteResult = async (id) => {
        if (!window.confirm('Delete this match result?')) return

        try {
            await api.delete(`/match-results/${id}`)
            await loadResults()
            notify('Match result deleted successfully.')
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const savePoints = async (event) => {
        event.preventDefault()

        try {
            const payload = {
                ...pointsForm,
                position: Number(pointsForm.position || 0),
                matchesPlayed: Number(pointsForm.matchesPlayed || 0),
                won: Number(pointsForm.won || 0),
                lost: Number(pointsForm.lost || 0),
                tie: Number(pointsForm.tie || 0),
                noResult: Number(pointsForm.noResult || 0),
                netRunRate: Number(pointsForm.netRunRate || 0),
                points: Number(pointsForm.points || 0),
            }

            if (editingPointsId) {
                await api.put(`/points-table/${editingPointsId}`, payload)
                notify('Points table updated successfully.')
            } else {
                await api.post('/points-table', payload)
                notify('Points table entry added successfully.')
            }

            setShowPointsForm(false)
            setEditingPointsId(null)
            setPointsForm(EMPTY_POINTS)
            await loadPointsTable()
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const editPoints = (item) => {
        setPointsForm({
            season: item.season || '2026',
            position: item.position ?? '',
            teamName: item.teamName || '',
            matchesPlayed: item.matchesPlayed ?? '',
            won: item.won ?? '',
            lost: item.lost ?? '',
            tie: item.tie ?? '',
            noResult: item.noResult ?? '',
            netRunRate: item.netRunRate ?? '',
            points: item.points ?? '',
        })

        setEditingPointsId(item.id)
        setShowPointsForm(true)
    }

    const deletePoints = async (id) => {
        if (!window.confirm('Delete this points table entry?')) return

        try {
            await api.delete(`/points-table/${id}`)
            await loadPointsTable()
            notify('Points table entry deleted successfully.')
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const saveMedia = async (event) => {
        event.preventDefault()

        try {
            if (editingMediaId) {
                await api.put(`/tournament-media/${editingMediaId}`, mediaForm)
                notify('Video updated successfully.')
            } else {
                await api.post('/tournament-media', mediaForm)
                notify('Video added to highlights successfully.')
            }

            setShowMediaForm(false)
            setEditingMediaId(null)
            setMediaForm(EMPTY_MEDIA)
            await loadMedia()
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const editMedia = (item) => {
        setMediaForm({
            title: item.title || '',
            description: item.description || '',
            youtubeUrl: item.youtubeUrl || '',
            category: item.category || 'Match Highlights',
        })

        setEditingMediaId(item.id)
        setShowMediaForm(true)
    }

    const deleteMedia = async (id) => {
        if (!window.confirm('Delete this highlight video?')) return

        try {
            await api.delete(`/tournament-media/${id}`)
            await loadMedia()
            notify('Highlight video deleted successfully.')
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const saveDetails = async (event) => {
        event.preventDefault()

        try {
            const payload = {
                ...detailsForm,
                startDate: detailsForm.startDate || null,
                endDate: detailsForm.endDate || null,
            }

            if (editingDetailsId) {
                await api.put(`/tournament-details/${editingDetailsId}`, payload)
                notify('Tournament details updated successfully.')
            } else {
                await api.post('/tournament-details', payload)
                notify('Tournament details saved successfully.')
            }

            setShowDetailsForm(false)
            setEditingDetailsId(null)
            setDetailsForm(EMPTY_DETAILS)
            await loadTournamentDetails()
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const editDetails = (item) => {
        setDetailsForm({
            tournamentName: item.tournamentName || '',
            description: item.description || '',
            venue: item.venue || '',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            rules: item.rules || '',
        })

        setEditingDetailsId(item.id)
        setShowDetailsForm(true)
    }

    const deleteDetails = async (id) => {
        if (!window.confirm('Delete these tournament details?')) return

        try {
            await api.delete(`/tournament-details/${id}`)
            await loadTournamentDetails()
            notify('Tournament details deleted successfully.')
        } catch (error) {
            notify(getErrorMessage(error))
        }
    }

    const filteredTeams = teams.filter((team) =>
        `${team.teamName} ${team.captainFullName} ${team.collegeUniversity} ${team.city}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const filteredMatches = matches.filter((match) =>
        `${match.matchName} ${match.seriesName} ${match.venue} ${match.city}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const filteredSponsors = sponsors.filter((sponsor) =>
        `${sponsor.companyName} ${sponsor.contactFullName} ${sponsor.sponsorshipCategory}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const filteredResults = results.filter((result) =>
        `${result.matchTitle} ${result.team1Name} ${result.team2Name} ${result.winner}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const filteredMedia = media.filter((item) =>
        `${item.title} ${item.description} ${item.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const completedMatches = matches.filter((match) =>
        match.status?.toLowerCase() === 'completed'
    ).length

    const totalPlayers = teams.reduce(
        (total, team) => total + (team.players?.length || 0),
        0
    )

    const activeTournament = tournamentDetails[0]

    const openSection = (section) => {
        setActiveSection(section)
        setSearch('')
    }

    const navButton = (section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id

        return (
            <button
                key={section.id}
                type="button"
                onClick={() => openSection(section.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
            >
                <Icon size={17} />
                {section.label}
            </button>
        )
    }

    const SearchBar = ({ placeholder }) => (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-900 px-4">
            <Search size={18} className="text-slate-500" />
            <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
            />
        </div>
    )

    const FormActions = ({ onCancel, submitLabel }) => (
        <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button
                type="submit"
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold hover:bg-orange-600"
            >
                {submitLabel}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
            >
                Cancel
            </button>
        </div>
    )

    return (
        <main className="min-h-screen bg-[#0B1220] px-4 py-6 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
                            <ShieldCheck size={15} />
                            Administrator workspace
                        </div>
                        <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                            Tournament Management
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Manage tournament operations from one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start rounded-xl border border-white/10 bg-navy-900 px-4 py-3 sm:self-auto">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                            <Trophy size={21} />
                        </span>
                        <div>
                            <p className="font-bold">
                                {activeTournament?.tournamentName || 'Tournament'}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                {activeTournament?.startDate || 'Tournament Workspace'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notification */}
                {notice && (
                    <div
                        role="status"
                        className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200"
                    >
                        {String(notice)}
                        <button type="button" onClick={() => setNotice('')}>
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex min-w-max gap-2 rounded-2xl border border-white/10 bg-navy-900 p-2">
                        {SECTIONS.map(navButton)}
                    </div>
                </div>

                {/* Refresh */}
                <div className="mb-6 flex justify-end">
                    <button
                        type="button"
                        onClick={refreshCurrentSection}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-orange-500/40 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Loading...' : 'Refresh Data'}
                    </button>
                </div>

                {/* Overview */}
                {activeSection === 'overview' && (
                    <div className="space-y-8">
                        <SectionHeading
                            eyebrow="Tournament overview"
                            title="Welcome to your control centre"
                            description="Review actual tournament registrations, fixtures, results and sponsors."
                            action="Add Match"
                            onAction={() => {
                                setActiveSection('matches')
                                setShowMatchForm(true)
                            }}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                label="Registered Teams"
                                value={teams.length}
                                note="Actual team registrations"
                                icon={Users}
                            />
                            <StatCard
                                label="Total Matches"
                                value={matches.length}
                                note={`${completedMatches} completed`}
                                icon={CalendarDays}
                            />
                            <StatCard
                                label="Registered Players"
                                value={totalPlayers}
                                note="Players in registered teams"
                                icon={UserRound}
                            />
                            <StatCard
                                label="Sponsors"
                                value={sponsors.length}
                                note="Sponsor registrations"
                                icon={Handshake}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <section className="rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-6 xl:col-span-2">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold">Recent Fixtures</h2>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Tournament match schedule
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openSection('matches')}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-orange-400 hover:text-orange-300"
                                    >
                                        View all <ArrowUpRight size={15} />
                                    </button>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {matches.slice(0, 4).map((match) => (
                                        <div
                                            key={match.id}
                                            className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {match.matchName}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {match.seriesName} · {match.matchDate || 'Date TBA'}
                                                </p>
                                            </div>
                                            <span className="w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300">
                                                {match.status}
                                            </span>
                                        </div>
                                    ))}

                                    {matches.length === 0 && (
                                        <p className="py-8 text-center text-sm text-slate-400">
                                            No fixtures available.
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-6">
                                <h2 className="text-lg font-bold">Quick Actions</h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Common tournament tasks
                                </p>

                                <div className="mt-5 space-y-3">
                                    {[
                                        { label: 'Manage Teams', section: 'teams', icon: Users },
                                        { label: 'Create Match', section: 'matches', icon: CalendarDays },
                                        { label: 'Manage Sponsors', section: 'sponsors', icon: Handshake },
                                        { label: 'Add Match Result', section: 'scorecard', icon: ClipboardList },
                                        { label: 'Add Video Highlight', section: 'highlights', icon: Film },
                                        { label: 'Tournament Settings', section: 'settings', icon: Settings },
                                    ].map(({ label, section, icon: Icon }) => (
                                        <button
                                            key={section}
                                            type="button"
                                            onClick={() => {
                                                openSection(section)
                                                if (section === 'scorecard') setShowResultForm(true)
                                                if (section === 'highlights') setShowMediaForm(true)
                                            }}
                                            className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-orange-500/40 hover:bg-orange-500/5"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon size={17} className="text-orange-400" />
                                                {label}
                                            </span>
                                            <Plus size={16} className="text-slate-500" />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-5 rounded-xl bg-orange-500/10 p-4">
                                    <div className="flex items-center gap-2 text-sm font-bold text-orange-300">
                                        <TrendingUp size={17} />
                                        Live backend data
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Dashboard information is loaded from the ESCL backend APIs.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {/* Teams */}
                {activeSection === 'teams' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Team operations"
                            title="Registered Teams"
                            description="Review team registrations and approve or reject submitted applications."
                        />

                        <SearchBar placeholder="Search teams, captains, colleges or cities..." />

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="px-5 py-4">Team</th>
                                            <th className="px-5 py-4">Captain</th>
                                            <th className="px-5 py-4">Players</th>
                                            <th className="px-5 py-4">Entry Fee</th>
                                            <th className="px-5 py-4">Payment</th>
                                            <th className="px-5 py-4">Status</th>
                                            <th className="px-5 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredTeams.map((team) => (
                                            <tr key={team.id} className="hover:bg-white/[0.02]">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-white">
                                                        {team.teamName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {team.collegeUniversity} · {team.city}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4 text-slate-300">
                                                    {team.captainFullName}
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {team.captainEmail}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4 text-slate-300">
                                                    {team.players?.length || 0}
                                                </td>
                                                <td className="px-5 py-4 text-slate-300">
                                                    ₹{team.entryFee ?? 0}
                                                </td>
                                                <td className="px-5 py-4 text-slate-300">
                                                    {team.paymentStatus || 'PENDING'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                                                        {team.teamStatus || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateTeamStatus(team.id, 'APPROVED')}
                                                            className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateTeamStatus(team.id, 'REJECTED')}
                                                            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredTeams.length === 0 && (
                                <p className="p-8 text-center text-sm text-slate-400">
                                    No team registrations found.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Matches */}
                {activeSection === 'matches' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Fixtures and scheduling"
                            title="Matches"
                            description="Create and manage tournament fixtures using the Schedule API."
                            action="Create Match"
                            onAction={() => {
                                setEditingMatchId(null)
                                setMatchForm(EMPTY_SCHEDULE)
                                setShowMatchForm((value) => !value)
                            }}
                        />

                        {showMatchForm && (
                            <form
                                onSubmit={saveMatch}
                                className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:grid-cols-2"
                            >
                                <Field
                                    label="Series Name *"
                                    value={matchForm.seriesName}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, seriesName: value }))}
                                    required
                                />
                                <Field
                                    label="Match Name *"
                                    value={matchForm.matchName}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, matchName: value }))}
                                    placeholder="e.g. Pune Panthers vs Mumbai Strikers"
                                    required
                                />
                                <Field
                                    label="Venue *"
                                    value={matchForm.venue}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, venue: value }))}
                                    required
                                />
                                <Field
                                    label="City *"
                                    value={matchForm.city}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, city: value }))}
                                    required
                                />
                                <Field
                                    label="Match Date *"
                                    type="date"
                                    value={matchForm.matchDate}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, matchDate: value }))}
                                    required
                                />
                                <Field
                                    label="Match Time *"
                                    type="time"
                                    value={matchForm.matchTime}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, matchTime: value }))}
                                    required
                                />
                                <Field
                                    label="GMT Time *"
                                    value={matchForm.gmtTime}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, gmtTime: value }))}
                                    placeholder="e.g. 10:00 AM GMT"
                                    required
                                />
                                <Field
                                    label="Local Time *"
                                    value={matchForm.localTime}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, localTime: value }))}
                                    placeholder="e.g. 3:30 PM IST"
                                    required
                                />
                                <SelectField
                                    label="Match Status"
                                    value={matchForm.status}
                                    onChange={(value) => setMatchForm((current) => ({ ...current, status: value }))}
                                    options={[
                                        { label: 'Upcoming', value: 'Upcoming' },
                                        { label: 'Live', value: 'Live' },
                                        { label: 'Completed', value: 'Completed' },
                                        { label: 'Postponed', value: 'Postponed' },
                                    ]}
                                />
                                <FormActions
                                    submitLabel={editingMatchId ? 'Update Match' : 'Save Match'}
                                    onCancel={() => {
                                        setShowMatchForm(false)
                                        setEditingMatchId(null)
                                        setMatchForm(EMPTY_SCHEDULE)
                                    }}
                                />
                            </form>
                        )}

                        <SearchBar placeholder="Search matches, series, teams or venues..." />

                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {filteredMatches.map((match) => (
                                <article
                                    key={match.id}
                                    className="rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-6"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300">
                                            {match.seriesName}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {match.status}
                                        </span>
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold leading-7">
                                        {match.matchName}
                                    </h3>

                                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                                        <p className="flex items-center gap-2">
                                            <CalendarDays size={16} className="text-orange-400" />
                                            {match.matchDate} · {match.matchTime}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Target size={16} className="text-orange-400" />
                                            {match.venue}, {match.city}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            GMT: {match.gmtTime} · Local: {match.localTime}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex justify-end gap-3 border-t border-white/10 pt-4">
                                        <ActionButtons
                                            onEdit={() => editMatch(match)}
                                            onDelete={() => deleteMatch(match.id)}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredMatches.length === 0 && (
                            <EmptyState
                                title="No matches found"
                                description="Create a match schedule or change your search."
                                action="Create Match"
                                onAction={() => setShowMatchForm(true)}
                            />
                        )}
                    </div>
                )}

                {/* Scorecard */}
                {activeSection === 'scorecard' && (
                    <div className="space-y-8">
                        <SectionHeading
                            eyebrow="Match centre"
                            title="Scorecard & Results"
                            description="Manage match results and tournament points table."
                            action="Add Match Result"
                            onAction={() => {
                                setEditingResultId(null)
                                setResultForm(EMPTY_RESULT)
                                setShowResultForm(true)
                            }}
                        />

                        {showResultForm && (
                            <form
                                onSubmit={saveResult}
                                className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:grid-cols-2"
                            >
                                <Field
                                    label="Match Title *"
                                    value={resultForm.matchTitle}
                                    onChange={(value) => setResultForm((current) => ({ ...current, matchTitle: value }))}
                                    required
                                />
                                <Field
                                    label="Match Date"
                                    type="date"
                                    value={resultForm.matchDate}
                                    onChange={(value) => setResultForm((current) => ({ ...current, matchDate: value }))}
                                />
                                <Field
                                    label="Team 1 Name *"
                                    value={resultForm.team1Name}
                                    onChange={(value) => setResultForm((current) => ({ ...current, team1Name: value }))}
                                    required
                                />
                                <Field
                                    label="Team 2 Name *"
                                    value={resultForm.team2Name}
                                    onChange={(value) => setResultForm((current) => ({ ...current, team2Name: value }))}
                                    required
                                />
                                <Field
                                    label="Team 1 Score *"
                                    type="number"
                                    value={resultForm.team1Score}
                                    onChange={(value) => setResultForm((current) => ({ ...current, team1Score: value }))}
                                    required
                                />
                                <Field
                                    label="Team 2 Score *"
                                    type="number"
                                    value={resultForm.team2Score}
                                    onChange={(value) => setResultForm((current) => ({ ...current, team2Score: value }))}
                                    required
                                />
                                <Field
                                    label="Winner"
                                    value={resultForm.winner}
                                    onChange={(value) => setResultForm((current) => ({ ...current, winner: value }))}
                                    placeholder="Enter winning team"
                                />
                                <TextAreaField
                                    label="Result Summary"
                                    value={resultForm.resultSummary}
                                    onChange={(value) => setResultForm((current) => ({ ...current, resultSummary: value }))}
                                    placeholder="Enter match result summary"
                                />
                                <FormActions
                                    submitLabel={editingResultId ? 'Update Result' : 'Save Result'}
                                    onCancel={() => {
                                        setShowResultForm(false)
                                        setEditingResultId(null)
                                        setResultForm(EMPTY_RESULT)
                                    }}
                                />
                            </form>
                        )}

                        <section className="space-y-4">
                            <h2 className="text-lg font-bold">Match Results</h2>

                            <SearchBar placeholder="Search match results or teams..." />

                            {filteredResults.map((result) => (
                                <article
                                    key={result.id}
                                    className="rounded-2xl border border-white/10 bg-navy-900 p-5"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                                                {result.matchTitle}
                                            </p>
                                            <p className="mt-3 text-lg font-bold">
                                                {result.team1Name}
                                                <span className="mx-3 text-orange-400">vs</span>
                                                {result.team2Name}
                                            </p>
                                            <p className="mt-2 text-sm text-slate-400">
                                                {result.matchDate || 'Date not available'}
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-2xl font-extrabold text-white">
                                                {result.team1Score} - {result.team2Score}
                                            </p>
                                            <p className="mt-1 text-xs text-emerald-300">
                                                Winner: {result.winner || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>

                                    {result.resultSummary && (
                                        <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-400">
                                            {result.resultSummary}
                                        </p>
                                    )}

                                    <div className="mt-3 flex justify-end">
                                        <ActionButtons
                                            onEdit={() => editResult(result)}
                                            onDelete={() => deleteResult(result.id)}
                                        />
                                    </div>
                                </article>
                            ))}

                            {filteredResults.length === 0 && (
                                <EmptyState
                                    title="No match results"
                                    description="Add a match result to display it here."
                                    action="Add Match Result"
                                    onAction={() => setShowResultForm(true)}
                                />
                            )}
                        </section>

                        <section className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Points Table</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Manage tournament team standings.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingPointsId(null)
                                        setPointsForm(EMPTY_POINTS)
                                        setShowPointsForm((value) => !value)
                                    }}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold hover:bg-orange-600"
                                >
                                    <Plus size={17} />
                                    Add Points Entry
                                </button>
                            </div>

                            {showPointsForm && (
                                <form
                                    onSubmit={savePoints}
                                    className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:grid-cols-3"
                                >
                                    <Field label="Season *" value={pointsForm.season} onChange={(value) => setPointsForm((current) => ({ ...current, season: value }))} required />
                                    <Field label="Position" type="number" value={pointsForm.position} onChange={(value) => setPointsForm((current) => ({ ...current, position: value }))} />
                                    <Field label="Team Name *" value={pointsForm.teamName} onChange={(value) => setPointsForm((current) => ({ ...current, teamName: value }))} required />
                                    <Field label="Matches Played" type="number" value={pointsForm.matchesPlayed} onChange={(value) => setPointsForm((current) => ({ ...current, matchesPlayed: value }))} />
                                    <Field label="Won" type="number" value={pointsForm.won} onChange={(value) => setPointsForm((current) => ({ ...current, won: value }))} />
                                    <Field label="Lost" type="number" value={pointsForm.lost} onChange={(value) => setPointsForm((current) => ({ ...current, lost: value }))} />
                                    <Field label="Tie" type="number" value={pointsForm.tie} onChange={(value) => setPointsForm((current) => ({ ...current, tie: value }))} />
                                    <Field label="No Result" type="number" value={pointsForm.noResult} onChange={(value) => setPointsForm((current) => ({ ...current, noResult: value }))} />
                                    <Field label="Net Run Rate" type="number" value={pointsForm.netRunRate} onChange={(value) => setPointsForm((current) => ({ ...current, netRunRate: value }))} />
                                    <Field label="Points" type="number" value={pointsForm.points} onChange={(value) => setPointsForm((current) => ({ ...current, points: value }))} />

                                    <FormActions
                                        submitLabel={editingPointsId ? 'Update Entry' : 'Save Entry'}
                                        onCancel={() => {
                                            setShowPointsForm(false)
                                            setEditingPointsId(null)
                                            setPointsForm(EMPTY_POINTS)
                                        }}
                                    />
                                </form>
                            )}

                            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-900">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="px-4 py-4">Pos</th>
                                            <th className="px-4 py-4">Team</th>
                                            <th className="px-4 py-4">P</th>
                                            <th className="px-4 py-4">W</th>
                                            <th className="px-4 py-4">L</th>
                                            <th className="px-4 py-4">T</th>
                                            <th className="px-4 py-4">NR</th>
                                            <th className="px-4 py-4">NRR</th>
                                            <th className="px-4 py-4">Pts</th>
                                            <th className="px-4 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {pointsTable.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4 font-bold text-orange-400">
                                                    {item.position}
                                                </td>
                                                <td className="px-4 py-4 font-semibold">
                                                    {item.teamName}
                                                </td>
                                                <td className="px-4 py-4">{item.matchesPlayed}</td>
                                                <td className="px-4 py-4">{item.won}</td>
                                                <td className="px-4 py-4">{item.lost}</td>
                                                <td className="px-4 py-4">{item.tie}</td>
                                                <td className="px-4 py-4">{item.noResult}</td>
                                                <td className="px-4 py-4">{item.netRunRate}</td>
                                                <td className="px-4 py-4 font-bold text-emerald-300">
                                                    {item.points}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <ActionButtons
                                                        onEdit={() => editPoints(item)}
                                                        onDelete={() => deletePoints(item.id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {pointsTable.length === 0 && (
                                    <p className="p-8 text-center text-sm text-slate-400">
                                        No points table entries available.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {/* Sponsors */}
                {activeSection === 'sponsors' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Partnerships"
                            title="Sponsor Registrations"
                            description="Review sponsor applications and approve or reject registrations."
                        />

                        <SearchBar placeholder="Search sponsors, companies or contacts..." />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredSponsors.map((sponsor) => (
                                <article
                                    key={sponsor.id}
                                    className="rounded-2xl border border-white/10 bg-navy-900 p-5"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                        <Handshake size={22} />
                                    </span>

                                    <h3 className="mt-4 font-bold">
                                        {sponsor.companyName}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {sponsor.industry || 'Industry not specified'}
                                    </p>

                                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                                        <p>Contact: {sponsor.contactFullName}</p>
                                        <p>Email: {sponsor.businessEmail}</p>
                                        <p>Mobile: {sponsor.mobileNumber}</p>
                                        <p>Category: {sponsor.sponsorshipCategory}</p>
                                        <p>Budget: {sponsor.budgetRange}</p>
                                        <p>Contribution: {sponsor.contributionType}</p>
                                    </div>

                                    {sponsor.website && (
                                        <a
                                            href={sponsor.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-flex items-center gap-2 text-xs text-orange-300 hover:text-orange-200"
                                        >
                                            Visit Website <ExternalLink size={13} />
                                        </a>
                                    )}

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                                        <span className="text-xs font-semibold text-orange-300">
                                            {sponsor.status || 'PENDING'}
                                        </span>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateSponsorStatus(sponsor.id, 'APPROVED')}
                                                className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateSponsorStatus(sponsor.id, 'REJECTED')}
                                                className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredSponsors.length === 0 && (
                            <EmptyState
                                title="No sponsor registrations"
                                description="Sponsor applications submitted through the public registration form will appear here."
                            />
                        )}
                    </div>
                )}

                {/* Highlights */}
                {activeSection === 'highlights' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Media and moments"
                            title="Tournament Highlights"
                            description="Add and manage YouTube match highlights and tournament videos. These videos are stored in the Tournament Media backend module."
                            action="Add Video"
                            onAction={() => {
                                setEditingMediaId(null)
                                setMediaForm(EMPTY_MEDIA)
                                setShowMediaForm((value) => !value)
                            }}
                        />

                        {showMediaForm && (
                            <form
                                onSubmit={saveMedia}
                                className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:grid-cols-2"
                            >
                                <Field
                                    label="Video Title *"
                                    value={mediaForm.title}
                                    onChange={(value) => setMediaForm((current) => ({ ...current, title: value }))}
                                    placeholder="Enter video title"
                                    required
                                />

                                <SelectField
                                    label="Video Category"
                                    value={mediaForm.category}
                                    onChange={(value) => setMediaForm((current) => ({ ...current, category: value }))}
                                    options={[
                                        { label: 'Match Highlights', value: 'Match Highlights' },
                                        { label: 'Tournament Highlights', value: 'Tournament Highlights' },
                                        { label: 'Other', value: 'Other' },
                                    ]}
                                />

                                <div className="sm:col-span-2">
                                    <Field
                                        label="YouTube Video URL *"
                                        value={mediaForm.youtubeUrl}
                                        onChange={(value) => setMediaForm((current) => ({ ...current, youtubeUrl: value }))}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <TextAreaField
                                        label="Description"
                                        value={mediaForm.description}
                                        onChange={(value) => setMediaForm((current) => ({ ...current, description: value }))}
                                        placeholder="Write a short description..."
                                    />
                                </div>

                                <FormActions
                                    submitLabel={editingMediaId ? 'Update Video' : 'Add Video'}
                                    onCancel={() => {
                                        setShowMediaForm(false)
                                        setEditingMediaId(null)
                                        setMediaForm(EMPTY_MEDIA)
                                    }}
                                />
                            </form>
                        )}

                        <SearchBar placeholder="Search videos or categories..." />

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredMedia.map((item) => {
                                const videoId =
                                    item.youtubeUrl?.match(
                                        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/
                                    )?.[1]

                                return (
                                    <article
                                        key={item.id}
                                        className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900"
                                    >
                                        <div className="aspect-video bg-black">
                                            {videoId ? (
                                                <iframe
                                                    className="h-full w-full"
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    title={item.title}
                                                    allowFullScreen
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Film size={35} className="text-orange-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                                                {item.category || 'Highlight'}
                                            </span>

                                            <h3 className="mt-2 font-bold text-white">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                {item.description || 'No description available.'}
                                            </p>

                                            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                                                <a
                                                    href={item.youtubeUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-semibold text-orange-300 hover:text-orange-200"
                                                >
                                                    Watch on YouTube <ExternalLink size={13} />
                                                </a>

                                                <ActionButtons
                                                    onEdit={() => editMedia(item)}
                                                    onDelete={() => deleteMedia(item.id)}
                                                />
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>

                        {filteredMedia.length === 0 && (
                            <EmptyState
                                title="No highlights added"
                                description="Add your first YouTube video. It will be available in the tournament highlights section."
                                action="Add Video"
                                onAction={() => setShowMediaForm(true)}
                            />
                        )}
                    </div>
                )}

                {/* Settings */}
                {activeSection === 'settings' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Configuration"
                            title="Tournament Settings"
                            description="Manage tournament name, description, venue, dates and rules using Tournament Details API."
                            action="Add Tournament Details"
                            onAction={() => {
                                setEditingDetailsId(null)
                                setDetailsForm(EMPTY_DETAILS)
                                setShowDetailsForm(true)
                            }}
                        />

                        {showDetailsForm && (
                            <form
                                onSubmit={saveDetails}
                                className="space-y-5 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-7"
                            >
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Tournament Name *"
                                        value={detailsForm.tournamentName}
                                        onChange={(value) => setDetailsForm((current) => ({ ...current, tournamentName: value }))}
                                        placeholder="Tournament name"
                                        required
                                    />

                                    <Field
                                        label="Tournament Venue"
                                        value={detailsForm.venue}
                                        onChange={(value) => setDetailsForm((current) => ({ ...current, venue: value }))}
                                        placeholder="Main ground or city"
                                    />

                                    <Field
                                        label="Start Date"
                                        type="date"
                                        value={detailsForm.startDate}
                                        onChange={(value) => setDetailsForm((current) => ({ ...current, startDate: value }))}
                                    />

                                    <Field
                                        label="End Date"
                                        type="date"
                                        value={detailsForm.endDate}
                                        onChange={(value) => setDetailsForm((current) => ({ ...current, endDate: value }))}
                                    />
                                </div>

                                <TextAreaField
                                    label="Tournament Description"
                                    value={detailsForm.description}
                                    onChange={(value) => setDetailsForm((current) => ({ ...current, description: value }))}
                                    placeholder="Describe the tournament..."
                                    rows={4}
                                />

                                <TextAreaField
                                    label="Tournament Rules & Regulations"
                                    value={detailsForm.rules}
                                    onChange={(value) => setDetailsForm((current) => ({ ...current, rules: value }))}
                                    placeholder="Enter tournament rules and regulations..."
                                    rows={7}
                                />

                                <FormActions
                                    submitLabel={editingDetailsId ? 'Update Details' : 'Save Details'}
                                    onCancel={() => {
                                        setShowDetailsForm(false)
                                        setEditingDetailsId(null)
                                        setDetailsForm(EMPTY_DETAILS)
                                    }}
                                />
                            </form>
                        )}

                        <div className="space-y-4">
                            {tournamentDetails.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-6"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                {item.tournamentName}
                                            </h2>
                                            <p className="mt-2 text-sm text-slate-400">
                                                {item.venue || 'Venue not specified'}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {item.startDate || 'Start date TBA'}
                                                {' — '}
                                                {item.endDate || 'End date TBA'}
                                            </p>
                                        </div>

                                        <ActionButtons
                                            onEdit={() => editDetails(item)}
                                            onDelete={() => deleteDetails(item.id)}
                                        />
                                    </div>

                                    {item.description && (
                                        <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                                            {item.description}
                                        </p>
                                    )}

                                    {item.rules && (
                                        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                            <h3 className="font-bold text-orange-300">
                                                Rules & Regulations
                                            </h3>
                                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                                                {item.rules}
                                            </p>
                                        </div>
                                    )}
                                </article>
                            ))}

                            {tournamentDetails.length === 0 && (
                                <EmptyState
                                    title="Tournament details not configured"
                                    description="Add tournament information, venue, dates and rules to manage the tournament."
                                    action="Add Tournament Details"
                                    onAction={() => setShowDetailsForm(true)}
                                />
                            )}
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-navy-900 p-5">
                            <div className="flex items-center gap-2 text-sm font-bold text-orange-300">
                                <Film size={18} />
                                Tournament Videos
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Video management is available in the Highlights section. Videos added there are stored in the Tournament Media module and displayed together in Highlights.
                            </p>
                            <button
                                type="button"
                                onClick={() => openSection('highlights')}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold hover:bg-orange-600"
                            >
                                Manage Highlights <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
