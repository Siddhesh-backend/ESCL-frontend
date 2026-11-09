
import { useEffect, useState } from 'react'
import {
    Trophy,
    CalendarDays,
    MapPin,
    Users,
    ShieldCheck,
    ChevronRight,
    Medal,
    PlayCircle,
    Image as ImageIcon,
    ArrowUpRight,
    Target,
    Award,
    LoaderCircle,
    RefreshCw,
    Building2,
    ExternalLink,
    FileText,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const tabs = [
    'Overview',
    'Teams',
    'Fixtures & Results',
    'Points Table',
    'Sponsors',
    'Gallery',
]

const HERO_IMAGE = "url('/escl-stadium-hero.png')"

const teamGradients = [
    'from-orange-500 to-amber-400',
    'from-blue-600 to-cyan-400',
    'from-violet-600 to-purple-400',
    'from-emerald-600 to-green-400',
    'from-rose-600 to-pink-400',
    'from-sky-600 to-indigo-400',
]

const emptyData = {
    teams: [],
    sponsors: [],
    schedules: [],
    standings: [],
    tournamentDetails: null,
    results: [],
    media: [],
}

function getArray(data) {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.content)) return data.content
    if (Array.isArray(data?.data)) return data.data
    return []
}

function formatDate(value) {
    if (!value) return 'Date to be announced'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function formatTime(value) {
    if (!value) return ''

    const time = String(value)
    if (/AM|PM/i.test(time)) return time

    const match = time.match(/^(\d{1,2}):(\d{2})/)
    if (!match) return time

    const date = new Date()
    date.setHours(Number(match[1]), Number(match[2]), 0, 0)

    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

function getInitials(name = '') {
    return String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('') || 'ES'
}

function getYouTubeEmbedUrl(url = '') {
    if (!url) return null

    try {
        const parsed = new URL(url)
        let videoId = ''

        if (parsed.hostname.includes('youtu.be')) {
            videoId = parsed.pathname.split('/').filter(Boolean)[0]
        } else if (parsed.hostname.includes('youtube.com')) {
            videoId =
                parsed.searchParams.get('v') ||
                parsed.pathname.split('/').filter(Boolean).pop()
        }

        if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            return null
        }

        return `https://www.youtube-nocookie.com/embed/${videoId}`
    } catch {
        return null
    }
}

function parseMatchName(matchName = '') {
    const parts = String(matchName).split(/\s+(?:vs?\.?|v\/s)\s+/i)

    if (parts.length >= 2) {
        return {
            home: parts[0].trim(),
            away: parts.slice(1).join(' vs ').trim(),
        }
    }

    return {
        home: matchName || 'Match',
        away: '',
    }
}

function mapSchedule(schedule) {
    const parsed = parseMatchName(schedule.matchName)

    return {
        id: `schedule-${schedule.id}`,
        sourceId: schedule.id,
        title: schedule.matchName || 'Scheduled Match',
        round: schedule.seriesName || 'Tournament Match',
        home: parsed.home,
        away: parsed.away,
        date: formatDate(schedule.matchDate),
        rawDate: schedule.matchDate,
        time: formatTime(schedule.matchTime),
        venue: [schedule.venue, schedule.city].filter(Boolean).join(', '),
        status: String(schedule.status || '').toLowerCase().includes('complete')
            ? 'Completed'
            : 'Upcoming',
        score: '',
        resultSummary: '',
    }
}

function mapResult(result) {
    return {
        id: `result-${result.id}`,
        sourceId: result.id,
        title: result.matchTitle || 'Completed Match',
        round: 'Match Result',
        home: result.team1Name || 'Team 1',
        away: result.team2Name || 'Team 2',
        date: formatDate(result.matchDate),
        rawDate: result.matchDate,
        time: '',
        venue: '',
        status: 'Completed',
        score: `${result.team1Name}: ${result.team1Score ?? '-'} | ${result.team2Name}: ${result.team2Score ?? '-'}`,
        resultSummary: result.resultSummary || result.winner || '',
    }
}

function normalizeText(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function combineMatches(schedules, results) {
    const mappedResults = results.map(mapResult)
    const usedResults = new Set()

    const mappedSchedules = schedules.map((schedule) => {
        const mapped = mapSchedule(schedule)

        const resultIndex = mappedResults.findIndex((result, index) => {
            if (usedResults.has(index)) return false

            const sameTitle =
                normalizeText(result.title) === normalizeText(mapped.title)

            const sameDate =
                mapped.rawDate &&
                result.rawDate &&
                String(mapped.rawDate).slice(0, 10) ===
                String(result.rawDate).slice(0, 10)

            const sameTeams =
                normalizeText(mapped.home) &&
                normalizeText(mapped.away) &&
                normalizeText(result.home) === normalizeText(mapped.home) &&
                normalizeText(result.away) === normalizeText(mapped.away)

            return sameTitle || (sameDate && sameTeams)
        })

        if (resultIndex !== -1) {
            usedResults.add(resultIndex)

            return {
                ...mapped,
                ...mappedResults[resultIndex],
                id: mapped.id,
                venue: mapped.venue,
                time: mapped.time,
            }
        }

        return mapped
    })

    const unmatchedResults = mappedResults.filter(
        (_, index) => !usedResults.has(index)
    )

    return [...mappedSchedules, ...unmatchedResults].sort((a, b) => {
        if (!a.rawDate) return 1
        if (!b.rawDate) return -1
        return new Date(a.rawDate) - new Date(b.rawDate)
    })
}

function SectionTitle({ eyebrow, title, description }) {
    return (
        <div className="mb-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
                {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#f1eee7] sm:text-3xl">
                {title}
            </h2>
            {description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300/70">
                    {description}
                </p>
            )}
        </div>
    )
}

function TeamBadge({ team, size = 'md' }) {
    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${team.color || teamGradients[0]} font-black text-white shadow-lg ${size === 'lg'
                    ? 'h-14 w-14 text-lg'
                    : 'h-11 w-11 text-sm'
                }`}
        >
            {team.short || getInitials(team.name)}
        </div>
    )
}

function GlassCard({ children, className = '' }) {
    return (
        <div
            className={`rounded-2xl border border-white/10 bg-[#0b2038]/80 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:border-orange-400/25 ${className}`}
        >
            {children}
        </div>
    )
}

function StadiumSection({ children, id }) {
    return (
        <section
            id={id}
            className="escl-stadium-section relative isolate overflow-hidden rounded-3xl border border-white/10"
        >
            <div
                className="escl-section-background absolute inset-0 -z-20 bg-cover bg-center"
                style={{ backgroundImage: HERO_IMAGE }}
            />
            <div className="absolute inset-0 -z-10 bg-[#06172b]/95" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#071a31]/80 via-[#071a31]/90 to-[#101d30]/95" />
            <div className="pointer-events-none absolute -right-20 top-0 -z-10 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-28 left-0 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="relative p-5 sm:p-8 lg:p-10">
                {children}
            </div>
        </section>
    )
}

function EmptyState({ icon: Icon = ImageIcon, title, text }) {
    return (
        <div className="rounded-2xl border border-dashed border-orange-400/20 bg-orange-400/[0.04] px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                <Icon size={27} />
            </div>
            <h3 className="mt-4 font-display font-extrabold text-[#f1eee7]">
                {title}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300/60">
                {text}
            </p>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#0b2038]/80 p-8 text-sm text-slate-300/70">
            <LoaderCircle className="animate-spin text-orange-400" size={22} />
            Loading tournament information...
        </div>
    )
}

export default function Tournament() {
    const [activeTab, setActiveTab] = useState('Overview')
    const [matchFilter, setMatchFilter] = useState('All')
    const [data, setData] = useState(emptyData)
    const [loading, setLoading] = useState(true)
    const [apiErrors, setApiErrors] = useState([])

    const fetchTournamentData = async () => {
        setLoading(true)
        setApiErrors([])

        const endpoints = [
            ['Teams', '/team-registrations/public'],
            ['Sponsors', '/sponsor-registrations/public'],
            ['Schedules', '/schedules'],
            ['Points Table', '/points-table'],
            ['Tournament Details', '/tournament-details'],
            ['Match Results', '/match-results'],
            ['Tournament Media', '/tournament-media'],
        ]

        const responses = await Promise.allSettled(
            endpoints.map(([, endpoint]) => api.get(endpoint))
        )

        const nextData = { ...emptyData }
        const errors = []

        responses.forEach((response, index) => {
            const [label] = endpoints[index]

            if (response.status === 'rejected') {
                errors.push(label)
                return
            }

            const responseData = response.value.data

            switch (label) {
                case 'Teams':
                    nextData.teams = getArray(responseData)
                    break
                case 'Sponsors':
                    nextData.sponsors = getArray(responseData)
                    break
                case 'Schedules':
                    nextData.schedules = getArray(responseData)
                    break
                case 'Points Table':
                    nextData.standings = getArray(responseData)
                    break
                case 'Tournament Details':
                    nextData.tournamentDetails = Array.isArray(responseData)
                        ? responseData[0] || null
                        : responseData?.data || responseData
                    break
                case 'Match Results':
                    nextData.results = getArray(responseData)
                    break
                case 'Tournament Media':
                    nextData.media = getArray(responseData)
                    break
                default:
                    break
            }
        })

        setData(nextData)
        setApiErrors(errors)
        setLoading(false)
    }

    useEffect(() => {
        fetchTournamentData()
    }, [])

    const matches = combineMatches(data.schedules, data.results)

    const filteredMatches = matches.filter(
        (match) =>
            matchFilter === 'All' || match.status === matchFilter
    )

    const tournament = data.tournamentDetails
    const tournamentName =
        tournament?.tournamentName || 'Engineering Students Cricket League'

    const tournamentDates =
        tournament?.startDate || tournament?.endDate
            ? `${formatDate(tournament?.startDate)} – ${formatDate(tournament?.endDate)}`
            : 'Dates to be announced'

    const tournamentVenue =
        tournament?.venue || 'Venue to be announced'

    const upcomingMatches = matches
        .filter((match) => match.status === 'Upcoming')
        .slice(0, 2)

    const standings = [...data.standings].sort(
        (a, b) => Number(a.position || 0) - Number(b.position || 0)
    )

    const showSection = (tab) => {
        setActiveTab(tab)
        window.setTimeout(() => {
            document.getElementById('tournament-content')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }, 0)
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#071321] pb-12 text-[#f1eee7]">
            {/* Tournament hero */}
            <section className="escl-hero-background relative isolate overflow-hidden bg-[#06172b]">
                <div
                    className="absolute inset-0 -z-20 bg-cover bg-center"
                    style={{ backgroundImage: HERO_IMAGE }}
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06172b]/95 via-[#071a31]/85 to-[#071a31]/60" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071321] via-transparent to-[#06172b]/20" />
                <div
                    className="absolute inset-0 -z-10 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="escl-glow pointer-events-none absolute -right-20 top-0 -z-10 h-80 w-80 rounded-full bg-orange-500/15 blur-[100px]" />

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300/60">
                        <Link to="/" className="transition hover:text-orange-400">
                            Home
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-orange-400">Tournament</span>
                    </div>

                    <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                        <div className="escl-rise">
                            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-300">
                                <Trophy size={14} />
                                Engineering Students Cricket League
                            </div>

                            <h1 className="escl-rise mt-7 max-w-3xl font-display text-[2.8rem] font-black leading-[0.98] tracking-tight min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
                                <span className="escl-animated-heading">
                                    The Road to
                                </span>
                                <span className="mt-2 block pb-2">
                                    <span className="escl-animated-heading">
                                        Championship
                                    </span>
                                </span>
                            </h1>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/75 sm:text-base">
                                Follow the tournament journey — explore competing
                                teams, match fixtures, results, league standings
                                and the people supporting the game.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <button
                                    onClick={() => showSection('Fixtures & Results')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:bg-orange-400"
                                >
                                    <CalendarDays size={17} />
                                    View Fixtures
                                </button>
                                <button
                                    onClick={() => showSection('Points Table')}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-[#f1eee7] transition hover:border-orange-400/40 hover:bg-white/10"
                                >
                                    <Trophy size={17} />
                                    Points Table
                                </button>
                            </div>
                        </div>

                        <GlassCard className="escl-rise p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300/60">
                                    Tournament profile
                                </span>
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                                    Official Information
                                </span>
                            </div>

                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-950/30">
                                    <Trophy size={32} />
                                </div>
                                <div>
                                    <h2 className="font-display text-xl font-extrabold text-[#f7f3eb] sm:text-2xl">
                                        {tournamentName}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-300/65">
                                        Engineering Students Cricket League
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                                <InfoRow
                                    icon={CalendarDays}
                                    label="Tournament season"
                                    value={tournamentDates}
                                />
                                <InfoRow
                                    icon={MapPin}
                                    label="Venue"
                                    value={tournamentVenue}
                                />
                                <InfoRow
                                    icon={ShieldCheck}
                                    label="Tournament"
                                    value="Official Tournament"
                                />
                            </div>
                        </GlassCard>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            {
                                label: 'Participating Teams',
                                value: data.teams.length,
                                icon: Users,
                            },
                            {
                                label: 'Matches Listed',
                                value: matches.length,
                                icon: CalendarDays,
                            },
                            {
                                label: 'Points Table',
                                value: standings.length,
                                icon: Medal,
                            },
                            {
                                label: 'Official Sponsors',
                                value: data.sponsors.length,
                                icon: Award,
                            },
                        ].map(({ label, value, icon: Icon }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-white/10 bg-[#0b2038]/65 p-4 backdrop-blur-sm transition hover:border-orange-400/25 sm:p-5"
                            >
                                <Icon size={20} className="text-orange-400" />
                                <p className="mt-4 font-display text-xl font-extrabold text-[#f7f3eb] sm:text-2xl">
                                    {loading ? '—' : value}
                                </p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-300/55 sm:text-xs">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Page tabs */}
            <div className="sticky top-[72px] z-30 border-b border-white/10 bg-[#071321]/95 shadow-lg shadow-black/10 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-max gap-1 py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => showSection(tab)}
                                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === tab
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-950/20'
                                        : 'text-slate-300/65 hover:bg-white/5 hover:text-orange-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div
                id="tournament-content"
                className="mx-auto max-w-7xl scroll-mt-36 space-y-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
            >
                {apiErrors.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-amber-300">
                                Some tournament information could not be loaded.
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-300/60">
                                Check these APIs: {apiErrors.join(', ')}.
                                Other available information is still displayed.
                            </p>
                        </div>
                        <button
                            onClick={fetchTournamentData}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-400/20 px-4 py-2.5 text-sm font-bold text-amber-300 transition hover:bg-amber-400/10"
                        >
                            <RefreshCw size={15} />
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <LoadingState />
                ) : (
                    <>
                        {activeTab === 'Overview' && (
                            <>
                                <StadiumSection>
                                    <SectionTitle
                                        eyebrow="Tournament overview"
                                        title="Everything in one place"
                                        description={
                                            tournament?.description ||
                                            'Quick access to tournament information, participating teams, upcoming matches and current standings.'
                                        }
                                    />
                                    <div className="grid gap-5 md:grid-cols-3">
                                        <OverviewCard
                                            icon={Users}
                                            title="Meet the teams"
                                            text="Explore officially approved teams participating in the league."
                                            action="Explore teams"
                                            onClick={() => showSection('Teams')}
                                        />
                                        <OverviewCard
                                            icon={CalendarDays}
                                            title="Fixtures & results"
                                            text="Check upcoming match timings, venues and completed results."
                                            action="View matches"
                                            onClick={() => showSection('Fixtures & Results')}
                                        />
                                        <OverviewCard
                                            icon={Trophy}
                                            title="League standings"
                                            text="Follow the official points, wins and net run rate."
                                            action="View standings"
                                            onClick={() => showSection('Points Table')}
                                        />
                                    </div>
                                </StadiumSection>

                                {tournament?.rules && (
                                    <StadiumSection>
                                        <SectionTitle
                                            eyebrow="Tournament guidelines"
                                            title="Rules & regulations"
                                            description="Official tournament information and playing guidelines."
                                        />
                                        <div className="flex gap-3 rounded-2xl border border-orange-400/15 bg-orange-400/[0.05] p-5">
                                            <FileText className="mt-1 shrink-0 text-orange-400" size={22} />
                                            <p className="whitespace-pre-line text-sm leading-7 text-slate-200/75">
                                                {tournament.rules}
                                            </p>
                                        </div>
                                    </StadiumSection>
                                )}

                                <StadiumSection>
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <SectionTitle
                                            eyebrow="Next on the pitch"
                                            title="Upcoming matches"
                                            description="Keep track of the next fixtures in the tournament."
                                        />
                                        <button
                                            onClick={() => showSection('Fixtures & Results')}
                                            className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-orange-400 transition hover:text-orange-300"
                                        >
                                            All fixtures <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    {upcomingMatches.length > 0 ? (
                                        <div className="grid gap-4 lg:grid-cols-2">
                                            {upcomingMatches.map((match) => (
                                                <MatchCard key={match.id} match={match} />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={CalendarDays}
                                            title="No upcoming matches"
                                            text="Upcoming fixtures will appear here once they are published."
                                        />
                                    )}
                                </StadiumSection>

                                <StadiumSection>
                                    <SectionTitle
                                        eyebrow="Current standings"
                                        title="Points table"
                                        description="Official league standings updated from tournament records."
                                    />
                                    {standings.length > 0 ? (
                                        <PointsTable standings={standings} />
                                    ) : (
                                        <EmptyState
                                            icon={Trophy}
                                            title="Points table not available"
                                            text="Official standings will appear here once tournament points are added."
                                        />
                                    )}
                                    <div className="mt-4 text-right">
                                        <button
                                            onClick={() => showSection('Points Table')}
                                            className="inline-flex items-center gap-1 text-sm font-bold text-orange-400 hover:text-orange-300"
                                        >
                                            Full points table <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </StadiumSection>

                                <StadiumSection>
                                    <SectionTitle
                                        eyebrow="Our partners"
                                        title="Supported by our sponsors"
                                        description="Meet the approved partners supporting the league and its players."
                                    />
                                    <SponsorGrid sponsors={data.sponsors} />
                                </StadiumSection>
                            </>
                        )}

                        {activeTab === 'Teams' && (
                            <StadiumSection>
                                <SectionTitle
                                    eyebrow="The contenders"
                                    title="Participating teams"
                                    description="Teams approved by the tournament administration."
                                />

                                {data.teams.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {data.teams.map((team, index) => (
                                            <GlassCard
                                                key={team.id}
                                                className="p-5"
                                            >
                                                <TeamBadge
                                                    team={{
                                                        name: team.teamName,
                                                        color: teamGradients[index % teamGradients.length],
                                                    }}
                                                    size="lg"
                                                />
                                                <h3 className="mt-4 font-display text-lg font-extrabold text-[#f1eee7]">
                                                    {team.teamName}
                                                </h3>
                                                <div className="mt-3 flex items-start gap-2 text-sm text-slate-300/60">
                                                    <Building2
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-orange-400"
                                                    />
                                                    <span>
                                                        {team.collegeUniversity || 'College not specified'}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-300/60">
                                                    <MapPin
                                                        size={16}
                                                        className="shrink-0 text-orange-400"
                                                    />
                                                    <span>{team.city || 'City not specified'}</span>
                                                </div>
                                                <div className="mt-5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] p-3">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                                                        <ShieldCheck
                                                            size={14}
                                                            className="mr-1 inline"
                                                        />
                                                        Approved Team
                                                    </p>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={Users}
                                        title="No approved teams yet"
                                        text="Approved team registrations will appear here."
                                    />
                                )}
                            </StadiumSection>
                        )}

                        {activeTab === 'Fixtures & Results' && (
                            <StadiumSection>
                                <SectionTitle
                                    eyebrow="Match centre"
                                    title="Fixtures & results"
                                    description="Browse upcoming matches and completed match results."
                                />

                                <div className="mb-5 flex flex-wrap gap-2">
                                    {['All', 'Upcoming', 'Completed'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setMatchFilter(filter)}
                                            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${matchFilter === filter
                                                    ? 'bg-orange-500 text-white'
                                                    : 'border border-white/10 bg-white/5 text-slate-300/70 hover:border-orange-400/30'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                {filteredMatches.length > 0 ? (
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {filteredMatches.map((match) => (
                                            <MatchCard
                                                key={match.id}
                                                match={match}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={CalendarDays}
                                        title="No matches found"
                                        text="There are no matches available for this filter right now."
                                    />
                                )}
                            </StadiumSection>
                        )}

                        {activeTab === 'Points Table' && (
                            <StadiumSection>
                                <SectionTitle
                                    eyebrow="League standings"
                                    title="Points table"
                                    description="Official tournament standings."
                                />
                                {standings.length > 0 ? (
                                    <PointsTable standings={standings} />
                                ) : (
                                    <EmptyState
                                        icon={Trophy}
                                        title="Points table not available"
                                        text="Standings will appear here once the administrator adds the points table."
                                    />
                                )}
                                <p className="mt-3 text-xs text-slate-300/45">
                                    P: Played · W: Won · L: Lost · T: Tie · NR: No Result · Pts: Points · NRR: Net Run Rate
                                </p>
                            </StadiumSection>
                        )}

                        {activeTab === 'Sponsors' && (
                            <>
                                <StadiumSection>
                                    <SectionTitle
                                        eyebrow="Our partners"
                                        title="Sponsors & partners"
                                        description="Official sponsors and partners approved by the tournament administration."
                                    />
                                    <SponsorGrid sponsors={data.sponsors} />
                                </StadiumSection>

                                <div className="rounded-3xl border border-white/10 bg-[#0b2038] p-6 sm:p-8">
                                    <h3 className="font-display text-xl font-extrabold text-[#f1eee7]">
                                        Partner with ESCL
                                    </h3>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300/65">
                                        Interested in supporting the league? Submit your sponsorship enquiry to the organising team.
                                    </p>
                                    <Link
                                        to="/sponsor-registration"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
                                    >
                                        Become a sponsor <ChevronRight size={17} />
                                    </Link>
                                </div>
                            </>
                        )}

                        {activeTab === 'Gallery' && (
                            <StadiumSection>
                                <SectionTitle
                                    eyebrow="Tournament media"
                                    title="Highlights & gallery"
                                    description="Watch official tournament highlights and videos."
                                />

                                {data.media.length > 0 ? (
                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {data.media.map((media) => {
                                            const embedUrl = getYouTubeEmbedUrl(media.youtubeUrl)

                                            return (
                                                <GlassCard
                                                    key={media.id}
                                                    className="overflow-hidden"
                                                >
                                                    {embedUrl ? (
                                                        <div className="aspect-video bg-black">
                                                            <iframe
                                                                src={embedUrl}
                                                                title={media.title || 'Tournament highlight'}
                                                                className="h-full w-full"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex aspect-video items-center justify-center bg-[#102742]">
                                                            <PlayCircle
                                                                size={48}
                                                                className="text-orange-400"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="p-5">
                                                        {media.category && (
                                                            <span className="rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-300">
                                                                {media.category}
                                                            </span>
                                                        )}
                                                        <h3 className="mt-3 font-display font-extrabold text-[#f1eee7]">
                                                            {media.title || 'Tournament Highlight'}
                                                        </h3>
                                                        {media.description && (
                                                            <p className="mt-2 text-sm leading-6 text-slate-300/60">
                                                                {media.description}
                                                            </p>
                                                        )}
                                                        {media.youtubeUrl && (
                                                            <a
                                                                href={media.youtubeUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300"
                                                            >
                                                                Watch on YouTube
                                                                <ExternalLink size={15} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </GlassCard>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={PlayCircle}
                                        title="Highlights coming soon"
                                        text="Tournament videos and match highlights will appear here once they are published."
                                    />
                                )}
                            </StadiumSection>
                        )}
                    </>
                )}
            </div>

            {/* Registration CTA */}
            <section className="mx-4 overflow-hidden rounded-3xl border border-white/10 bg-[#0b2038] sm:mx-6 lg:mx-auto lg:max-w-7xl">
                <div className="relative isolate flex flex-col gap-6 overflow-hidden p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
                    <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-60 w-60 rounded-full bg-orange-500/10 blur-[80px]" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                            Be part of the league
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-extrabold text-[#f1eee7] sm:text-3xl">
                            Ready to play or partner with us?
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300/65">
                            Explore registration options and become part of the ESCL community.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/team-registration"
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
                        >
                            Register your team <ChevronRight size={16} />
                        </Link>
                        <Link
                            to="/sponsor-registration"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-[#f1eee7] transition hover:border-orange-400/30 hover:bg-white/5"
                        >
                            Become a sponsor <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <Icon size={18} className="shrink-0 text-orange-400" />
            <div>
                <p className="text-xs text-slate-300/45">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#f1eee7]">
                    {value}
                </p>
            </div>
        </div>
    )
}

function OverviewCard({ icon: Icon, title, text, action, onClick }) {
    return (
        <button
            onClick={onClick}
            className="group rounded-2xl border border-white/10 bg-[#0b2038]/75 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-[#102742]"
        >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition group-hover:bg-orange-500 group-hover:text-white">
                <Icon size={22} />
            </div>
            <h3 className="mt-4 font-display font-extrabold text-[#f1eee7]">
                {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300/65">
                {text}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-400">
                {action} <ArrowUpRight size={16} />
            </span>
        </button>
    )
}

function MatchCard({ match }) {
    const completed = match.status === 'Completed'

    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b2038]/85 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-orange-400/25">
            <div className="flex items-center justify-between gap-3 bg-[#102742] px-5 py-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300/45">
                        {match.round}
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-[#f1eee7]">
                        {match.title}
                    </p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${completed
                            ? 'bg-emerald-400/10 text-emerald-300'
                            : 'bg-orange-400/10 text-orange-300'
                        }`}
                >
                    {match.status}
                </span>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-sm font-black text-orange-300">
                            {getInitials(match.home)}
                        </div>
                        <p className="mt-2 break-words text-sm font-extrabold text-[#f1eee7]">
                            {match.home}
                        </p>
                    </div>

                    <span className="text-xs font-black text-slate-400/50">
                        VS
                    </span>

                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-black text-blue-300">
                            {match.away ? getInitials(match.away) : '—'}
                        </div>
                        <p className="mt-2 break-words text-sm font-extrabold text-[#f1eee7]">
                            {match.away || 'Opponent TBA'}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2.5 text-sm text-slate-300/65">
                        <CalendarDays
                            size={16}
                            className="mt-0.5 shrink-0 text-orange-400"
                        />
                        <span>
                            {match.date}
                            {match.time && (
                                <span className="mt-1 block text-xs text-slate-300/45">
                                    {match.time}
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm text-slate-300/65">
                        <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-orange-400"
                        />
                        <span>{match.venue || 'Venue to be announced'}</span>
                    </div>
                </div>

                {match.score && (
                    <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-[#f1eee7]">
                        {match.score}
                    </p>
                )}

                {match.resultSummary && (
                    <p className="mt-2 rounded-xl border border-emerald-400/10 bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300">
                        {match.resultSummary}
                    </p>
                )}
            </div>
        </article>
    )
}

function PointsTable({ standings }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b2038]/90 shadow-lg shadow-black/10">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[#102742] text-[#f1eee7]">
                        <tr>
                            {['Pos', 'Team', 'P', 'W', 'L', 'T', 'NR', 'Pts', 'NRR'].map((heading) => (
                                <th
                                    key={heading}
                                    className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-300/70"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {standings.map((row, index) => (
                            <tr
                                key={row.id || `${row.teamName}-${row.position || index}`}
                                className="transition hover:bg-orange-400/5"
                            >
                                <td className="px-5 py-4">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${Number(row.position) === 1
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-white/5 text-slate-300'
                                            }`}
                                    >
                                        {row.position ?? index + 1}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-4 font-extrabold text-[#f1eee7]">
                                    {row.teamName}
                                </td>
                                <td className="px-5 py-4 text-slate-300/75">
                                    {row.matchesPlayed ?? 0}
                                </td>
                                <td className="px-5 py-4 font-bold text-emerald-400">
                                    {row.won ?? 0}
                                </td>
                                <td className="px-5 py-4 text-rose-300">
                                    {row.lost ?? 0}
                                </td>
                                <td className="px-5 py-4 text-slate-300/75">
                                    {row.tie ?? 0}
                                </td>
                                <td className="px-5 py-4 text-slate-300/75">
                                    {row.noResult ?? 0}
                                </td>
                                <td className="px-5 py-4 font-black text-orange-400">
                                    {row.points ?? 0}
                                </td>
                                <td className="px-5 py-4 font-semibold text-slate-300/75">
                                    {row.netRunRate ?? '0.00'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function SponsorGrid({ sponsors }) {
    if (!sponsors.length) {
        return (
            <EmptyState
                icon={Target}
                title="Sponsors will be announced soon"
                text="Official sponsors will appear here once their registrations are approved."
            />
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
                <GlassCard
                    key={sponsor.id}
                    className="flex min-h-40 flex-col items-center justify-center p-6 text-center"
                >
                    <span className="rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-300">
                        {sponsor.sponsorshipCategory || 'Official Partner'}
                    </span>

                    <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <Target size={23} />
                    </div>

                    <h3 className="mt-3 font-display text-lg font-extrabold tracking-wide text-[#f1eee7]">
                        {sponsor.companyName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-300/55">
                        {sponsor.industry}
                    </p>

                    {sponsor.contributionType && (
                        <p className="mt-2 text-xs text-orange-300/75">
                            {sponsor.contributionType}
                        </p>
                    )}

                    {sponsor.website && (
                        <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300"
                        >
                            Visit Website <ExternalLink size={13} />
                        </a>
                    )}
                </GlassCard>
            ))}
        </div>
    )
}
