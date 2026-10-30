
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Trophy,
  ArrowLeft,
  ShieldCheck,
  Mail,
  LockKeyhole,
} from 'lucide-react'

import Input from '../components/Input'
import Button from '../components/Button'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

import { isValidEmail, isNotEmpty } from '../utils/validators'

const inputClass =
  '[&_input]:!border-white/10 [&_input]:!bg-[#0b1b30] [&_input]:!text-white [&_input]:placeholder:!text-slate-500 [&_input]:focus:!border-orange-500 [&_input]:focus:!ring-orange-500/20 [&_label]:!text-slate-300'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: '',
    }))
  }

  function validate() {
    const next = {}

    if (!isValidEmail(form.email)) {
      next.email = 'Enter a valid email address'
    }

    if (!isNotEmpty(form.password)) {
      next.password = 'Password is required'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      await login({
        email: form.email,
        password: form.password,
      })

      showToast('Logged in successfully', 'success')
      navigate('/admin/dashboard')
    } catch (err) {
      showToast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#061326] px-4 py-8 text-white sm:py-12">
      {/* Stadium background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: "url('/escl-stadium-hero.png')",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#061326]/70 via-[#061326]/85 to-[#061326]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]"
      />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1b30]/90 shadow-2xl shadow-black/30 backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/10 bg-white/[0.025] px-6 pb-7 pt-8 text-center sm:px-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-400 shadow-lg shadow-orange-950/20">
              <Trophy size={26} />
            </span>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-orange-400">
              Engineering Students Cricket League
            </p>

            <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-white">
              Welcome <span className="text-orange-400">Back</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in to continue to your ESCL account.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 rounded-xl border border-orange-400/15 bg-orange-500/[0.06] px-4 py-3">
              <ShieldCheck className="shrink-0 text-orange-400" size={19} />
              <p className="text-xs leading-5 text-slate-300">
                Sign in with your registered email and password.
              </p>
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

            <div className={inputClass}>
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                error={errors.password}
                onChange={(e) => update('password', e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="mt-1 w-full"
            >
              Sign In to ESCL
            </Button>
          </form>

          {/* Register link */}
          <div className="border-t border-white/10 bg-black/10 px-5 py-5 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-2 inline-flex items-center gap-2 font-bold text-orange-400 transition hover:text-orange-300 hover:underline"
            >
              <Trophy size={16} />
              Register as a Player
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          ESCL · Play with passion. Compete with pride.
        </p>
      </div>
    </main>
  )
}
