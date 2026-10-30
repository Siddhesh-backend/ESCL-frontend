
import { useState } from 'react'
import {
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
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

const HERO_IMAGE = "url('/escl-stadium-hero.png')"
const SECTION_IMAGE = "url('/escl-stadium-hero%20(1)%20copy.png')"

const INITIAL = {
  name: '',
  email: '',
  company: '',
  phone: '',
  matchInterest: '',
  message: '',
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px w-8 bg-orange-500" />
        <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-display text-3xl font-extrabold tracking-wide text-[#F3F0E8] sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}

function ContactInfoCard({ icon: Icon, label, value }) {
  return (
    <div className="group flex items-start gap-4 border-b border-white/[0.08] px-5 py-5 last:border-b-0 sm:px-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400 transition duration-300 group-hover:border-orange-400/40 group-hover:bg-orange-500/15">
        <Icon size={19} />
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#F3F0E8]">
          {value}
        </p>
      </div>
    </div>
  )
}

function PanelHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 bg-[#101F31]/90 px-5 py-5 sm:px-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-[#07111F] shadow-lg shadow-orange-950/20">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-[#F3F0E8]">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default function Contact() {
  const { showToast } = useToast()

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => {
      if (!current[field]) return current

      const next = { ...current }
      delete next[field]
      return next
    })
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

  async function handleSubmit(event) {
    event.preventDefault()

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
    <main className="min-h-screen bg-[#07111F] text-[#F3F0E8]">
      {/* HERO */}
      <section className="escl-hero-background relative isolate overflow-hidden bg-[#06101F]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center"
          style={{ backgroundImage: HERO_IMAGE }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-r from-[#050D19]/95 via-[#071426]/80 to-[#071426]/55"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-t from-[#07111F] via-transparent to-[#07111F]/30"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div
          aria-hidden="true"
          className="escl-glow absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full bg-orange-500/15 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="escl-rise inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-[#111D2B]/80 px-4 py-2 backdrop-blur-md">
              <MessageSquare size={15} className="text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200 sm:text-xs">
                Get In Touch
              </span>
            </div>


            <h1 className="escl-rise mt-7 font-display text-[2.8rem] font-black leading-[0.98] tracking-tight min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
              <span className="escl-animated-heading">CONTACT</span>

              <span className="mt-2 block pb-2">
                <span className="escl-animated-heading">ESCL</span>
                <span className="text-[#F5F1E8]"></span>
              </span>
            </h1>


            <p className="escl-rise mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
              Have questions about registrations, sponsorships, matches
              or the league? Reach out to the ESCL team and we will get
              back to you.
            </p>

            <div className="escl-rise mt-8 flex flex-wrap gap-3 sm:gap-4">
              <div className="escl-card flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101D2D]/80 px-5 py-4 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#F3F0E8]">
                    League Office
                  </p>
                </div>
              </div>

              <div className="escl-card flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101D2D]/80 px-5 py-4 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
                  <Send size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Response Time
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#F3F0E8]">
                    Within 2 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="escl-stadium-section relative isolate overflow-hidden bg-[#07111F]">
        <div
          aria-hidden="true"
          className="escl-section-background absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: SECTION_IMAGE }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#06101F]/85"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#071426]/75 via-[#081525]/80 to-[#050B14]/95"
        />

        <div
          aria-hidden="true"
          className="absolute -left-32 top-24 -z-10 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[110px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8">
            <SectionHeading
              eyebrow="League Office"
              title="Let's Connect"
              description="Send us your enquiry and the ESCL team will get back to you with the information you need."
            />
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-5">
            {/* CONTACT INFORMATION */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0C1929]/90 shadow-xl shadow-black/20 backdrop-blur-xl lg:col-span-2">
              <PanelHeader
                icon={MessageSquare}
                title="Contact Information"
                subtitle="ESCL League Office"
              />

              <div>
                <ContactInfoCard
                  icon={Mail}
                  label="Email"
                  value="escl.league@example.com"
                />

                <ContactInfoCard
                  icon={Phone}
                  label="Phone"
                  value="+91 954597 0090"
                />

                <ContactInfoCard
                  icon={MapPin}
                  label="Office"
                  value="Pune, Maharashtra, India"
                />
              </div>

              <div className="mx-5 mb-5 rounded-xl border border-orange-400/15 bg-orange-500/[0.06] p-4 sm:mx-6">
                <div className="flex items-center gap-2 text-orange-300">
                  <Sparkles size={15} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    We're Here to Help
                  </span>
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Contact the league office for enquiries about matches,
                  registrations and sponsorships.
                </p>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0C1929]/95 shadow-xl shadow-black/20 backdrop-blur-xl lg:col-span-3">
              {submitted ? (
                <>
                  <PanelHeader
                    icon={CheckCircle2}
                    title="Message Sent"
                    subtitle="Thank you for contacting ESCL"
                  />

                  <div className="flex flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                      <CheckCircle2
                        size={36}
                        className="text-emerald-400"
                      />
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-extrabold text-[#F3F0E8]">
                      Message sent successfully!
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                      Thanks for reaching out. The ESCL team typically
                      replies within 2 business days.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="mt-6"
                    >
                      Send Another Message
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <PanelHeader
                    icon={Send}
                    title="Send Us a Message"
                    subtitle="We would love to hear from you"
                  />

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5 p-5 sm:p-6"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        id="name"
                        label="Name"
                        value={form.name}
                        error={errors.name}
                        onChange={(event) =>
                          update('name', event.target.value)
                        }
                      />

                      <Input
                        id="email"
                        label="Email"
                        type="email"
                        value={form.email}
                        error={errors.email}
                        onChange={(event) =>
                          update('email', event.target.value)
                        }
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        id="company"
                        label="Company (optional)"
                        value={form.company}
                        onChange={(event) =>
                          update('company', event.target.value)
                        }
                      />

                      <Input
                        id="phone"
                        label="Phone (optional)"
                        type="tel"
                        value={form.phone}
                        error={errors.phone}
                        onChange={(event) =>
                          update('phone', event.target.value)
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="matchInterest"
                        className="text-sm font-semibold text-[#D8DEE8]"
                      >
                        Match Interest
                      </label>

                      <select
                        id="matchInterest"
                        value={form.matchInterest}
                        onChange={(event) =>
                          update('matchInterest', event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#101F31] px-4 py-3 text-sm text-[#F3F0E8] outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15"
                      >
                        <option value="" className="bg-[#101F31] text-[#F3F0E8]">
                          Select an option
                        </option>

                        {MATCH_INTEREST_OPTIONS.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#101F31] text-[#F3F0E8]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-semibold text-[#D8DEE8]"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        rows={5}
                        value={form.message}
                        onChange={(event) =>
                          update('message', event.target.value)
                        }
                        placeholder="Tell us how we can help..."
                        aria-invalid={Boolean(errors.message)}
                        className={`w-full resize-y rounded-xl border bg-[#101F31] px-4 py-3 text-sm leading-6 text-[#F3F0E8] outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-orange-400/15 ${errors.message
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-white/10 focus:border-orange-400'
                          }`}
                      />

                      {errors.message && (
                        <span className="text-xs font-medium text-red-400">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-white/[0.08] pt-5">
                      <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        className="w-full"
                      >
                        Send Message
                        <Send size={17} />
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
