
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowLeft,
    Handshake,
    Building2,
    UserRound,
    Target,
    CheckCircle2,
    Upload,
    Globe,
    Send,
} from 'lucide-react'

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
    'w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500'

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
        <div className="mb-6 flex items-start gap-3">
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
    const [logo, setLogo] = useState(null)
    const [notice, setNotice] = useState('')

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
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        // Frontend preview only. Backend integration will be added later.
        setNotice(
            'Form validation successful! Backend integration is pending. Your enquiry has not been submitted or saved.'
        )
    }

    return (
        <main className="min-h-screen bg-[#0B1220] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-orange-400"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111B2E] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                            <Handshake size={32} />
                        </div>

                        <div className="flex-1">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                                Engineering Students Cricket League
                            </p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Sponsorship Enquiry
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                                Partner with ESCL to support cricketing talent
                                and connect your brand with the sporting community.
                                Share your details and sponsorship interests below.
                            </p>
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
                    </div>
                </header>

                {notice && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm leading-6 text-orange-200"
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
                            {notice}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
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

                            <Field label="Company Logo (Optional)">
                                <label className="flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 bg-[#0B1220] px-4 py-3 text-sm text-gray-400 transition hover:border-orange-500">
                                    <Upload size={18} className="text-orange-400" />
                                    <span className="min-w-0 truncate">
                                        {logo ? logo.name : 'Choose logo image'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        className="hidden"
                                        onChange={(event) =>
                                            setLogo(event.target.files?.[0] || null)
                                        }
                                    />
                                </label>
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
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
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={updateField}
                                    placeholder="10-digit mobile number"
                                    pattern="[6-9][0-9]{9}"
                                    maxLength={10}
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

                    <section className="rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
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
                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${selected
                                                ? 'border-orange-500 bg-orange-500/10'
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
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-gray-300 transition hover:border-orange-500/50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.promotionPreferences.includes(
                                                    option
                                                )}
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

                    <section className="rounded-2xl border border-white/10 bg-[#111B2E] p-5 sm:p-8">
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

                        <div className="mt-7 rounded-xl border border-white/10 bg-[#0B1220] p-4 text-xs leading-5 text-gray-400">
                            <strong className="text-gray-300">Please note:</strong>{' '}
                            This form is currently a frontend preview. No enquiry,
                            company logo or personal details will be sent to or saved
                            on the server until backend integration is implemented.
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setForm(initialForm)
                                    setLogo(null)
                                    setNotice('')
                                }}
                                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
                            >
                                Reset Form
                            </button>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#111B2E]"
                            >
                                <Send size={17} />
                                Preview Sponsorship Enquiry
                            </button>
                        </div>
                    </section>
                </form>

                <footer className="py-8 text-center text-xs text-gray-500">
                    ESCL · Engineering Students Cricket League
                </footer>
            </div>
        </main>
    )
}
