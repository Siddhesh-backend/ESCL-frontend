import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowLeft,
    Handshake,
    Building2,
    UserRound,
    Target,
    CheckCircle2,
    Globe,
    Send,
    Trophy,
    Sparkles,
} from 'lucide-react'

import api from '../services/api'
import './SponsorRegistrationAnimation.css'

const initialForm = {
    companyName: '',
    industry: '',
    website: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    contactMethod: 'Email',
    sponsorshipType: '',
    budget: '',
    contributionType: '',
    promotionPreferences: [],
    message: '',
    termsAccepted: false,
    contactConsent: false,
}

const inputClass =
    'sponsor-input w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500'

const labelClass = 'mb-2 block text-sm font-medium text-gray-300'

const sponsorshipOptions = [
    {
        title: 'Title Sponsor',
        description: 'Primary brand visibility across the tournament',
    },
    {
        title: 'Associate Sponsor',
        description: 'Brand presence alongside the main sponsor',
    },
    {
        title: 'Supporting Sponsor',
        description: 'Support the tournament and its activities',
    },
    {
        title: 'Team Sponsor',
        description: 'Support an individual participating team',
    },
    {
        title: 'Prize Sponsor',
        description: 'Sponsor awards, trophies or player prizes',
    },
    {
        title: 'In-kind Partner',
        description: 'Provide products, services or equipment',
    },
]

const promotionOptions = [
    'Tournament banners',
    'Social media promotion',
    'Team jerseys',
    'Stall / Booth',
    'Digital branding',
]

function SectionHeading({ number, icon: Icon, title, description }) {
    return (
        <div className="sponsor-section-heading mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Icon size={21} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">
                    <span className="mr-2 text-orange-400">{number}.</span>
                    {title}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
        </div>
    )
}

function Field({ label, required = false, children }) {
    return (
        <div className="min-w-0">
            <label className={labelClass}>
                {label}
                {required && <span className="ml-1 text-orange-400">*</span>}
            </label>
            {children}
        </div>
    )
}

export default function SponsorRegistration() {
    const [form, setForm] = useState(initialForm)
    const [notice, setNotice] = useState('')
    const [noticeType, setNoticeType] = useState('success')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const updateField = (event) => {
        const { name, value, type, checked } = event.target

        setForm((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }))

        setNotice('')
    }

    const togglePromotion = (option) => {
        setForm((previous) => ({
            ...previous,
            promotionPreferences: previous.promotionPreferences.includes(option)
                ? previous.promotionPreferences.filter((item) => item !== option)
                : [...previous.promotionPreferences, option],
        }))

        setNotice('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (isSubmitting) return

        setNotice('')

        if (!form.termsAccepted) {
            setNoticeType('error')
            setNotice('Please confirm that the information provided is accurate.')
            return
        }

        setIsSubmitting(true)

        const payload = {
            companyName: form.companyName.trim(),
            industry: form.industry,
            website: form.website.trim() || null,

            contactFullName: form.contactPerson.trim(),
            designation: form.designation.trim(),
            businessEmail: form.email.trim(),
            mobileNumber: form.phone.trim(),
            preferredContactMethod: form.contactMethod,

            sponsorshipCategory: form.sponsorshipType,
            budgetRange: form.budget,
            contributionType: form.contributionType,

            promotionPreferences: form.promotionPreferences.join(', '),
            message: form.message.trim(),

            accuracyConfirmed: form.termsAccepted,
            contactConsent: form.contactConsent,
        }

        try {
            const response = await api.post(
                '/sponsor-registrations',
                payload
            )

            const registration = response.data || {}

            setNoticeType('success')
            setNotice(
                `Sponsorship enquiry submitted successfully! Your enquiry ID is ${registration.id ?? 'generated'}. Our ESCL team will contact you soon.`
            )

            setForm({ ...initialForm })

        } catch (error) {
            console.error('Sponsor registration failed:', error)

            setNoticeType('error')

            setNotice(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Unable to submit your sponsorship enquiry. Please try again.'
            )
        } finally {
            setIsSubmitting(false)

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }
    }

    const handleReset = () => {
        if (isSubmitting) return

        setForm({ ...initialForm })
        setNotice('')
    }

    return (
        <main className="sponsor-page min-h-screen bg-[#0B1220] px-4 py-8 text-white sm:px-6 lg:px-8">

            {/* Cricket Stadium Animation Background */}
            <div className="sponsor-stadium">
                <div className="sponsor-light sponsor-light-one" />
                <div className="sponsor-light sponsor-light-two" />
                <div className="sponsor-light sponsor-light-three" />
                <div className="sponsor-particles">
                    {Array.from({ length: 18 }).map((_, index) => (
                        <span key={index} />
                    ))}
                </div>
                <div className="sponsor-cricket-ball" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl">

                <Link
                    to="/"
                    className="sponsor-back mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-orange-400"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                {/* Premium Hero */}
                <header className="sponsor-hero relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111B2E] p-6 sm:p-9">

                    <div className="sponsor-hero-glow" />
                    <div className="sponsor-hero-lines" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

                        <div className="sponsor-hero-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                            <Handshake size={32} />
                        </div>

                        <div className="flex-1">
                            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                                <Sparkles size={14} />
                                Engineering Students Cricket League
                            </p>

                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Sponsorship Enquiry
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                                Become a part of the ESCL championship.
                                Partner with us, support emerging cricketing
                                talent and put your brand in the spotlight.
                            </p>
                        </div>

                        <div className="sponsor-trophy hidden shrink-0 sm:flex">
                            <Trophy size={68} strokeWidth={1.2} />
                        </div>
                    </div>

                    <div className="relative mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-5 text-xs text-gray-400">
                        <span className="rounded-full border border-white/10 px-3 py-2">
                            <span className="text-orange-400">*</span> Required fields
                        </span>

                        <span className="rounded-full border border-white/10 px-3 py-2">
                            Corporate Partnerships
                        </span>

                        <span className="rounded-full border border-white/10 px-3 py-2">
                            Tournament Branding
                        </span>

                        <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-orange-300">
                            Official ESCL Partnership
                        </span>
                    </div>
                </header>

                {notice && (
                    <div
                        role="status"
                        className={`sponsor-notice mb-6 rounded-xl border p-4 text-sm leading-6 ${noticeType === 'success'
                            ? 'border-green-500/30 bg-green-500/10 text-green-200'
                            : 'border-red-500/30 bg-red-500/10 text-red-200'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
                            {notice}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* SECTION 01 */}
                    <section className="sponsor-card sponsor-card-one rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
                        <SectionHeading
                            number="01"
                            icon={Building2}
                            title="Company Details"
                            description="Tell us about your organisation or brand."
                        />

                        <div className="grid gap-5 sm:grid-cols-2">

                            <Field label="Company / Brand Name" required>
                                <input
                                    className={inputClass}
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={updateField}
                                    placeholder="Enter company name"
                                    required
                                />
                            </Field>

                            <Field label="Industry / Business Category" required>
                                <select
                                    className={inputClass}
                                    name="industry"
                                    value={form.industry}
                                    onChange={updateField}
                                    required
                                >
                                    <option value="">Select industry</option>
                                    <option>IT & Technology</option>
                                    <option>Education</option>
                                    <option>Banking & Finance</option>
                                    <option>Healthcare</option>
                                    <option>Sports & Fitness</option>
                                    <option>Retail & E-commerce</option>
                                    <option>Food & Beverage</option>
                                    <option>Manufacturing</option>
                                    <option>Other</option>
                                </select>
                            </Field>

                            <Field label="Company Website">
                                <div className="relative">
                                    <Globe
                                        size={17}
                                        className="absolute left-3.5 top-3.5 text-gray-500"
                                    />
                                    <input
                                        className={`${inputClass} pl-10`}
                                        type="url"
                                        name="website"
                                        value={form.website}
                                        onChange={updateField}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </Field>

                        </div>
                    </section>

                    {/* SECTION 02 */}
                    <section className="sponsor-card sponsor-card-two rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
                        <SectionHeading
                            number="02"
                            icon={UserRound}
                            title="Contact Person"
                            description="Provide the details of the person responsible for this enquiry."
                        />

                        <div className="grid gap-5 sm:grid-cols-2">

                            <Field label="Full Name" required>
                                <input
                                    className={inputClass}
                                    name="contactPerson"
                                    value={form.contactPerson}
                                    onChange={updateField}
                                    placeholder="Contact person's full name"
                                    required
                                />
                            </Field>

                            <Field label="Designation" required>
                                <input
                                    className={inputClass}
                                    name="designation"
                                    value={form.designation}
                                    onChange={updateField}
                                    placeholder="e.g. Marketing Manager"
                                    required
                                />
                            </Field>

                            <Field label="Business Email" required>
                                <input
                                    className={inputClass}
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={updateField}
                                    placeholder="name@company.com"
                                    required
                                />
                            </Field>

                            <Field label="Mobile Number" required>
                                <input
                                    className={inputClass}
                                    type="text"
                                    inputMode="numeric"
                                    name="phone"
                                    value={form.phone}
                                    onChange={(event) => {
                                        const value = event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 10)

                                        setForm((previous) => ({
                                            ...previous,
                                            phone: value,
                                        }))

                                        setNotice('')
                                    }}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    pattern="[6-9][0-9]{9}"
                                    title="Enter a valid 10-digit Indian mobile number"
                                    required
                                />
                            </Field>

                            <Field label="Preferred Contact Method" required>
                                <select
                                    className={inputClass}
                                    name="contactMethod"
                                    value={form.contactMethod}
                                    onChange={updateField}
                                    required
                                >
                                    <option>Email</option>
                                    <option>Phone Call</option>
                                    <option>WhatsApp</option>
                                </select>
                            </Field>

                        </div>
                    </section>

                    {/* SECTION 03 */}
                    <section className="sponsor-card sponsor-card-three rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
                        <SectionHeading
                            number="03"
                            icon={Target}
                            title="Sponsorship Interest"
                            description="Choose the partnership that best matches your goals."
                        />

                        <Field label="Preferred Sponsorship Category" required>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {sponsorshipOptions.map((option) => {
                                    const selected =
                                        form.sponsorshipType === option.title

                                    return (
                                        <label
                                            key={option.title}
                                            className={`sponsor-option flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${selected
                                                ? 'selected border-orange-500 bg-orange-500/10'
                                                : 'border-white/10 bg-[#0B1220] hover:border-white/25'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="sponsorshipType"
                                                value={option.title}
                                                checked={selected}
                                                onChange={updateField}
                                                required
                                                className="mt-1 accent-orange-500"
                                            />

                                            <span>
                                                <span className="block text-sm font-semibold text-white">
                                                    {option.title}
                                                </span>

                                                <span className="mt-1 block text-xs leading-5 text-gray-400">
                                                    {option.description}
                                                </span>
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </Field>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <Field label="Estimated Sponsorship Budget" required>
                                <select
                                    className={inputClass}
                                    name="budget"
                                    value={form.budget}
                                    onChange={updateField}
                                    required
                                >
                                    <option value="">Select budget range</option>
                                    <option>Below ₹10,000</option>
                                    <option>₹10,000 – ₹25,000</option>
                                    <option>₹25,001 – ₹50,000</option>
                                    <option>₹50,001 – ₹1,00,000</option>
                                    <option>Above ₹1,00,000</option>
                                    <option>To be discussed</option>
                                </select>
                            </Field>

                            <Field label="Contribution Type" required>
                                <select
                                    className={inputClass}
                                    name="contributionType"
                                    value={form.contributionType}
                                    onChange={updateField}
                                    required
                                >
                                    <option value="">Select contribution</option>
                                    <option>Financial Sponsorship</option>
                                    <option>Products / Equipment</option>
                                    <option>Services / Facilities</option>
                                    <option>Mixed Contribution</option>
                                    <option>To be discussed</option>
                                </select>
                            </Field>

                        </div>

                        <div className="mt-6">
                            <Field label="Preferred Brand Promotion Opportunities">
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {promotionOptions.map((option) => (
                                        <label
                                            key={option}
                                            className="sponsor-promotion flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-gray-300 transition hover:border-orange-500/50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.promotionPreferences.includes(option)}
                                                onChange={() => togglePromotion(option)}
                                                className="h-4 w-4 accent-orange-500"
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </div>

                        <div className="mt-6">
                            <Field label="Additional Requirements / Message">
                                <textarea
                                    className={inputClass}
                                    name="message"
                                    value={form.message}
                                    onChange={updateField}
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Tell us about your sponsorship goals, expectations or any specific requirements..."
                                />

                                <p className="mt-2 text-right text-xs text-gray-500">
                                    {form.message.length}/1000 characters
                                </p>
                            </Field>
                        </div>
                    </section>

                    {/* SECTION 04 */}
                    <section className="sponsor-card sponsor-card-four rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
                        <SectionHeading
                            number="04"
                            icon={CheckCircle2}
                            title="Confirmation"
                            description="Review the following before submitting your enquiry."
                        />

                        <div className="space-y-4">

                            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-300">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={form.termsAccepted}
                                    onChange={updateField}
                                    required
                                    className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
                                />

                                <span>
                                    I confirm that the information provided is accurate
                                    to the best of my knowledge.
                                    <span className="ml-1 text-orange-400">*</span>
                                </span>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-400">
                                <input
                                    type="checkbox"
                                    name="contactConsent"
                                    checked={form.contactConsent}
                                    onChange={updateField}
                                    className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
                                />

                                <span>
                                    I agree to be contacted by the ESCL team regarding
                                    this sponsorship enquiry.
                                </span>
                            </label>

                        </div>

                        <div className="mt-7 rounded-xl border border-orange-500/20 bg-[#0B1220] p-4 text-xs leading-5 text-gray-400">
                            <strong className="text-orange-300">Please note:</strong>{' '}
                            Your sponsorship enquiry will be securely submitted to ESCL.
                            Our team will review your details and contact you regarding
                            the next steps.
                        </div>

                        {/* Premium Submit Area */}
                        <div className="sponsor-submit-area mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className="sponsor-reset-btn rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reset Form
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="sponsor-submit-btn inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span>
                                    {isSubmitting
                                        ? 'Submitting Enquiry...'
                                        : 'Submit Sponsorship Enquiry'}
                                </span>
                                <Send size={18} />
                            </button>

                        </div>
                    </section>
                </form>

                <footer className="sponsor-footer py-8 text-center text-xs text-gray-500">
                    ESCL · Engineering Students Cricket League
                    <span className="mx-2 text-orange-500">✦</span>
                    Building Partnerships Through Cricket
                </footer>
            </div>
        </main>
    )
}