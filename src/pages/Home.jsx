
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Trophy,
  ShieldCheck,
  Radio,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import scheduleService from '../services/scheduleService'
import upcomingSeriesService from '../services/upcomingSeriesService'
import pointsTableService from '../services/pointsTableService'

import Card from '../components/Card'
import Button from '../components/Button'
import Loader from '../components/Loader'

import { formatDate, statusColor } from '../utils/formatters'

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
          {eyebrow}
        </span>

        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
          {title}
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
      className="
        group inline-flex items-center gap-1.5
        text-sm font-bold text-orange-500
        transition-colors hover:text-orange-600
      "
    >
      {children}

      <ChevronRight
        size={16}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  )
}

export default function Home() {
  const [schedule, setSchedule] = useState([])
  const [series, setSeries] = useState([])
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      scheduleService.getAll(),
      upcomingSeriesService.getAll(),
      pointsTableService.getAll(),
    ]).then(([s, u, p]) => {
      setSchedule(
        s.status === 'fulfilled'
          ? (s.value || []).slice(0, 3)
          : []
      )

      setSeries(
        u.status === 'fulfilled'
          ? (u.value || []).slice(0, 3)
          : []
      )

      setPoints(
        p.status === 'fulfilled'
          ? (p.value || []).slice(0, 5)
          : []
      )

      setLoading(false)
    })
  }, [])

  return (
    <div className="overflow-hidden">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative min-h-[720px] overflow-hidden bg-[#071a31] text-white">

        {/* Background Image */}
        <div
          className="
            absolute inset-0
            bg-cover
            bg-[center_35%]
            scale-[1.03]
          "
          style={{
            backgroundImage: "url('/escl-stadium-hero.png')",
          }}
        />

        {/* Main image overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#06172c]/70
            via-[#081d36]/40
            to-[#08172d]/20
          "
        />

        {/* Soft bottom fade */}
        <div
          className="
            absolute inset-x-0 bottom-0 h-44
            bg-gradient-to-t
            from-[#071a31]
            via-[#071a31]/50
            to-transparent
          "
        />

        {/* Orange atmospheric glow */}
        <div
          className="
            absolute -right-32 top-10
            h-[420px] w-[420px]
            rounded-full
            bg-orange-500/15
            blur-[110px]
          "
        />

        {/* Blue atmospheric glow */}
        <div
          className="
            absolute -left-32 bottom-0
            h-[320px] w-[320px]
            rounded-full
            bg-blue-500/10
            blur-[100px]
          "
        />

        {/* Hero container */}
        <div
          className="
            relative mx-auto grid
            min-h-[720px]
            max-w-7xl
            gap-12
            px-4 py-20
            sm:px-6
            lg:grid-cols-[1.05fr_0.95fr]
            lg:items-center
            lg:px-8
          "
        >

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="max-w-3xl">

            {/* Live badge */}
            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-white/20
                bg-white/[0.08]
                px-4 py-2
                text-xs font-bold uppercase
                tracking-[0.12em]
                text-orange-300
                shadow-lg
                backdrop-blur-md
              "
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
              </span>

              <Radio size={14} />

              Season 6 is live
            </div>

            {/* Heading */}
            <h1
              className="
                mt-7
                font-display
                text-[3.4rem]
                font-black
                leading-[0.98]
                tracking-[-0.035em]
                sm:text-6xl
                lg:text-[4.9rem]
                xl:text-[5.25rem]
              "
            >
              Engineering SportClub

              <span className="mt-2 block text-orange-400">
                Cricket League
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-2xl
                text-base
                leading-7
                text-white/70
                sm:text-lg
                sm:leading-8
              "
            >
              The official home of ESCL cricket — live schedules,
              real-time points tables and every team's road to the
              trophy, built for engineers who play as hard as they build.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap gap-3">

              <Link to="/register">
                <Button
                  variant="primary"
                  className="
                    !px-7
                    !py-3.5
                    !text-base
                    !font-bold
                    !shadow-[0_10px_30px_rgba(249,115,22,0.25)]
                    hover:!shadow-[0_14px_35px_rgba(249,115,22,0.38)]
                  "
                >
                  Register Your Team

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Button>
              </Link>

              <Link to="/schedule">
                <Button
                  variant="outline"
                  className="
                    !border-white/35
                    !bg-white/[0.04]
                    !px-7
                    !py-3.5
                    !text-base
                    !font-bold
                    !text-white
                    backdrop-blur-md
                    hover:!border-white/60
                    hover:!bg-white/10
                  "
                >
                  View Schedule

                  <CalendarDays size={18} />
                </Button>
              </Link>

            </div>

            {/* Trust line */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/45">

              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-orange-400" />
                Verified Players
              </span>

              <span className="h-1 w-1 rounded-full bg-white/25" />

              <span className="flex items-center gap-1.5">
                <Trophy size={14} className="text-orange-400" />
                Competitive League
              </span>

            </div>
          </div>

          {/* =====================================================
              RIGHT — TRANSPARENT STATS CARDS
          ===================================================== */}

          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            {[
              {
                label: 'Teams Competing',
                value: '24',
                icon: ShieldCheck,
              },
              {
                label: 'Matches This Season',
                value: '48',
                icon: Trophy,
              },
              {
                label: 'Registered Players',
                value: '360+',
                icon: ShieldCheck,
              },
              {
                label: 'Campuses Represented',
                value: '18',
                icon: Trophy,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="
                  group
                  rounded-2xl
                  border border-white/20
                  bg-[#071426]/30
                  p-5
                  shadow-[0_18px_45px_rgba(0,0,0,0.22)]
                  backdrop-blur-md
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-orange-400/40
                  hover:bg-[#071426]/40
                  hover:shadow-[0_20px_50px_rgba(0,0,0,0.30)]
                "
              >

                {/* Icon */}
                <div
                  className="
                    mb-5
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-orange-400/20
                    bg-orange-500/15
                    text-orange-400
                    shadow-[0_6px_20px_rgba(249,115,22,0.10)]
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:bg-orange-500/20
                    group-hover:shadow-[0_8px_25px_rgba(249,115,22,0.20)]
                  "
                >
                  <Icon size={19} />
                </div>

                {/* Number */}
                <div
                  className="
                    stat-num
                    text-3xl
                    font-black
                    tracking-tight
                    text-orange-400
                    drop-shadow-[0_3px_12px_rgba(249,115,22,0.20)]
                    sm:text-4xl
                  "
                >
                  {value}
                </div>

                {/* Label */}
                <div
                  className="
                    mt-1.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.13em]
                    text-white/55
                    sm:text-xs
                  "
                >
                  {label}
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          LOADING / DATA SECTIONS
      ========================================================= */}

      {loading ? (
        <div className="bg-white py-20">
          <Loader label="Loading live tournament data..." />
        </div>
      ) : (
        <>
          {/* =====================================================
              UPCOMING SERIES
          ===================================================== */}

          <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

              <SectionHeader
                eyebrow="What's Next"
                title="Upcoming Series"
                action={
                  <SectionAction to="/upcoming-series">
                    View all series
                  </SectionAction>
                }
              />

              {series.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-navy-100 bg-pitch-50 px-6 py-12 text-center">
                  <Trophy size={30} className="mx-auto text-orange-400" />

                  <p className="mt-3 text-sm text-navy-700/60">
                    No upcoming series announced yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  {series.map((s, index) => (
                    <Card
                      key={s.id}
                      hover
                      className="
                        overflow-hidden
                        rounded-2xl
                        border border-navy-100
                        bg-white
                        shadow-sm
                        transition-all duration-300
                      "
                    >

                      {/* Navy Header */}
                      <div className="bg-[#10294d] px-5 py-5 text-white">

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex h-10 w-10
                                items-center justify-center
                                rounded-xl
                                bg-orange-500
                                text-white
                              "
                            >
                              <Trophy size={19} />
                            </div>

                            <span
                              className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-white/60
                              "
                            >
                              ESCL Series
                            </span>

                          </div>

                          <span
                            className="
                              rounded-full
                              border border-white/20
                              bg-white/10
                              px-2.5 py-1
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wide
                              text-white
                            "
                          >
                            Series {String(index + 1).padStart(2, '0')}
                          </span>

                        </div>

                        <h3
                          className="
                            mt-5
                            font-display
                            text-xl
                            font-bold
                            text-white
                          "
                        >
                          {s.seriesName}
                        </h3>

                      </div>

                      {/* Card Body */}
                      <div className="bg-white px-5 py-5">

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-orange-50
                            px-4 py-3
                          "
                        >

                          <div
                            className="
                              flex h-10 w-10
                              shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-orange-500
                              text-white
                              shadow-sm
                            "
                          >
                            <CalendarDays size={18} />
                          </div>

                          <div>

                            <p
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-orange-600
                              "
                            >
                              Start Date
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-sm
                                font-bold
                                text-navy-900
                              "
                            >
                              {formatDate(s.seriesDate)}
                            </p>

                          </div>

                        </div>

                      </div>
                    </Card>
                  ))}

                </div>
              )}

            </div>
          </section>

          {/* =====================================================
              LATEST SCHEDULE
          ===================================================== */}

          <section className="bg-pitch-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

              <SectionHeader
                eyebrow="Fixtures"
                title="Latest Schedule"
                action={
                  <SectionAction to="/schedule">
                    Full schedule
                  </SectionAction>
                }
              />

              {schedule.length === 0 ? (
                <div
                  className="
                    rounded-2xl
                    border border-dashed border-navy-100
                    bg-white
                    px-6 py-12
                    text-center
                  "
                >
                  <CalendarDays
                    size={30}
                    className="mx-auto text-orange-400"
                  />

                  <p className="mt-3 text-sm text-navy-700/60">
                    No matches scheduled yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  {schedule.map((m) => (
                    <Card
                      key={m.id}
                      hover
                      className="
                        overflow-hidden
                        rounded-2xl
                        border border-navy-100
                        bg-white
                        shadow-sm
                        transition-all duration-300
                      "
                    >

                      {/* Navy Header */}
                      <div className="bg-[#10294d] px-5 py-5 text-white">

                        <div className="flex items-center justify-between gap-3">

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              text-xs
                              font-bold
                              uppercase
                              tracking-wide
                              text-white/60
                            "
                          >
                            <Trophy
                              size={14}
                              className="text-orange-400"
                            />

                            ESCL Fixture
                          </span>

                          <span
                            className={`
                              rounded-full
                              px-2.5 py-1
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wide
                              ${statusColor(m.status)}
                            `}
                          >
                            {m.status}
                          </span>

                        </div>

                        <h3
                          className="
                            mt-4
                            font-display
                            text-xl
                            font-bold
                            leading-tight
                            text-white
                          "
                        >
                          {m.matchName}
                        </h3>

                      </div>

                      {/* Card Body */}
                      <div className="bg-white px-5 py-5">

                        {/* Date */}
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-orange-50
                            px-4 py-3
                          "
                        >

                          <div
                            className="
                              flex h-10 w-10
                              shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-orange-500
                              text-white
                              shadow-sm
                            "
                          >
                            <CalendarDays size={18} />
                          </div>

                          <div>

                            <p
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-orange-600
                              "
                            >
                              Match Date
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-sm
                                font-bold
                                text-navy-900
                              "
                            >
                              {formatDate(m.matchDate)}
                            </p>

                          </div>

                        </div>

                        {/* Venue */}
                        <div
                          className="
                            mt-4
                            flex
                            items-start
                            gap-3
                            text-sm
                          "
                        >

                          <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-navy-700/50"
                          />

                          <div>

                            <p
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-navy-700/40
                              "
                            >
                              Venue
                            </p>

                            <p
                              className="
                                mt-0.5
                                font-semibold
                                text-navy-900
                              "
                            >
                              {m.venue}
                            </p>

                            <p className="text-sm text-navy-700/60">
                              {m.city}
                            </p>

                          </div>

                        </div>

                        {/* Time */}
                        <div
                          className="
                            mt-4
                            flex
                            items-start
                            gap-3
                            text-sm
                          "
                        >

                          <CalendarDays
                            size={18}
                            className="mt-0.5 shrink-0 text-navy-700/50"
                          />

                          <div>

                            <p
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-navy-700/40
                              "
                            >
                              Match Time
                            </p>

                            <p
                              className="
                                mt-0.5
                                font-semibold
                                text-navy-900
                              "
                            >
                              {m.matchTime}
                            </p>

                            {m.gmtTime && (
                              <p className="text-sm text-navy-700/60">
                                {m.gmtTime} GMT
                              </p>
                            )}

                          </div>

                        </div>

                        {/* Footer */}
                        <div
                          className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            border-t
                            border-navy-100
                            pt-4
                          "
                        >

                          <span
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-[0.12em]
                              text-navy-700/40
                            "
                          >
                            ESCL Fixture
                          </span>

                          <Link
                            to="/schedule"
                            className="
                              group
                              inline-flex
                              items-center
                              gap-1
                              text-sm
                              font-bold
                              text-orange-500
                              transition-colors
                              hover:text-orange-600
                            "
                          >
                            Match Details

                            <ChevronRight
                              size={16}
                              className="
                                transition-transform
                                group-hover:translate-x-1
                              "
                            />
                          </Link>

                        </div>

                      </div>
                    </Card>
                  ))}

                </div>
              )}

            </div>
          </section>

          {/* =====================================================
              POINTS TABLE
          ===================================================== */}

          <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

              <SectionHeader
                eyebrow="Standings"
                title="Points Table"
                action={
                  <SectionAction to="/points-table">
                    Full table
                  </SectionAction>
                }
              />

              {points.length === 0 ? (
                <div
                  className="
                    rounded-2xl
                    border border-dashed border-navy-100
                    bg-pitch-50
                    px-6 py-12
                    text-center
                  "
                >
                  <Trophy
                    size={30}
                    className="mx-auto text-orange-400"
                  />

                  <p className="mt-3 text-sm text-navy-700/60">
                    Points table will appear once matches are played.
                  </p>
                </div>
              ) : (
                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    border border-navy-100
                    bg-white
                    shadow-sm
                  "
                >

                  <div className="overflow-x-auto">

                    <table className="min-w-full text-sm">

                      <thead className="bg-[#0b1d35] text-white">

                        <tr>

                          {[
                            'Pos',
                            'Team',
                            'P',
                            'W',
                            'L',
                            'Pts',
                            'NRR',
                          ].map((h) => (
                            <th
                              key={h}
                              className="
                                px-5 py-4
                                text-left
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-white/65
                              "
                            >
                              {h}
                            </th>
                          ))}

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-navy-100">

                        {points.map((row, index) => (
                          <tr
                            key={row.id}
                            className="
                              group
                              transition-colors
                              hover:bg-orange-50/50
                            "
                          >

                            <td className="px-5 py-4">

                              <span
                                className={`
                                  flex h-8 w-8
                                  items-center justify-center
                                  rounded-lg
                                  text-xs
                                  font-black
                                  ${index === 0
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-navy-50 text-navy-700'
                                  }
                                `}
                              >
                                {row.position}
                              </span>

                            </td>

                            <td className="px-5 py-4 font-bold text-navy-900">
                              {row.teamName}
                            </td>

                            <td className="stat-num px-5 py-4 text-navy-700/70">
                              {row.matchesPlayed}
                            </td>

                            <td className="stat-num px-5 py-4 font-semibold text-green-600">
                              {row.won}
                            </td>

                            <td className="stat-num px-5 py-4 text-red-500">
                              {row.lost}
                            </td>

                            <td className="stat-num px-5 py-4 text-base font-black text-orange-600">
                              {row.points}
                            </td>

                            <td className="stat-num px-5 py-4 text-navy-700">
                              {row.netRunRate}
                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>
              )}

            </div>
          </section>
        </>
      )}

      {/* =========================================================
          ABOUT
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#071a31] py-20 text-white">

        <div
          className="
            absolute -right-32 top-0
            h-80 w-80
            rounded-full
            bg-orange-500/10
            blur-[100px]
          "
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          <div>

            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
              About the League
            </span>

            <h2
              className="
                mt-3
                max-w-xl
                font-display
                text-3xl
                font-black
                tracking-tight
                sm:text-4xl
              "
            >
              Built by engineers,
              <span className="text-orange-400">
                {' '}played like a championship.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              ESCL brings together engineering colleges into one
              professionally organized cricket league — complete with
              live scheduling, verified player registrations, and a
              points table that carries real stakes.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            {[
              {
                icon: ShieldCheck,
                label: 'Fair Play Certified',
              },
              {
                icon: Trophy,
                label: 'Season-long Trophy Race',
              },
              {
                icon: CalendarDays,
                label: 'Live Fixture Updates',
              },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="
                  group
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.05]
                  p-5
                  backdrop-blur-md
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-orange-400/25
                  hover:bg-white/[0.08]
                "
              >

                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-orange-500/15
                    text-orange-400
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                >
                  <Icon size={20} />
                </div>

                <p className="mt-4 text-sm font-bold leading-5 text-white/85">
                  {label}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =========================================================
          SPONSORS
      ========================================================= */}

      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <p
            className="
              text-center
              text-[10px]
              font-bold
              uppercase
              tracking-[0.3em]
              text-navy-700/40
            "
          >
            Proudly Supported By
          </p>

          <div
            className="
              mt-8
              grid
              grid-cols-2
              items-center
              gap-6
              sm:grid-cols-3
              lg:grid-cols-5
            "
          >

            {[
              'TechCorp',
              'PitchWorks',
              'CampusGear',
              'VeloSports',
              'NimbusCloud',
            ].map((sponsor) => (
              <div
                key={sponsor}
                className="
                  flex h-16
                  items-center
                  justify-center
                  rounded-xl
                  border border-navy-100
                  bg-pitch-50
                  font-display
                  text-base
                  font-bold
                  tracking-wide
                  text-navy-800/65
                  transition-all duration-200
                  hover:border-orange-200
                  hover:bg-orange-50
                  hover:text-orange-600
                "
              >
                {sponsor}
              </div>
            ))}

          </div>

        </div>
      </section>

    </div>
  )
}

