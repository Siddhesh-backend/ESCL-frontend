
import { useState } from 'react'
import { Trophy, CalendarDays, ArrowRight } from 'lucide-react'
import upcomingSeriesService from '../services/upcomingSeriesService'
import useFetch from '../hooks/useFetch'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { formatDate } from '../utils/formatters'

export default function UpcomingSeries() {
  const { data, loading, error } = useFetch(
    () => upcomingSeriesService.getAll(),
    []
  )

  const [selected, setSelected] = useState(null)

  return (
    <div className="bg-slate-50">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section
        className="relative overflow-hidden bg-navy-900 bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: "url('escl-stadium-hero.png')",
        }}
      >
         {/* Dark image overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06172c]/95 via-[#081d36]/50 to-[#08172d]/60" />

        {/* Soft bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06172c]/50 to-transparent" />
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Orange Glow */}
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            <Trophy size={15} />
            What's Next
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Upcoming{' '}
            <span className="text-orange-500">
              Series
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            Stay ahead of the action. Explore the next ESCL cricket series,
            their start dates and the road to championship glory.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-4">

            {/* Total Series */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">

              <div className="stat-num text-3xl font-bold text-orange-400">
                {data?.length || 0}
              </div>

              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/50">
                Upcoming Series
              </div>

            </div>

            {/* Tournament */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">

              <div className="stat-num text-3xl font-bold text-white">
                ESCL
              </div>

              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/50">
                Tournament
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CONTENT SECTION
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

          <div>

            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              The Road Ahead
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              All Upcoming Series
            </h2>

          </div>

          {/* Right Side */}
          <div className="hidden items-center gap-2 text-sm text-navy-700/60 sm:flex">

            <Trophy
              size={17}
              className="text-orange-500"
            />

            ESCL Tournament

          </div>

        </div>


        {/* =========================================================
            LOADING
        ========================================================= */}
        {loading && (
          <Loader label="Loading upcoming series..." />
        )}


        {/* =========================================================
            ERROR
        ========================================================= */}
        {!loading && error && (
          <EmptyState
            title="Couldn't load series"
            description={error}
          />
        )}


        {/* =========================================================
            EMPTY STATE
        ========================================================= */}
        {!loading &&
          !error &&
          (!data || data.length === 0) && (
            <EmptyState
              icon={Trophy}
              title="No upcoming series"
              description="Check back soon for announcements."
            />
          )}


        {/* =========================================================
            SERIES CARDS
        ========================================================= */}
        {!loading &&
          !error &&
          data &&
          data.length > 0 && (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {data.map((s, index) => (

                <Card
                  key={s.id}
                  hover
                  className="overflow-hidden"
                >

                  {/* =================================================
                      NAVY CARD HEADER
                  ================================================= */}
                  <div className="-mx-6 -mt-6 mb-5 bg-navy-900 px-6 py-5 text-white">

                    <div className="flex items-start justify-between gap-3">

                      {/* Tournament */}
                      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">

                        <Trophy
                          size={14}
                          className="text-orange-500"
                        />

                        ESCL Tournament

                      </span>


                      {/* Series Number */}
                      <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">

                        SERIES {String(index + 1).padStart(2, '0')}

                      </span>

                    </div>


                    {/* Series Name */}
                    <h3 className="mt-4 font-display text-xl font-bold">
                      {s.seriesName}
                    </h3>

                  </div>


                  {/* =================================================
                      SERIES DATE
                  ================================================= */}
                  <div className="mb-5 flex items-center gap-4 rounded-xl bg-orange-50 p-4">

                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">

                      <CalendarDays size={20} />

                    </div>


                    {/* Date */}
                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-500">
                        Series Date
                      </p>

                      <p className="mt-1 font-display font-semibold text-navy-900">
                        {formatDate(s.seriesDate)}
                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      SERIES DETAILS
                  ================================================= */}
                  <div className="flex items-start gap-3 text-sm">

                    <Trophy
                      size={18}
                      className="mt-0.5 shrink-0 text-navy-700/40"
                    />

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-700/40">
                        Tournament
                      </p>

                      <p className="mt-1 font-medium text-navy-900">
                        Engineering Sports Championship League
                      </p>

                      <p className="mt-1 text-sm text-navy-700/60">
                        Official ESCL Series
                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      FOOTER
                  ================================================= */}
                  <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-4">

                    <span className="text-xs font-semibold uppercase tracking-wide text-navy-700/40">
                      ESCL Series
                    </span>


                    <button
                      onClick={() => setSelected(s)}
                      className="flex items-center gap-1 text-sm font-semibold text-orange-500 transition-all duration-200 hover:gap-2"
                    >

                      Series Details

                      <ArrowRight size={15} />

                    </button>

                  </div>

                </Card>

              ))}

            </div>

          )}

      </section>


      {/* =========================================================
          SERIES DETAILS MODAL
      ========================================================= */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.seriesName}
      >

        {selected && (

          <div className="flex flex-col gap-4 text-sm text-navy-700">

            {/* Date */}
            <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">

                <CalendarDays size={18} />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                  Series Date
                </p>

                <p className="mt-1 font-semibold text-navy-900">
                  {formatDate(selected.seriesDate)}
                </p>

              </div>

            </div>


            {/* Tournament */}
            <div className="flex items-center gap-3">

              <Trophy
                size={18}
                className="text-orange-500"
              />

              <span>
                Engineering Sports Championship League
              </span>

            </div>

          </div>

        )}

      </Modal>

    </div>
  )
}

