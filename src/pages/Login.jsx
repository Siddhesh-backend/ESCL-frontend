
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'

import Input from '../components/Input'
import Button from '../components/Button'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

import { isValidEmail, isNotEmpty } from '../utils/validators'

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
    setForm((f) => ({
      ...f,
      [field]: value,
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
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-pitch-50 px-4 py-12">

      <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">

        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">

          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <Trophy size={22} />
          </span>

          <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-navy-700/70">
            Sign in to manage your ESCL account
          </p>

        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => update('email', e.target.value)}
          />

          {/* Password */}
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(e) => update('password', e.target.value)}
          />

          {/* Sign In */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="mt-2 w-full"
          >
            Sign In
          </Button>

        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-navy-700/70">
          Don't have an account?{' '}

          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:underline"
          >
            Register as a player
          </Link>
        </p>

      </div>

    </div>
  )
}
