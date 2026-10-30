
import { useState } from 'react'
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
} from 'lucide-react'
import { Link } from 'react-router-dom'

const teams = [
    { name: 'Titans XI', short: 'TX', color: 'from-orange-500 to-amber-400', played: 4, points: 8 },
    { name: 'Warriors CC', short: 'WC', color: 'from-blue-600 to-cyan-400', played: 4, points: 6 },
    { name: 'Royal Strikers', short: 'RS', color: 'from-violet-600 to-purple-400', played: 4, points: 4 },
    { name: 'Thunder Hawks', short: 'TH', color: 'from-emerald-600 to-green-400', played: 4, points: 2 },
]

const matches = [
    { id: 1, round: 'MATCH 09', home: 'Titans XI', away: 'Warriors CC', date: 'Oct 25, 2026', time: '09:00 AM', venue: 'Main Cricket Ground', status: 'Upcoming', score: '' },
    { id: 2, round: 'MATCH 10', home: 'Royal Strikers', away: 'Thunder Hawks', date: 'Oct 25, 2026', time: '01:30 PM', venue: 'Main Cricket Ground', status: 'Upcoming', score: '' },
    { id: 3, round: 'MATCH 08', home: 'Warriors CC', away: 'Royal Strikers', date: 'Oct 20, 2026', time: '10:00 AM', venue: 'College Cricket Ground', status: 'Completed', score: 'Warriors CC won' },
]

const standings = [
    { pos: 1, name: 'Titans XI', p: 4, w: 4, l: 0, pts: 8, nrr: '+1.85' },
    { pos: 2, name: 'Warriors CC', p: 4, w: 3, l: 1, pts: 6, nrr: '+0.92' },
    { pos: 3, name: 'Royal Strikers', p: 4, w: 2, l: 2, pts: 4, nrr: '+0.18' },
    { pos: 4, name: 'Thunder Hawks', p: 4, w: 1, l: 3, pts: 2, nrr: '-0.76' },
]

const sponsors = [
    { name: 'Title Sponsor', brand: 'YOUR BRAND', tier: 'TITLE PARTNER' },
    { name: 'Powered By', brand: 'SPORTS CO.', tier: 'POWERED BY' },
    { name: 'Associate Partner', brand: 'CAMPUS PRO', tier: 'ASSOCIATE' },
]

const tabs = ['Overview', 'Teams', 'Fixtures & Results', 'Points Table', 'Sponsors', 'Gallery']

const HERO_IMAGE = "url('/escl-stadium-hero.png')"

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
        <div className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${team.color} font-black text-white shadow-lg ${size === 'lg' ? 'h-14 w-14 text-lg' : 'h-11 w-11 text-sm'}`}>
            {team.short}
        </div>
    )
}

function GlassCard({ children, className = '' }) {
    return (
        <div className={`rounded-2xl border border-white/10 bg-[#0b2038]/80 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:border-orange-400/25 ${className}`}>
            {children}
        </div>
    )
}

function StadiumSection({ children, id }) {
    return (
        <section id={id} className="escl-stadium-section relative isolate overflow-hidden rounded-3xl border border-white/10">
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

export default function Tournament() {
    const [activeTab, setActiveTab] = useState('Overview')
    const [matchFilter, setMatchFilter] = useState('All')

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
                <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: HERO_IMAGE }} />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06172b]/95 via-[#071a31]/85 to-[#071a31]/60" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071321] via-transparent to-[#06172b]/20" />
                <div className="absolute inset-0 -z-10 opacity-[0.06]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }} />
                <div className="escl-glow pointer-events-none absolute -right-20 top-0 -z-10 h-80 w-80 rounded-full bg-orange-500/15 blur-[100px]" />

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300/60">
                        <Link to="/" className="transition hover:text-orange-400">Home</Link>
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
                                <span className="escl-animated-heading">The Road to</span>

                                <span className="mt-2 block pb-2">
                                    <span className="escl-animated-heading">Championship</span>
                                </span>
                            </h1>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/75 sm:text-base">
                                Follow the tournament journey — explore competing teams, match fixtures,
                                results, league standings and the people supporting the game.
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
                                    Demo Preview
                                </span>
                            </div>

                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-950/30">
                                    <Trophy size={32} />
                                </div>
                                <div>
                                    <h2 className="font-display text-xl font-extrabold text-[#f7f3eb] sm:text-2xl">
                                        ESCL Season 6
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-300/65">
                                        Engineering Students Cricket League
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                                <InfoRow icon={CalendarDays} label="Tournament season" value="2026 Season · Sample dates" />
                                <InfoRow icon={MapPin} label="Venue" value="Main Cricket Ground · Demo venue" />
                                <InfoRow icon={ShieldCheck} label="Format" value="League stage · Sample format" />
                            </div>
                        </GlassCard>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { label: 'Participating Teams', value: '04', icon: Users },
                            { label: 'Matches Listed', value: '03', icon: CalendarDays },
                            { label: 'Points Table', value: 'Preview', icon: Medal },
                            { label: 'Tournament', value: 'Season 6', icon: Award },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-[#0b2038]/65 p-4 backdrop-blur-sm transition hover:border-orange-400/25 sm:p-5">
                                <Icon size={20} className="text-orange-400" />
                                <p className="mt-4 font-display text-xl font-extrabold text-[#f7f3eb] sm:text-2xl">{value}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-300/55 sm:text-xs">{label}</p>
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

            <div id="tournament-content" className="mx-auto max-w-7xl scroll-mt-36 space-y-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                {activeTab === 'Overview' && (
                    <>
                        <StadiumSection>
                            <SectionTitle eyebrow="Tournament overview" title="Everything in one place" description="Quick access to tournament information, participating teams, upcoming matches and current standings." />
                            <div className="grid gap-5 md:grid-cols-3">
                                <OverviewCard icon={Users} title="Meet the teams" text="Explore the participating teams and their tournament standing." action="Explore teams" onClick={() => showSection('Teams')} />
                                <OverviewCard icon={CalendarDays} title="Fixtures & results" text="Check upcoming match timings, venues and completed results." action="View matches" onClick={() => showSection('Fixtures & Results')} />
                                <OverviewCard icon={Trophy} title="League standings" text="See the sample standings, points and net run rate." action="View standings" onClick={() => showSection('Points Table')} />
                            </div>
                        </StadiumSection>

                        <StadiumSection>
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <SectionTitle eyebrow="Next on the pitch" title="Upcoming matches" description="Keep track of the next fixtures in the tournament." />
                                <button onClick={() => showSection('Fixtures & Results')} className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-orange-400 transition hover:text-orange-300">
                                    All fixtures <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                {matches.filter((m) => m.status === 'Upcoming').slice(0, 2).map((match) => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        </StadiumSection>

                        <StadiumSection>
                            <SectionTitle eyebrow="Current standings" title="Points table" description="Sample league standings for preview only. Official standings will be connected to the backend later." />
                            <PointsTable />
                            <div className="mt-4 text-right">
                                <button onClick={() => showSection('Points Table')} className="inline-flex items-center gap-1 text-sm font-bold text-orange-400 hover:text-orange-300">
                                    Full points table <ChevronRight size={16} />
                                </button>
                            </div>
                        </StadiumSection>

                        <StadiumSection>
                            <SectionTitle eyebrow="Our partners" title="Supported by our sponsors" description="Meet the partners supporting the league and its players." />
                            <SponsorGrid />
                        </StadiumSection>
                    </>
                )}

                {activeTab === 'Teams' && (
                    <StadiumSection>
                        <SectionTitle eyebrow="The contenders" title="Participating teams" description="Team details shown here are placeholders for the UI preview." />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {teams.map((team) => (
                                <GlassCard key={team.name} className="p-5">
                                    <TeamBadge team={team} size="lg" />
                                    <h3 className="mt-4 font-display text-lg font-extrabold text-[#f1eee7]">{team.name}</h3>
                                    <p className="mt-1 text-sm text-slate-300/60">Season 6 participant</p>
                                    <div className="mt-5 grid grid-cols-2 gap-2">
                                        <MiniStat label="Played" value={team.played} />
                                        <MiniStat label="Points" value={team.points} highlight />
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                        <div className="mt-6 rounded-2xl border border-dashed border-orange-400/25 bg-orange-400/5 p-5 text-sm leading-6 text-slate-300/70">
                            Team logos, captains and full squad information can be displayed here after the team registration backend is connected.
                        </div>
                    </StadiumSection>
                )}

                {activeTab === 'Fixtures & Results' && (
                    <StadiumSection>
                        <SectionTitle eyebrow="Match centre" title="Fixtures & results" description="Browse upcoming matches and completed results." />
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
                        <div className="grid gap-4 lg:grid-cols-2">
                            {matches.filter((m) => matchFilter === 'All' || m.status === matchFilter).map((match) => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    </StadiumSection>
                )}

                {activeTab === 'Points Table' && (
                    <StadiumSection>
                        <SectionTitle eyebrow="League standings" title="Points table" description="Standings are illustrative sample data and are not official results." />
                        <PointsTable />
                        <p className="mt-3 text-xs text-slate-300/45">P: Played · W: Won · L: Lost · Pts: Points · NRR: Net Run Rate</p>
                    </StadiumSection>
                )}

                {activeTab === 'Sponsors' && (
                    <>
                        <StadiumSection>
                            <SectionTitle eyebrow="Our partners" title="Sponsors & partners" description="A dedicated space for official tournament partners and sponsors." />
                            <SponsorGrid />
                        </StadiumSection>
                        <div className="rounded-3xl border border-white/10 bg-[#0b2038] p-6 sm:p-8">
                            <h3 className="font-display text-xl font-extrabold text-[#f1eee7]">Partner with ESCL</h3>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300/65">Interested in supporting the league? Submit your sponsorship enquiry to the organising team.</p>
                            <Link to="/sponsor-registration" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400">
                                Become a sponsor <ChevronRight size={17} />
                            </Link>
                        </div>
                    </>
                )}

                {activeTab === 'Gallery' && (
                    <StadiumSection>
                        <SectionTitle eyebrow="Tournament media" title="Highlights & gallery" description="This section is ready for match photos, video highlights and memorable moments." />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { icon: ImageIcon, title: 'Match photography', text: 'Team photos, action shots and tournament moments.' },
                                { icon: PlayCircle, title: 'Video highlights', text: 'Key moments and highlight videos from completed matches.' },
                                { icon: Trophy, title: 'Championship moments', text: 'Awards, celebrations and memorable performances.' },
                            ].map(({ icon: Icon, title, text }) => (
                                <GlassCard key={title} className="flex min-h-48 flex-col justify-between p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                        <Icon size={24} />
                                    </div>
                                    <div className="mt-5">
                                        <h3 className="font-display font-extrabold text-[#f1eee7]">{title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-300/65">{text}</p>
                                    </div>
                                    <span className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-300/40">Media coming soon</span>
                                </GlassCard>
                            ))}
                        </div>
                    </StadiumSection>
                )}
            </div>

            {/* Registration CTA */}
            <section className="mx-4 overflow-hidden rounded-3xl border border-white/10 bg-[#0b2038] sm:mx-6 lg:mx-auto lg:max-w-7xl">
                <div className="relative isolate flex flex-col gap-6 overflow-hidden p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
                    <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-60 w-60 rounded-full bg-orange-500/10 blur-[80px]" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Be part of the league</p>
                        <h2 className="mt-2 font-display text-2xl font-extrabold text-[#f1eee7] sm:text-3xl">Ready to play or partner with us?</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300/65">Explore registration options and become part of the ESCL community.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/team-registration" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-400">
                            Register your team <ChevronRight size={16} />
                        </Link>
                        <Link to="/sponsor-registration" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-[#f1eee7] transition hover:border-orange-400/30 hover:bg-white/5">
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
                <p className="mt-0.5 text-sm font-semibold text-[#f1eee7]">{value}</p>
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
            <h3 className="mt-4 font-display font-extrabold text-[#f1eee7]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300/65">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-400">
                {action} <ArrowUpRight size={16} />
            </span>
        </button>
    )
}

function MiniStat({ label, value, highlight = false }) {
    return (
        <div className={`rounded-xl border p-3 ${highlight ? 'border-orange-400/15 bg-orange-400/10' : 'border-white/5 bg-white/[0.04]'}`}>
            <p className={`text-xs ${highlight ? 'text-orange-300/70' : 'text-slate-300/50'}`}>{label}</p>
            <p className={`mt-1 font-display text-lg font-extrabold ${highlight ? 'text-orange-400' : 'text-[#f1eee7]'}`}>{value}</p>
        </div>
    )
}

function MatchCard({ match }) {
    const completed = match.status === 'Completed'

    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b2038]/85 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-orange-400/25">
            <div className="flex items-center justify-between gap-3 bg-[#102742] px-5 py-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300/45">{match.round}</p>
                    <p className="mt-1 text-sm font-extrabold text-[#f1eee7]">ESCL Season 6</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${completed ? 'bg-emerald-400/10 text-emerald-300' : 'bg-orange-400/10 text-orange-300'}`}>
                    {match.status}
                </span>
            </div>
            <div className="p-5">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-sm font-black text-orange-300">
                            {match.home.split(' ').map((x) => x[0]).join('')}
                        </div>
                        <p className="mt-2 text-sm font-extrabold text-[#f1eee7]">{match.home}</p>
                    </div>
                    <span className="text-xs font-black text-slate-400/50">VS</span>
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-black text-blue-300">
                            {match.away.split(' ').map((x) => x[0]).join('')}
                        </div>
                        <p className="mt-2 text-sm font-extrabold text-[#f1eee7]">{match.away}</p>
                    </div>
                </div>
                <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2.5 text-sm text-slate-300/65">
                        <CalendarDays size={16} className="mt-0.5 shrink-0 text-orange-400" />
                        <span>{match.date}<span className="mt-1 block text-xs text-slate-300/45">{match.time}</span></span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-300/65">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-orange-400" />
                        <span>{match.venue}</span>
                    </div>
                </div>
                {match.score && (
                    <p className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-300">
                        {match.score}
                    </p>
                )}
            </div>
        </article>
    )
}

function PointsTable() {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b2038]/90 shadow-lg shadow-black/10">
            <div className="overflow-x-auto">
                <table className="min-w-[650px] w-full text-left text-sm">
                    <thead className="bg-[#102742] text-[#f1eee7]">
                        <tr>
                            {['Pos', 'Team', 'P', 'W', 'L', 'Pts', 'NRR'].map((h) => (
                                <th key={h} className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-300/70">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {standings.map((row) => (
                            <tr key={row.pos} className="transition hover:bg-orange-400/5">
                                <td className="px-5 py-4">
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${row.pos === 1 ? 'bg-orange-500 text-white' : 'bg-white/5 text-slate-300'}`}>
                                        {row.pos}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-4 font-extrabold text-[#f1eee7]">{row.name}</td>
                                <td className="px-5 py-4 text-slate-300/75">{row.p}</td>
                                <td className="px-5 py-4 font-bold text-emerald-400">{row.w}</td>
                                <td className="px-5 py-4 text-rose-300">{row.l}</td>
                                <td className="px-5 py-4 font-black text-orange-400">{row.pts}</td>
                                <td className="px-5 py-4 font-semibold text-slate-300/75">{row.nrr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function SponsorGrid() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
                <GlassCard key={sponsor.name} className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
                    <span className="rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-300">
                        {sponsor.tier}
                    </span>
                    <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <Target size={23} />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-extrabold tracking-wide text-[#f1eee7]">{sponsor.brand}</h3>
                    <p className="mt-1 text-xs text-slate-300/45">{sponsor.name}</p>
                </GlassCard>
            ))}
        </div>
    )
}
