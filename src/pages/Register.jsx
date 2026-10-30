
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserPlus,
  UserRound,
  GraduationCap,
  CalendarDays,
  Trophy,
  ExternalLink,
  Wallet,
  Mail,
  LockKeyhole,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'

import Input from '../components/Input'
import Button from '../components/Button'
import { useToast } from '../context/ToastContext'
import {
  isValidEmail,
  isNotEmpty,
  minLength,
} from '../utils/validators'
import playerService from '../services/playerService'

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
  '[&_input]:!border-white/10 [&_input]:!bg-[#0b1b30] [&_input]:!text-white [&_input]:placeholder:!text-slate-500 [&_input]:focus:!border-orange-500 [&_input]:focus:!ring-orange-500/20 [&_label]:!text-slate-300'

function FormSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#09182b]/70 p-4 sm:p-5">
      <div className="mb-5 flex items-center gap-3 border-b border-white/[0.08] pb-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
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
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function validate() {
    const next = {}

    if (!isNotEmpty(form.fullName))
      next.fullName = 'Full name is required'

    if (!isNotEmpty(form.collegeName))
      next.collegeName = 'College name is required'

    if (!isNotEmpty(form.branch))
      next.branch = 'Branch is required'

    if (!isNotEmpty(form.year))
      next.year = 'Year is required'

    if (!isNotEmpty(form.dob))
      next.dob = 'Date of birth is required'

    if (!isNotEmpty(form.position))
      next.position = 'Playing position is required'

    if (!isNotEmpty(form.experience))
      next.experience = 'Experience is required'

    if (!isNotEmpty(form.cricheroesUrl)) {
      next.cricheroesUrl = 'CricHeroes URL is required'
    } else {
      try {
        const url = new URL(form.cricheroesUrl)
        if (!['http:', 'https:'].includes(url.protocol)) {
          next.cricheroesUrl = 'Enter a valid CricHeroes URL'
        }
      } catch {
        next.cricheroesUrl = 'Enter a valid CricHeroes URL'
      }
    }

    if (!isValidEmail(form.email))
      next.email = 'Enter a valid email address'

    if (!minLength(form.password, 6))
      next.password = 'Password must be at least 6 characters'

    if (!isNotEmpty(form.paymentMethod))
      next.paymentMethod = 'Payment method is required'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      await playerService.create(form)
      showToast(
        'Registration successful! You can now log in.',
        'success'
      )
      setForm(INITIAL)
      navigate('/login')
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061326] px-4 py-8 text-white sm:px-6 sm:py-12">
      {/* Stadium-inspired background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/escl-stadium-hero.png')",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#061326]/65 via-[#061326]/90 to-[#061326]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[30rem] h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-400 shadow-lg shadow-orange-950/20">
            <UserPlus size={26} />
          </span>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
            Engineering Students Cricket League
          </p>

          <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Player <span className="text-orange-400">Registration</span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Create your player profile and get ready to be part of the
            ESCL cricket journey.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1b30]/90 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Create your player profile
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Fill in your details below.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300">
              <ShieldCheck size={15} />
              Player Registration
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5 p-4 sm:p-6 md:p-7"
          >
            <FormSection icon={UserRound} title="Personal & Academic Details">
              <div className={inputClass}>
                <Input
                  id="fullName"
                  label="Full Name"
                  placeholder="Rohan Sharma"
                  value={form.fullName}
                  error={errors.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Input
                  id="collegeName"
                  label="College / University Name"
                  placeholder="ABC College of Engineering"
                  value={form.collegeName}
                  error={errors.collegeName}
                  onChange={(e) => update('collegeName', e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Input
                  id="branch"
                  label="Branch"
                  placeholder="Computer Engineering"
                  value={form.branch}
                  error={errors.branch}
                  onChange={(e) => update('branch', e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Input
                  id="year"
                  label="Year of Study"
                  placeholder="2nd Year"
                  value={form.year}
                  error={errors.year}
                  onChange={(e) => update('year', e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Input
                  id="dob"
                  label="Date of Birth"
                  type="date"
                  value={form.dob}
                  error={errors.dob}
                  onChange={(e) => update('dob', e.target.value)}
                />
              </div>
            </FormSection>

            <FormSection icon={Trophy} title="Cricket Profile">
              <div className={inputClass}>
                <Input
                  id="position"
                  label="Preferred Playing Position"
                  placeholder="Batsman / Bowler / All-Rounder"
                  value={form.position}
                  error={errors.position}
                  onChange={(e) => update('position', e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Input
                  id="experience"
                  label="Level of Cricket Experience"
                  placeholder="Intermediate"
                  value={form.experience}
                  error={errors.experience}
                  onChange={(e) => update('experience', e.target.value)}
                />
              </div>

              <div className={`sm:col-span-2 ${inputClass}`}>
                <Input
                  id="cricheroesUrl"
                  label="CricHeroes Account URL"
                  type="url"
                  placeholder="https://cricheroes.com/..."
                  value={form.cricheroesUrl}
                  error={errors.cricheroesUrl}
                  onChange={(e) => update('cricheroesUrl', e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Input
                  id="basePrice"
                  label="Base Price"
                  type="number"
                  placeholder="5000"
                  value={form.basePrice}
                  onChange={(e) => update('basePrice', e.target.value)}
                />
              </div>
            </FormSection>

            <FormSection icon={Wallet} title="Account & Payment Details">
              <div className={inputClass}>
                <Input
                  id="paymentMethod"
                  label="Payment Method"
                  placeholder="UPI / Cash / Online"
                  value={form.paymentMethod}
                  error={errors.paymentMethod}
                  onChange={(e) => update('paymentMethod', e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>

              <div className={`sm:col-span-2 ${inputClass}`}>
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  error={errors.password}
                  onChange={(e) => update('password', e.target.value)}
                />
              </div>
            </FormSection>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
              <p className="text-xs leading-5 text-slate-400">
                Please make sure your details are correct before submitting.
                Your account will be created using the information provided.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="mt-1 w-full"
            >
              Create Player Account
            </Button>
          </form>

          <div className="border-t border-white/10 bg-black/10 px-5 py-5 text-center">
            <p className="text-sm text-slate-400">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-bold text-orange-400 transition hover:text-orange-300 hover:underline"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          ESCL · Play with passion. Compete with pride.
        </p>
      </div>
    </main>
  )
}
