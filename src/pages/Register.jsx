import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useToast } from '../context/ToastContext'
import { isValidEmail, isValidPhone, isNotEmpty, minLength } from '../utils/validators'
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

export default function Register() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
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

    if (!isNotEmpty(form.cricheroesUrl))
      next.cricheroesUrl = 'CricHeroes URL is required'

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
      showToast('Registration successful! You can now log in.', 'success')
      setForm(INITIAL)
      navigate('/login')
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-pitch-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
            <UserPlus size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">Player Registration</h1>
          <p className="mt-1 text-sm text-navy-700/70">Join the ESCL roster in under a minute</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="fullName"
            label="Full Name"
            placeholder="Rohan Sharma"
            value={form.fullName}
            error={errors.fullName}
            onChange={(e) => update('fullName', e.target.value)}
          />
          <Input
            id="collegeName"
            label="College / University Name"
            placeholder="ABC College of Engineering"
            value={form.collegeName}
            error={errors.collegeName}
            onChange={(e) => update('collegeName', e.target.value)}
          />
          <Input
            id="branch"
            label="Branch"
            placeholder="Computer Engineering"
            value={form.branch}
            error={errors.branch}
            onChange={(e) => update('branch', e.target.value)}
          />
          <Input
            id="year"
            label="Year of Study"
            placeholder="2nd Year"
            value={form.year}
            error={errors.year}
            onChange={(e) => update('year', e.target.value)}
          />
          <Input
            id="dob"
            label="Date of Birth"
            type="date"
            value={form.dob}
            error={errors.dob}
            onChange={(e) => update('dob', e.target.value)}
          />
          <Input
            id="position"
            label="Preferred Playing Position"
            placeholder="Batsman / Bowler / All-Rounder"
            value={form.position}
            error={errors.position}
            onChange={(e) => update('position', e.target.value)}
          />
          <Input
            id="experience"
            label="Level of Cricket Experience"
            placeholder="Intermediate"
            value={form.experience}
            error={errors.experience}
            onChange={(e) => update('experience', e.target.value)}
          />
          <Input
            id="cricheroesUrl"
            label="CricHeroes Account URL"
            type="url"
            placeholder="https://cricheroes.com/..."
            value={form.cricheroesUrl}
            error={errors.cricheroesUrl}
            onChange={(e) => update('cricheroesUrl', e.target.value)}
          />
          <Input
            id="basePrice"
            label="Base Price"
            type="number"
            placeholder="5000"
            value={form.basePrice}
            onChange={(e) => update('basePrice', e.target.value)}
          />
          <Input
            id="paymentMethod"
            label="Payment Method"
            placeholder="UPI / Cash / Online"
            value={form.paymentMethod}
            error={errors.paymentMethod}
            onChange={(e) => update('paymentMethod', e.target.value)}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => update('email', e.target.value)}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(e) => update('password', e.target.value)}
          />

          <Button type="submit" variant="primary" loading={loading} className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-700/70">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-orange-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
