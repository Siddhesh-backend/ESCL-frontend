
import { useState } from 'react'
import {
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
} from 'lucide-react'

import Input from '../components/Input'
import Button from '../components/Button'
import {
  isValidEmail,
  isValidPhone,
  isNotEmpty,
} from '../utils/validators'
import { MATCH_INTEREST_OPTIONS } from '../utils/constants'
import contactService from '../services/contactService'
import { useToast } from '../context/ToastContext'

const INITIAL = {
  name: '',
  email: '',
  company: '',
  phone: '',
  matchInterest: '',
  message: '',
}

export default function Contact() {
  const { showToast } = useToast()

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }))
  }

  function validate() {
    const next = {}

    if (!isNotEmpty(form.name)) {
      next.name = 'Name is required'
    }

    if (!isValidEmail(form.email)) {
      next.email = 'Enter a valid email address'
    }

    if (form.phone && !isValidPhone(form.phone)) {
      next.phone = 'Enter a valid 10-digit phone number'
    }

    if (!isNotEmpty(form.message)) {
      next.message = 'Message is required'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      await contactService.create(form)

      setSubmitted(true)
      setForm(INITIAL)
      setErrors({})
    } catch (err) {
      showToast(
        err.message || 'Could not send your message',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

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
            <MessageSquare size={15} />
            Get In Touch
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Contact{' '}
            <span className="text-orange-500">
              ESCL
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            Have questions about registrations, sponsorships, matches or
            the league? Reach out to the ESCL team and we will get back
            to you.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-4">

            {/* Email */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                <Mail size={18} />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Email
                </div>

                <div className="mt-0.5 text-sm font-medium text-white">
                  League Office
                </div>
              </div>

            </div>

            {/* Response */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                <Send size={18} />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Response
                </div>

                <div className="mt-0.5 text-sm font-medium text-white">
                  Within 2 business days
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CONTACT CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8">

          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            League Office
          </span>

          <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Let's Connect
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-700/60">
            Send us your enquiry and the ESCL team will get back to you
            with the information you need.
          </p>

        </div>


        {/* =========================================================
            MAIN GRID
        ========================================================= */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* =======================================================
              CONTACT INFORMATION
          ======================================================= */}
          <div className="lg:col-span-2">

            <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">

              {/* Navy Header */}
              <div className="bg-navy-900 px-6 py-5 text-white">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                    <MessageSquare size={19} />
                  </div>

                  <div>

                    <h3 className="font-display text-lg font-bold">
                      Contact Information
                    </h3>

                    <p className="text-xs text-white/50">
                      ESCL League Office
                    </p>

                  </div>

                </div>

              </div>


              {/* Contact Details */}
              <div className="flex flex-col divide-y divide-navy-100">

                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'escl.league@example.com',
                  },
                  {
                    icon: Phone,
                    label: 'Phone',
                    value: '+91 954597 0090',
                  },
                  {
                    icon: MapPin,
                    label: 'Office',
                    value: 'Pune, Maharashtra, India',
                  },
                ].map(({ icon: Icon, label, value }) => (

                  <div
                    key={label}
                    className="flex items-start gap-4 px-6 py-5 transition-colors hover:bg-slate-50"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                      <Icon size={19} />
                    </div>

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-700/40">
                        {label}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-navy-900">
                        {value}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* =======================================================
              CONTACT FORM
          ======================================================= */}
          <div className="lg:col-span-3">

            {submitted ? (

              /* ================= SUCCESS ================= */
              <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">

                {/* Navy Header */}
                <div className="bg-navy-900 px-6 py-5 text-white">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>

                      <h3 className="font-display text-lg font-bold">
                        Message Sent
                      </h3>

                      <p className="text-xs text-white/50">
                        Thank you for contacting ESCL
                      </p>

                    </div>

                  </div>

                </div>


                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2
                      size={38}
                      className="text-green-600"
                    />
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-bold text-navy-900">
                    Message sent successfully!
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-700/60">
                    Thanks for reaching out. The ESCL team typically
                    replies within 2 business days.
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="mt-6"
                  >
                    Send Another Message
                  </Button>

                </div>

              </div>

            ) : (

              /* ================= FORM ================= */
              <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
              >

                {/* Form Header */}
                <div className="bg-navy-900 px-6 py-5 text-white">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                      <Send size={18} />
                    </div>

                    <div>

                      <h3 className="font-display text-lg font-bold">
                        Send Us A Message
                      </h3>

                      <p className="text-xs text-white/50">
                        We would love to hear from you
                      </p>

                    </div>

                  </div>

                </div>


                {/* Form Body */}
                <div className="flex flex-col gap-5 p-6">

                  {/* Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <Input
                      id="name"
                      label="Name"
                      value={form.name}
                      error={errors.name}
                      onChange={(e) =>
                        update('name', e.target.value)
                      }
                    />

                    <Input
                      id="email"
                      label="Email"
                      type="email"
                      value={form.email}
                      error={errors.email}
                      onChange={(e) =>
                        update('email', e.target.value)
                      }
                    />

                  </div>


                  {/* Company + Phone */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <Input
                      id="company"
                      label="Company (optional)"
                      value={form.company}
                      onChange={(e) =>
                        update('company', e.target.value)
                      }
                    />

                    <Input
                      id="phone"
                      label="Phone (optional)"
                      type="tel"
                      value={form.phone}
                      error={errors.phone}
                      onChange={(e) =>
                        update('phone', e.target.value)
                      }
                    />

                  </div>


                  {/* Match Interest */}
                  <div className="flex flex-col gap-1.5">

                    <label
                      htmlFor="matchInterest"
                      className="text-sm font-medium text-navy-800"
                    >
                      Match Interest
                    </label>

                    <select
                      id="matchInterest"
                      value={form.matchInterest}
                      onChange={(e) =>
                        update(
                          'matchInterest',
                          e.target.value
                        )
                      }
                      className="focus-ring rounded-lg border border-navy-100 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition focus:border-orange-500"
                    >

                      <option value="">
                        Select an option
                      </option>

                      {MATCH_INTEREST_OPTIONS.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                        >
                          {opt}
                        </option>
                      ))}

                    </select>

                  </div>


                  {/* Message */}
                  <div className="flex flex-col gap-1.5">

                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-navy-800"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        update(
                          'message',
                          e.target.value
                        )
                      }
                      placeholder="Tell us how we can help..."
                      className={`focus-ring w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-navy-700/30 ${
                        errors.message
                          ? 'border-loss'
                          : 'border-navy-100 focus:border-orange-500'
                      }`}
                    />

                    {errors.message && (
                      <span className="text-xs font-medium text-loss">
                        {errors.message}
                      </span>
                    )}

                  </div>


                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="mt-1 w-full"
                  >
                    Send Message
                    <Send size={17} />
                  </Button>

                </div>

              </form>

            )}

          </div>

        </div>

      </section>

    </div>
  )
}

