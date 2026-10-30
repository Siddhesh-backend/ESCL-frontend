
import { useState } from 'react'
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
    MoreHorizontal,
    ArrowUpRight,
    ShieldCheck,
} from 'lucide-react'

const SECTIONS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'matches', label: 'Matches', icon: CalendarDays },
    { id: 'scorecard', label: 'Scorecard', icon: ClipboardList },
    { id: 'sponsors', label: 'Sponsors', icon: Handshake },
    { id: 'highlights', label: 'Highlights', icon: Film },
    { id: 'settings', label: 'Settings', icon: Settings },
]

const INITIAL_TEAMS = [
    { name: 'Pune Panthers', short: 'PP', captain: 'Captain not assigned', played: 0, status: 'Registered' },
    { name: 'Mumbai Strikers', short: 'MS', captain: 'Captain not assigned', played: 0, status: 'Registered' },
    { name: 'Nashik Warriors', short: 'NW', captain: 'Captain not assigned', played: 0, status: 'Registered' },
    { name: 'Kolhapur Kings', short: 'KK', captain: 'Captain not assigned', played: 0, status: 'Registered' },
]

const INITIAL_MATCHES = [
    { title: 'Match 01', teams: 'Pune Panthers vs Mumbai Strikers', date: '', venue: 'Venue to be announced', status: 'Upcoming' },
    { title: 'Match 02', teams: 'Nashik Warriors vs Kolhapur Kings', date: '', venue: 'Venue to be announced', status: 'Upcoming' },
]

const INITIAL_SPONSORS = [
    { name: 'No sponsors added', tier: 'Add your first sponsor', status: 'Pending' },
]

const EMPTY_SETTINGS = {
    name: 'ICCL 2026',
    season: '2026',
    venue: '',
    format: 'T20',
    teams: '8',
    overs: '20',
    status: 'Registration Open',
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

function Field({ label, value, onChange, placeholder = '', type = 'text' }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
            />
        </label>
    )
}

export default function TournamentManagement() {
    const [activeSection, setActiveSection] = useState('overview')
    const [teams, setTeams] = useState(INITIAL_TEAMS)
    const [matches, setMatches] = useState(INITIAL_MATCHES)
    const [sponsors, setSponsors] = useState(INITIAL_SPONSORS)
    const [settings, setSettings] = useState(EMPTY_SETTINGS)
    const [search, setSearch] = useState('')
    const [showTeamForm, setShowTeamForm] = useState(false)
    const [showMatchForm, setShowMatchForm] = useState(false)
    const [showSponsorForm, setShowSponsorForm] = useState(false)
    const [notice, setNotice] = useState('')
    const [teamForm, setTeamForm] = useState({ name: '', captain: '' })
    const [matchForm, setMatchForm] = useState({
        first: '',
        second: '',
        date: '',
        venue: '',
    })
    const [sponsorForm, setSponsorForm] = useState({
        name: '',
        tier: 'Associate',
    })

    const updateSetting = (key, value) => {
        setSettings((current) => ({ ...current, [key]: value }))
    }

    const notify = (message) => {
        setNotice(message)
        window.setTimeout(() => setNotice(''), 3000)
    }

    const addTeam = (event) => {
        event.preventDefault()
        const name = teamForm.name.trim()
        if (!name) return

        if (teams.some((team) => team.name.toLowerCase() === name.toLowerCase())) {
            notify('A team with this name already exists.')
            return
        }

        setTeams((current) => [
            ...current,
            {
                name,
                short: name.split(/\s+/).map((word) => word[0]).join('').slice(0, 3).toUpperCase(),
                captain: teamForm.captain.trim() || 'Not assigned',
                played: 0,
                status: 'Registered',
            },
        ])
        setTeamForm({ name: '', captain: '' })
        setShowTeamForm(false)
        notify('Team added to this dashboard.')
    }

    const addMatch = (event) => {
        event.preventDefault()
        if (!matchForm.first || !matchForm.second || matchForm.first === matchForm.second) {
            notify('Select two different teams.')
            return
        }

        setMatches((current) => [
            ...current,
            {
                title: `Match ${String(current.length + 1).padStart(2, '0')}`,
                teams: `${matchForm.first} vs ${matchForm.second}`,
                date: matchForm.date,
                venue: matchForm.venue.trim() || 'Venue to be announced',
                status: 'Upcoming',
            },
        ])
        setMatchForm({ first: '', second: '', date: '', venue: '' })
        setShowMatchForm(false)
        notify('Match added to this dashboard.')
    }

    const addSponsor = (event) => {
        event.preventDefault()
        const name = sponsorForm.name.trim()
        if (!name) return

        setSponsors((current) => {
            const withoutPlaceholder = current.filter((item) => item.name !== 'No sponsors added')
            return [...withoutPlaceholder, { ...sponsorForm, name, status: 'Pending' }]
        })
        setSponsorForm({ name: '', tier: 'Associate' })
        setShowSponsorForm(false)
        notify('Sponsor added to this dashboard.')
    }

    const filteredTeams = teams.filter((team) =>
        `${team.name} ${team.captain}`.toLowerCase().includes(search.toLowerCase())
    )

    const filteredMatches = matches.filter((match) =>
        `${match.title} ${match.teams} ${match.venue}`.toLowerCase().includes(search.toLowerCase())
    )

    const filteredSponsors = sponsors.filter((sponsor) =>
        `${sponsor.name} ${sponsor.tier}`.toLowerCase().includes(search.toLowerCase())
    )

    const completedMatches = matches.filter((match) => match.status === 'Completed').length

    const navButton = (section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id

        return (
            <button
                key={section.id}
                type="button"
                onClick={() => {
                    setActiveSection(section.id)
                    setSearch('')
                }}
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

    return (
        <main className="min-h-screen bg-[#0B1220] px-4 py-6 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page header */}
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
                            <p className="font-bold">{settings.name || 'Tournament'}</p>
                            <p className="mt-1 text-xs text-slate-400">{settings.season} Season</p>
                        </div>
                    </div>
                </div>

                {notice && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200"
                    >
                        {notice}
                    </div>
                )}

                {/* Section navigation */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex min-w-max gap-2 rounded-2xl border border-white/10 bg-navy-900 p-2">
                        {SECTIONS.map(navButton)}
                    </div>
                </div>

                {/* Overview */}
                {activeSection === 'overview' && (
                    <div className="space-y-8">
                        <SectionHeading
                            eyebrow="Tournament overview"
                            title="Welcome to your control centre"
                            description="Review tournament activity and manage your teams, fixtures, sponsors and match operations."
                            action="Add Team"
                            onAction={() => {
                                setActiveSection('teams')
                                setShowTeamForm(true)
                            }}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard label="Registered Teams" value={teams.length} note="Teams in this dashboard" icon={Users} />
                            <StatCard label="Total Matches" value={matches.length} note={`${completedMatches} completed`} icon={CalendarDays} />
                            <StatCard label="Players" value="—" note="Connect player data to display" icon={UserRound} />
                            <StatCard label="Sponsors" value={sponsors.filter((item) => item.name !== 'No sponsors added').length} note="Sponsors added here" icon={Handshake} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <section className="rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-6 xl:col-span-2">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold">Recent Fixtures</h2>
                                        <p className="mt-1 text-sm text-slate-400">Tournament match schedule</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection('matches')}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-orange-400 hover:text-orange-300"
                                    >
                                        View all <ArrowUpRight size={15} />
                                    </button>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {matches.slice(0, 4).map((match) => (
                                        <div key={match.title} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                                    <Trophy size={18} />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-semibold">{match.teams}</p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {match.title} · {match.date || 'Date to be announced'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300">
                                                {match.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-6">
                                <h2 className="text-lg font-bold">Quick Actions</h2>
                                <p className="mt-1 text-sm text-slate-400">Common tournament tasks</p>
                                <div className="mt-5 space-y-3">
                                    {[
                                        { label: 'Manage Teams', section: 'teams', icon: Users },
                                        { label: 'Create Match', section: 'matches', icon: CalendarDays },
                                        { label: 'Manage Sponsors', section: 'sponsors', icon: Handshake },
                                        { label: 'Tournament Settings', section: 'settings', icon: Settings },
                                    ].map(({ label, section, icon: Icon }) => (
                                        <button
                                            key={section}
                                            type="button"
                                            onClick={() => {
                                                setActiveSection(section)
                                                if (section === 'teams') setShowTeamForm(true)
                                                if (section === 'matches') setShowMatchForm(true)
                                                if (section === 'sponsors') setShowSponsorForm(true)
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
                                        Tournament workspace
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Data entered here is currently held in page state. Backend integration is not connected.
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
                            title="Teams"
                            description="Add and review tournament teams. These entries are temporary until backend integration."
                            action="Add Team"
                            onAction={() => setShowTeamForm((value) => !value)}
                        />

                        {showTeamForm && (
                            <form onSubmit={addTeam} className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:grid-cols-2">
                                <Field label="Team Name *" value={teamForm.name} onChange={(value) => setTeamForm((current) => ({ ...current, name: value }))} placeholder="e.g. Pune Panthers" />
                                <Field label="Captain Name" value={teamForm.captain} onChange={(value) => setTeamForm((current) => ({ ...current, captain: value }))} placeholder="Enter captain name" />
                                <div className="flex flex-wrap gap-3 sm:col-span-2">
                                    <button type="submit" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold hover:bg-orange-600">Save Team</button>
                                    <button type="button" onClick={() => setShowTeamForm(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Cancel</button>
                                </div>
                            </form>
                        )}

                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-900 px-4">
                            <Search size={18} className="text-slate-500" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search teams or captains..." className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500" />
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] text-left text-sm">
                                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                                        <tr><th className="px-5 py-4">Team</th><th className="px-5 py-4">Captain</th><th className="px-5 py-4">Played</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredTeams.map((team) => (
                                            <tr key={team.name} className="hover:bg-white/[0.02]">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-xs font-extrabold text-orange-400">{team.short}</span>
                                                        <span className="font-semibold text-white">{team.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-slate-400">{team.captain}</td>
                                                <td className="px-5 py-4 text-slate-300">{team.played}</td>
                                                <td className="px-5 py-4"><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">{team.status}</span></td>
                                                <td className="px-5 py-4">
                                                    <button type="button" aria-label={`Remove ${team.name}`} onClick={() => setTeams((current) => current.filter((item) => item.name !== team.name))} className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"><MoreHorizontal size={19} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredTeams.length === 0 && <p className="p-8 text-center text-sm text-slate-400">No teams match your search.</p>}
                        </div>
                    </div>
                )}

                {/* Matches */}
                {activeSection === 'matches' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Fixtures and scheduling"
                            title="Matches"
                            description="Create fixtures by selecting registered teams and entering the date and venue."
                            action="Create Match"
                            onAction={() => setShowMatchForm((value) => !value)}
                        />

                        {showMatchForm && (
                            <form onSubmit={addMatch} className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-300">First Team *</span>
                                    <select required value={matchForm.first} onChange={(event) => setMatchForm((current) => ({ ...current, first: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                                        <option value="">Select team</option>
                                        {teams.map((team) => <option key={team.name} value={team.name}>{team.name}</option>)}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-300">Second Team *</span>
                                    <select required value={matchForm.second} onChange={(event) => setMatchForm((current) => ({ ...current, second: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                                        <option value="">Select team</option>
                                        {teams.map((team) => <option key={team.name} value={team.name}>{team.name}</option>)}
                                    </select>
                                </label>
                                <Field label="Match Date" type="date" value={matchForm.date} onChange={(value) => setMatchForm((current) => ({ ...current, date: value }))} />
                                <Field label="Venue" value={matchForm.venue} onChange={(value) => setMatchForm((current) => ({ ...current, venue: value }))} placeholder="Enter venue" />
                                <div className="flex flex-wrap gap-3 sm:col-span-2">
                                    <button type="submit" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold hover:bg-orange-600">Save Match</button>
                                    <button type="button" onClick={() => setShowMatchForm(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Cancel</button>
                                </div>
                            </form>
                        )}

                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-900 px-4">
                            <Search size={18} className="text-slate-500" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search matches, teams or venues..." className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {filteredMatches.map((match) => (
                                <article key={match.title} className="rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300">{match.title}</span>
                                        <span className="text-xs text-slate-400">{match.status}</span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold leading-7">{match.teams}</h3>
                                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                                        <p className="flex items-center gap-2"><CalendarDays size={16} className="text-orange-400" />{match.date || 'Date to be announced'}</p>
                                        <p className="flex items-center gap-2"><Target size={16} className="text-orange-400" />{match.venue}</p>
                                    </div>
                                    <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                                        <button type="button" onClick={() => setMatches((current) => current.filter((item) => item.title !== match.title))} className="text-xs font-semibold text-red-300 hover:text-red-200">Remove fixture</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                        {filteredMatches.length === 0 && <EmptyState title="No matches found" description="Create a match or change your search." action="Create Match" onAction={() => setShowMatchForm(true)} />}
                    </div>
                )}

                {/* Scorecard */}
                {activeSection === 'scorecard' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Match centre"
                            title="Scorecard"
                            description="Scorecards will display innings, batting, bowling and match results once match-scoring functionality is connected."
                        />
                        <EmptyState
                            title="No scorecards available"
                            description="There is no match-scoring data connected yet. The scorecard engine can be integrated with the tournament's match and scoring APIs in a later step."
                        />
                    </div>
                )}

                {/* Sponsors */}
                {activeSection === 'sponsors' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Partnerships"
                            title="Sponsors"
                            description="Maintain a temporary list of tournament sponsors and their sponsorship tiers."
                            action="Add Sponsor"
                            onAction={() => setShowSponsorForm((value) => !value)}
                        />

                        {showSponsorForm && (
                            <form onSubmit={addSponsor} className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:grid-cols-2">
                                <Field label="Sponsor Name *" value={sponsorForm.name} onChange={(value) => setSponsorForm((current) => ({ ...current, name: value }))} placeholder="Enter company or sponsor name" />
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-300">Sponsorship Tier</span>
                                    <select value={sponsorForm.tier} onChange={(event) => setSponsorForm((current) => ({ ...current, tier: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                                        <option>Title</option>
                                        <option>Powered By</option>
                                        <option>Associate</option>
                                        <option>Official Partner</option>
                                    </select>
                                </label>
                                <div className="flex flex-wrap gap-3 sm:col-span-2">
                                    <button type="submit" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold hover:bg-orange-600">Save Sponsor</button>
                                    <button type="button" onClick={() => setShowSponsorForm(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Cancel</button>
                                </div>
                            </form>
                        )}

                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-900 px-4">
                            <Search size={18} className="text-slate-500" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sponsors..." className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredSponsors.map((sponsor, index) => (
                                <article key={`${sponsor.name}-${index}`} className="rounded-2xl border border-white/10 bg-navy-900 p-5">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400"><Handshake size={22} /></span>
                                    <h3 className="mt-4 font-bold">{sponsor.name}</h3>
                                    <p className="mt-2 text-sm text-slate-400">{sponsor.tier}</p>
                                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                                        <span className="text-xs text-orange-300">{sponsor.status}</span>
                                        {sponsor.name !== 'No sponsors added' && (
                                            <button type="button" onClick={() => setSponsors((current) => current.filter((item) => item !== sponsor))} className="text-xs font-semibold text-red-300 hover:text-red-200">Remove</button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {/* Highlights */}
                {activeSection === 'highlights' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Media and moments"
                            title="Highlights"
                            description="A dedicated area for tournament photos, videos and match highlights."
                        />
                        <EmptyState
                            title="No highlights added"
                            description="Media uploads and video links are not connected yet. This section is ready for a future media-management integration."
                        />
                    </div>
                )}

                {/* Settings */}
                {activeSection === 'settings' && (
                    <div className="space-y-6">
                        <SectionHeading
                            eyebrow="Configuration"
                            title="Tournament Settings"
                            description="Edit the basic tournament configuration for this dashboard preview."
                        />

                        <form
                            onSubmit={(event) => {
                                event.preventDefault()
                                notify('Settings updated in this dashboard session.')
                            }}
                            className="space-y-6 rounded-2xl border border-white/10 bg-navy-900 p-5 sm:p-7"
                        >
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <Field label="Tournament Name" value={settings.name} onChange={(value) => updateSetting('name', value)} placeholder="Tournament name" />
                                <Field label="Season / Year" value={settings.season} onChange={(value) => updateSetting('season', value)} placeholder="2026" />
                                <Field label="Tournament Venue" value={settings.venue} onChange={(value) => updateSetting('venue', value)} placeholder="Main ground or city" />
                                <Field label="Number of Teams" type="number" value={settings.teams} onChange={(value) => updateSetting('teams', value)} />
                                <Field label="Overs per Innings" type="number" value={settings.overs} onChange={(value) => updateSetting('overs', value)} />
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-300">Match Format</span>
                                    <select value={settings.format} onChange={(event) => updateSetting('format', event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                                        <option>T10</option>
                                        <option>T20</option>
                                        <option>ODI</option>
                                        <option>Test</option>
                                        <option>Custom</option>
                                    </select>
                                </label>
                                <label className="block sm:col-span-2">
                                    <span className="mb-2 block text-sm font-medium text-slate-300">Tournament Status</span>
                                    <select value={settings.status} onChange={(event) => updateSetting('status', event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-orange-500">
                                        <option>Draft</option>
                                        <option>Registration Open</option>
                                        <option>Registration Closed</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                                <button type="submit" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">Save Settings</button>
                                <button type="button" onClick={() => setSettings(EMPTY_SETTINGS)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Reset</button>
                            </div>
                            <p className="text-xs leading-5 text-slate-500">
                                Settings are held in page state only. Saving to the database requires backend API integration.
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </main>
    )
}
