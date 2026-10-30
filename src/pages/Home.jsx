import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Trophy,
  ShieldCheck,
  Radio,
  MapPin,
  ChevronRight,
  Users,
  Sparkles,
  X,
  Zap,
  Medal,
  Clock3,
  Crown,
} from 'lucide-react'

import scheduleService from '../services/scheduleService'
import upcomingSeriesService from '../services/upcomingSeriesService'
import pointsTableService from '../services/pointsTableService'

import Button from '../components/Button'
import Loader from '../components/Loader'
import { formatDate, statusColor } from '../utils/formatters'

const HERO_IMAGE = "url('/escl-stadium-hero.png')"
const SECTION_IMAGE = "url('/escl-stadium-hero%20(1)%20copy.png')"

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <div>
        <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-orange-400 sm:text-xs">
          <span className="h-[2px] w-7 bg-orange-500" />
          {eyebrow}
        </p>

        <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
          <span className="ml-1 text-orange-400">.</span>
        </h2>
      </div>

      {action}
    </div>
  )
}

function SectionAction({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-xl border border-orange-400/25 bg-orange-500/[0.08] px-4 py-3 text-xs font-extrabold text-orange-200 transition duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-orange-500/15 sm:text-sm"
    >
      {children}
      <ChevronRight
        size={16}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  )
}

function StadiumSection({
  children,
  className = '',
  imageOpacity = 0.68,
}) {
  return (
    <section
      className={`escl-stadium-section relative isolate overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="escl-section-background pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: SECTION_IMAGE,
          opacity: imageOpacity,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#071426]/25 via-[#071426]/40 to-[#071426]/50"
      />

      {children}
    </section>
  )
}

function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`escl-card group relative h-full overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0b1b30]/60 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </div>
  )
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-[#0b1b30]/65 px-4 py-9 text-center backdrop-blur-xl sm:px-6 sm:py-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
        <Icon size={26} />
      </div>

      <p className="mt-4 text-sm text-white/60">{message}</p>
    </div>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) return undefined

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'escl-reveal-visible' : 'escl-reveal-hidden'}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, index }) {
  return (
    <div
      className="group/stat rounded-xl border border-white/10 bg-[#071426]/75 p-3.5 transition duration-300 hover:border-orange-400/35 hover:bg-orange-500/[0.07] sm:p-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <Icon
          size={18}
          className="text-orange-400 transition-transform duration-300 group-hover/stat:scale-110"
        />

        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,.7)]" />
      </div>

      <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-[.1em] text-white/50 sm:text-[10px]">
        {label}
      </p>
    </div>
  )
}

function LoadingSection() {
  return (
    <StadiumSection className="bg-[#071426] px-4 py-24">
      <Loader label="Loading tournament information..." />
    </StadiumSection>
  )
}

export default function Home() {
  const [schedule, setSchedule] = useState([])
  const [series, setSeries] = useState([])
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAnnouncement, setShowAnnouncement] = useState(true)

  useEffect(() => {
    let active = true

    Promise.allSettled([
      scheduleService.getAll(),
      upcomingSeriesService.getAll(),
      pointsTableService.getAll(),
    ]).then(([scheduleResult, seriesResult, pointsResult]) => {
      if (!active) return

      setSchedule(
        scheduleResult.status === 'fulfilled' &&
          Array.isArray(scheduleResult.value)
          ? scheduleResult.value.slice(0, 3)
          : [],
      )

      setSeries(
        seriesResult.status === 'fulfilled' &&
          Array.isArray(seriesResult.value)
          ? seriesResult.value.slice(0, 3)
          : [],
      )

      setPoints(
        pointsResult.status === 'fulfilled' &&
          Array.isArray(pointsResult.value)
          ? pointsResult.value.slice(0, 5)
          : [],
      )

      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const stats = [
    { label: 'Teams Competing', value: '24', icon: ShieldCheck },
    { label: 'Season Matches', value: '48', icon: Trophy },
    { label: 'Players', value: '360+', icon: Users },
    { label: 'Campuses', value: '18', icon: Medal },
  ]

  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Fair Play',
      text: 'A competitive spirit built on respect.',
    },
    {
      icon: Zap,
      title: 'Every Run Counts',
      text: 'Follow the race for the top spot.',
    },
    {
      icon: Trophy,
      title: 'One Championship',
      text: 'One league. One trophy. Big memories.',
    },
  ]

  return (
    <main className="min-h-screen overflow-hidden bg-[#071426] text-white">
      {/* HERO SECTION */}
      <section className="relative isolate min-h-[auto] overflow-hidden bg-[#071426] pb-12 pt-8 sm:min-h-[720px] sm:py-12 lg:min-h-[760px]">
        <div
          aria-hidden="true"
          className="escl-hero-background absolute inset-0 -z-30 bg-cover bg-[center_42%]"
          style={{ backgroundImage: HERO_IMAGE }}
        />

        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#040b18]/75 via-[#071426]/45 to-[#071426]/20" />

        <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#071426]/80 via-transparent to-[#071426]/15" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="escl-glow absolute -right-24 top-12 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px] sm:h-96 sm:w-96" />

          <div className="escl-glow absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] sm:h-96 sm:w-96" />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto grid min-h-0 max-w-7xl items-center gap-10 px-4 py-10 sm:min-h-[720px] sm:gap-12 sm:px-6 sm:py-16 lg:min-h-[760px] lg:grid-cols-[1.1fr_.9fr] lg:gap-14 lg:px-8">
          <div className="escl-rise max-w-3xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-300/25 bg-[#09182b]/85 px-3 py-2.5 text-[9px] font-extrabold uppercase tracking-[.13em] text-orange-200 shadow-[0_0_35px_rgba(249,115,22,.1)] backdrop-blur-xl sm:px-4 sm:text-xs sm:tracking-[.16em]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-orange-400" />
              </span>

              <Radio size={14} className="shrink-0" />
              Engineering Students Cricket League
            </div>


            <h1 className="mt-7 pb-1 font-display text-[2.8rem] font-black leading-[1.15] tracking-tight min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
              <span className="escl-animated-heading block">
                Engineering SportClub
              </span>

              <span className="mt-2 block pb-2">
                <span className="escl-animated-heading">
                  Cricket League
                </span>
              </span>
            </h1>


            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-200/80 sm:text-lg sm:leading-8">
              More than a game. A stage for campus rivalries, unforgettable
              performances and the pursuit of the championship.
            </p>

            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
              <Link to="/tournament" className="inline-flex">
                <Button
                  variant="primary"
                  className="!w-full !gap-2 !rounded-xl !px-5 !py-3.5 !font-bold !shadow-[0_8px_30px_rgba(249,115,22,.28)] transition-all duration-300 hover:-translate-y-0.5 hover:!shadow-[0_12px_40px_rgba(249,115,22,.4)] min-[420px]:!w-auto sm:!px-6"
                >
                  Explore Tournament
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <Link to="/schedule" className="inline-flex">
                <Button
                  variant="outline"
                  className="!w-full !gap-2 !rounded-xl !border-white/25 !bg-white/[0.06] !px-5 !py-3.5 !font-bold !text-white backdrop-blur-lg hover:!border-orange-400/50 hover:!bg-orange-500/10 min-[420px]:!w-auto sm:!px-6"
                >
                  <CalendarDays size={18} />
                  View Fixtures
                </Button>
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs sm:text-sm">
              <Link
                to="/team-registration"
                className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-orange-300"
              >
                <Users size={16} className="text-orange-400" />
                Register your team
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/sponsor-registration"
                className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-orange-300"
              >
                <Trophy size={16} className="text-orange-400" />
                Become a sponsor
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs font-medium text-white/55">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-orange-400" />
                Competitive cricket
              </span>

              <span className="flex items-center gap-2">
                <Trophy size={15} className="text-orange-400" />
                Campus pride
              </span>
            </div>
          </div>

          {/* CHAMPIONSHIP PANEL */}
          <div className="relative mx-auto mt-4 w-full max-w-md escl-rise [animation-delay:150ms] sm:mt-0">
            <div className="pointer-events-none absolute inset-4 rounded-full border border-orange-300/15 escl-orbit" />

            <div className="pointer-events-none absolute inset-10 rounded-full border border-dashed border-white/15 escl-orbit [animation-direction:reverse] [animation-duration:35s]" />

            <div className="escl-glow pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/15 blur-[85px] sm:h-72 sm:w-72" />

            <div className="relative rounded-[1.6rem] border border-white/15 bg-[#08172a]/75 p-4 shadow-[0_30px_100px_rgba(0,0,0,.5)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-orange-300">
                    The championship
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">
                    Season 06
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-300/25 bg-gradient-to-br from-orange-400/25 to-orange-600/5 text-orange-300 shadow-[0_0_30px_rgba(249,115,22,.15)] sm:h-14 sm:w-14">
                  <Crown size={28} />
                </div>
              </div>

              <div className="relative my-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#142c49]/95 to-[#091528]/95 p-4 sm:my-7 sm:p-5">
                <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-orange-500/15 blur-2xl" />

                <div className="relative flex items-center gap-4">
                  <div className="escl-float flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-700 text-white shadow-[0_8px_25px_rgba(249,115,22,.25)] sm:h-16 sm:w-16">
                    <Medal size={30} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      The ultimate goal
                    </p>

                    <p className="mt-1 text-lg font-black sm:text-xl">
                      Lift the Trophy.
                    </p>

                    <p className="mt-1 text-xs text-white/60">
                      Earn your place in ESCL history.
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="escl-shimmer h-full w-2/3 rounded-full bg-gradient-to-r from-orange-500 via-amber-300 to-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <StatCard key={stat.label} {...stat} index={index} />
                ))}
              </div>

              <p className="mt-4 text-[10px] leading-5 text-white/40">
                Illustrative season statistics — confirm figures with the
                league manager before publishing.
              </p>
            </div>

            {showAnnouncement && (
              <div className="relative z-10 mt-4 escl-rise [animation-delay:500ms] sm:absolute sm:-bottom-7 sm:-left-8 sm:right-8 sm:mt-0">
                <div className="flex items-center gap-2.5 rounded-2xl border border-orange-300/25 bg-[#0b1d35]/95 p-3 shadow-[0_15px_45px_rgba(0,0,0,.4)] backdrop-blur-xl sm:gap-3 sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 sm:h-11 sm:w-11">
                    <Sparkles size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-orange-300 sm:text-[10px] sm:tracking-[.16em]">
                      Be part of the league
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-white/85 sm:text-sm">
                      Your team. Your campus. Your moment.
                    </p>
                  </div>

                  <Link
                    to="/team-registration"
                    aria-label="Go to team registration"
                    className="rounded-lg bg-orange-500 p-2 text-white transition hover:bg-orange-400"
                  >
                    <ArrowRight size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowAnnouncement(false)}
                    aria-label="Dismiss announcement"
                    className="self-start rounded-lg p-1 text-white/45 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent" />
      </section>

      {/* DATA SECTIONS */}
      {loading ? (
        <LoadingSection />
      ) : (
        <>
          {/* UPCOMING SERIES */}
          <StadiumSection className="bg-[#09182b] py-16 sm:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,.09),transparent_40%)]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <SectionHeader
                  eyebrow="On the horizon"
                  title="Upcoming Series"
                  action={
                    <SectionAction to="/upcoming-series">
                      View all series
                    </SectionAction>
                  }
                />
              </Reveal>

              {series.length === 0 ? (
                <EmptyState
                  icon={Trophy}
                  message="No upcoming series announced yet."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {series.map((item, index) => (
                    <Reveal key={item.id ?? index} delay={index * 100}>
                      <GlassCard>
                        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-500/[0.08] blur-2xl transition-all duration-500 group-hover:bg-orange-500/[0.18]" />

                        <div className="relative p-5 sm:p-6">
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                              <Trophy size={21} />
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/55">
                              Series {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>

                          <h3 className="mt-5 break-words text-xl font-extrabold text-white">
                            {item.seriesName}
                          </h3>

                          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3.5">
                            <CalendarDays
                              size={19}
                              className="shrink-0 text-orange-400"
                            />

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                                Start date
                              </p>

                              <p className="mt-1 text-sm font-bold text-white/90">
                                {formatDate(item.seriesDate)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-orange-200/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                            The next chapter starts here
                          </div>
                        </div>
                      </GlassCard>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </StadiumSection>

          {/* FIXTURES */}
          <StadiumSection className="bg-[#0b1d33] py-16 sm:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,.08),transparent_42%)]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <SectionHeader
                  eyebrow="Mark your calendar"
                  title="Latest Fixtures"
                  action={
                    <SectionAction to="/schedule">
                      Full schedule
                    </SectionAction>
                  }
                />
              </Reveal>

              {schedule.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  message="No matches scheduled yet."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {schedule.map((match, index) => (
                    <Reveal key={match.id ?? index} delay={index * 100}>
                      <GlassCard>
                        <div className="relative border-b border-white/[0.08] bg-gradient-to-br from-[#132c4a]/95 to-[#0c1d33]/95 p-5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.15em] text-white/55">
                              <Trophy
                                size={15}
                                className="text-orange-400"
                              />
                              ESCL fixture
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusColor(match.status)}`}
                            >
                              {match.status}
                            </span>
                          </div>

                          <h3 className="mt-4 break-words text-xl font-black leading-snug text-white">
                            {match.matchName}
                          </h3>

                          <div className="mt-4 h-px bg-gradient-to-r from-orange-400/50 via-white/10 to-transparent" />
                        </div>

                        <div className="space-y-4 p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300">
                              <CalendarDays size={18} />
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                                Match date
                              </p>

                              <p className="mt-1 text-sm font-bold text-white/90">
                                {formatDate(match.matchDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">
                              <MapPin size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                                Venue
                              </p>

                              <p className="mt-1 break-words text-sm font-bold text-white/90">
                                {match.venue}
                              </p>

                              <p className="text-xs text-white/50">
                                {match.city}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">
                              <Clock3 size={18} />
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                                Match time
                              </p>

                              <p className="mt-1 text-sm font-bold text-white/90">
                                {match.matchTime}
                              </p>

                              {match.gmtTime && (
                                <p className="text-xs text-white/50">
                                  {match.gmtTime} GMT
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="border-t border-white/[0.08] pt-4">
                            <Link
                              to="/schedule"
                              className="group/link inline-flex items-center gap-2 text-sm font-bold text-orange-300 transition hover:text-orange-200"
                            >
                              Match details
                              <ArrowRight
                                size={15}
                                className="transition-transform group-hover/link:translate-x-1"
                              />
                            </Link>
                          </div>
                        </div>
                      </GlassCard>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </StadiumSection>

          {/* POINTS TABLE */}
          <StadiumSection className="bg-[#09182b] py-16 sm:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,.08),transparent_40%)]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <SectionHeader
                  eyebrow="The race to the top"
                  title="Points Table"
                  action={
                    <SectionAction to="/points-table">
                      Full table
                    </SectionAction>
                  }
                />
              </Reveal>

              {points.length === 0 ? (
                <EmptyState
                  icon={Trophy}
                  message="The points table will appear when standings are available."
                />
              ) : (
                <Reveal>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#09182b]/70 shadow-[0_25px_70px_rgba(0,0,0,.3)] backdrop-blur-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-[#132c49]/85 to-[#0c1d32]/85 px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
                          <Medal size={21} />
                        </div>

                        <div>
                          <p className="font-extrabold text-white">
                            League standings
                          </p>

                          <p className="mt-0.5 text-xs text-white/50">
                            Current available team rankings
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-300">
                        Standings
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead className="bg-black/25 text-white/55">
                          <tr>
                            {['Pos', 'Team', 'P', 'W', 'L', 'Pts', 'NRR'].map(
                              (heading) => (
                                <th
                                  key={heading}
                                  className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[.16em]"
                                >
                                  {heading}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-white/[0.07]">
                          {points.map((row, index) => (
                            <tr
                              key={row.id ?? index}
                              className="transition-colors duration-300 hover:bg-orange-500/[0.07]"
                            >
                              <td className="px-5 py-4">
                                <span
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${index === 0
                                    ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_5px_15px_rgba(249,115,22,.2)]'
                                    : 'bg-white/[0.06] text-white/75'
                                    }`}
                                >
                                  {row.position}
                                </span>
                              </td>

                              <td className="px-5 py-4 font-bold text-white/95">
                                {row.teamName}
                              </td>

                              <td className="px-5 py-4 text-white/65">
                                {row.matchesPlayed}
                              </td>

                              <td className="px-5 py-4 font-semibold text-emerald-400">
                                {row.won}
                              </td>

                              <td className="px-5 py-4 text-rose-400">
                                {row.lost}
                              </td>

                              <td className="px-5 py-4 text-base font-black text-orange-300">
                                {row.points}
                              </td>

                              <td className="px-5 py-4 text-white/75">
                                {row.netRunRate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="px-4 py-3 text-[10px] text-white/35 sm:px-6">
                      Swipe horizontally to view all standings on mobile.
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </StadiumSection>
        </>
      )}

      {/* ABOUT ESCL */}
      <StadiumSection className="border-y border-white/[0.07] bg-[#0b1d33] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(249,115,22,.10),transparent_42%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <Reveal>
            <div>
              <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.25em] text-orange-400 sm:text-xs">
                <span className="h-[2px] w-7 bg-orange-500" />
                Beyond the boundary
              </p>

              <h2 className="mt-4 font-display text-3xl font-black leading-tight sm:text-5xl">
                Built by engineers.
                <span className="mt-1 block text-orange-400">
                  Played for glory.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                ESCL brings engineering students together through cricket,
                teamwork and healthy competition. Every fixture is a new
                challenge. Every team has a story.
              </p>

              <Link
                to="/about"
                className="mt-7 inline-flex items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-5 py-3 text-sm font-bold text-orange-200 transition-all hover:-translate-y-0.5 hover:bg-orange-500/20"
              >
                Discover ESCL
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <Reveal key={title}>
                <GlassCard className="p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-300 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 font-extrabold text-white">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-white/60">
                    {text}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </StadiumSection>

      {/* TEAM & SPONSOR CTA */}
      <StadiumSection className="bg-[#071426] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#071426]/25 via-transparent to-orange-950/15" />

        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] border border-orange-300/20 bg-[#0b1b30]/85 p-6 shadow-[0_25px_90px_rgba(0,0,0,.4)] backdrop-blur-xl sm:rounded-[2rem] sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-orange-300/10" />

            <div className="pointer-events-none absolute -right-2 -top-6 h-44 w-44 rounded-full border border-dashed border-orange-300/15 escl-orbit" />

            <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.22em] text-orange-300 sm:text-xs">
                  <Sparkles size={15} />
                  Join the journey
                </p>

                <h2 className="mt-4 max-w-2xl font-display text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                  Help build the next
                  <span className="text-orange-400"> ESCL story.</span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Bring your team to the league or partner with us to support
                  campus cricket.
                </p>
              </div>

              <div className="flex flex-col gap-3 min-[440px]:flex-row md:flex-col">
                <Link to="/team-registration">
                  <Button
                    variant="primary"
                    className="!w-full !gap-2 !rounded-xl !px-5 !py-3.5 !font-bold"
                  >
                    Register Team
                    <ArrowRight size={17} />
                  </Button>
                </Link>

                <Link to="/sponsor-registration">
                  <Button
                    variant="outline"
                    className="!w-full !rounded-xl !border-white/20 !bg-white/[0.04] !px-5 !py-3.5 !font-bold !text-white hover:!border-orange-400/50"
                  >
                    Become a Sponsor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </StadiumSection>

    </main>
  )
}