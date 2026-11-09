
import { Link } from 'react-router-dom'
import {
  UserPlus,
  UserRound,
  Trophy,
  Wallet,
  ArrowLeft,
  ShieldCheck,
  LockKeyhole,
} from 'lucide-react'

import Input from '../components/Input'
import Button from '../components/Button'
import CricketAnimation from '../components/CricketAnimation'

const INITIAL = {
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

const inputClass =
  '[&_input]:!border-white/10 [&_input]:!bg-[#0b1b30]/80 [&_input]:!text-white [&_input]:placeholder:!text-slate-500 [&_input]:focus:!border-orange-500 [&_input]:focus:!ring-orange-500/20 [&_label]:!text-slate-300'

function FormSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.10] bg-[#09182b]/65 p-4 shadow-lg shadow-black/10 backdrop-blur-sm sm:p-5">
      <div className="mb-5 flex items-center gap-3 border-b border-white/[0.08] pb-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-500/10 text-orange-400">
          <Icon size={18} />
        </span>

        <h2 className="font-display text-base font-bold text-white sm:text-lg">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  )
}

export default function Register() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#061326] px-4 py-8 text-white sm:px-6 sm:py-12">

      {/* Stadium Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('/escl-stadium-hero.png')",
        }}
      />

      {/* Dark Stadium Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#061326]/55 via-[#061326]/75 to-[#061326]/95"
      />

      {/* Cricket Animation */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <CricketAnimation />
      </div>

      {/* Ambient Orange and Blue Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-32 z-0 h-80 w-80 rounded-full bg-orange-500/15 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[30rem] z-0 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]"
      />

      {/* Main Registration Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">

        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Page Heading */}
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/30 bg-orange-500/15 text-orange-400 shadow-lg shadow-orange-950/30">
            <UserPlus size={26} />
          </span>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
            Engineering Students Cricket League
          </p>

          <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Player <span className="text-orange-400">Registration</span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Create your player profile and get ready to be part of the
            ESCL cricket journey.
          </p>
        </div>

        {/* Invitation Notice */}
        <div className="mb-6 flex items-start gap-4 rounded-2xl border border-orange-400/30 bg-[#0b1b30]/65 p-5 shadow-lg shadow-orange-950/20 backdrop-blur-md">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-500/15 text-orange-400">
            <LockKeyhole size={21} />
          </span>

          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-orange-400 sm:text-base">
              Invited Participants Only
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-200">
              This registration is exclusively for invited ESCL league
              participants.
            </p>

            <p className="mt-1 text-xs font-medium text-orange-300/90">
              Registration is currently closed to the public.
            </p>
          </div>
        </div>

        {/* Registration Card */}
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0b1b30]/65 shadow-2xl shadow-orange-950/25 backdrop-blur-md">

          {/* Card Header */}
          <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Create your player profile
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Player registration preview.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/15 px-3 py-2 text-xs font-semibold text-orange-300">
              <ShieldCheck size={15} />
              Player Registration
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            className="flex flex-col gap-5 p-4 sm:p-6 md:p-7"
          >
            <fieldset
              disabled
              className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0"
            >

              <FormSection
                icon={UserRound}
                title="Personal & Academic Details"
              >
                <div className={inputClass}>
                  <Input
                    id="fullName"
                    label="Full Name"
                    placeholder="Rohan Sharma"
                    value={INITIAL.fullName}
                  />
                </div>

                <div className={inputClass}>
                  <Input
                    id="collegeName"
                    label="College / University Name"
                    placeholder="ABC College of Engineering"
                    value={INITIAL.collegeName}
                  />
                </div>

                <div className={inputClass}>
                  <Input
                    id="branch"
                    label="Branch"
                    placeholder="Computer Engineering"
                    value={INITIAL.branch}
                  />
                </div>

                <div className={inputClass}>
                  <Input
                    id="year"
                    label="Year of Study"
                    placeholder="2nd Year"
                    value={INITIAL.year}
                  />
                </div>

                <div className={inputClass}>
                  <Input
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    value={INITIAL.dob}
                  />
                </div>
              </FormSection>

              <FormSection icon={Trophy} title="Cricket Profile">
                <div className={inputClass}>
                  <Input
                    id="position"
                    label="Preferred Playing Position"
                    placeholder="Batsman / Bowler / All-Rounder"
                    value={INITIAL.position}
                  />
                </div>

                <div className={inputClass}>
                  <Input
                    id="experience"
                    label="Level of Cricket Experience"
                    placeholder="Intermediate"
                    value={INITIAL.experience}
                  />
                </div>

                <div className={`sm:col-span-2 ${inputClass}`}>
                  <Input
                    id="cricheroesUrl"
                    label="CricHeroes Account URL"
                    type="url"
                    placeholder="https://cricheroes.com/..."
                    value={INITIAL.cricheroesUrl}
                  />
                </div>

                <div className={inputClass}>
                  <Input
                    id="basePrice"
                    label="Base Price"
                    type="number"
                    placeholder="5000"
                    value={INITIAL.basePrice}
                  />
                </div>
              </FormSection>

              <FormSection
                icon={Wallet}
                title="Account & Payment Details"
              >
                <div className={inputClass}>
                  <Input
                    id="paymentMethod"
                    label="Payment Method"
                    placeholder="UPI / Cash / Online"
                    value={INITIAL.paymentMethod}
                  />
                </div>

                <div className={inputClass}>
                  <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={INITIAL.email}
                  />
                </div>

                <div className={`sm:col-span-2 ${inputClass}`}>
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={INITIAL.password}
                  />
                </div>
              </FormSection>

              <div className="rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3">
                <p className="text-xs leading-5 text-slate-300">
                  Please make sure your details are correct before submitting.
                  Your account will be created using the information provided.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                disabled
                className="mt-1 w-full"
              >
                Registration Currently Unavailable
              </Button>
            </fieldset>
          </form>

          {/* Footer */}
          <div className="border-t border-white/10 bg-black/20 px-5 py-5 text-center">
            <p className="text-sm text-slate-300">
              Registration is available only to invited participants.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          ESCL · Play with passion. Compete with pride.
        </p>
      </div>
    </main>
  )
}
