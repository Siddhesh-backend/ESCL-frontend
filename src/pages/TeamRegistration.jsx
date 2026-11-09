
import { useEffect, useState } from 'react'
import {
    ArrowLeft,
    Users,
    Plus,
    Trash2,
    ShieldCheck,
    UploadCloud,
    X,
    Trophy,
    FileImage,
    IndianRupee,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import TeamRegistrationBackground from '../components/TeamRegistrationBackground'
import api from '../services/api'

const MAX_FILE_SIZE = 5 * 1024 * 1024

const inputClass =
    'w-full rounded-xl border border-slate-700/80 bg-[#0B1220] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20'

const labelClass = 'mb-2 block text-sm font-medium text-slate-300'

const initialTeam = {
    teamName: '',
    collegeName: '',
    captainName: '',
    captainEmail: '',
    captainPhone: '',
    teamCity: '',
    captainCollegeId: '',
    alternateContact: '',
}

const createPlayer = () => ({
    name: '',
    jerseyNumber: '',
    collegeId: '',
    phone: '',
})

function SectionHeading({ number, title, description }) {
    return (
        <div className="mb-6 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/10 text-sm font-bold text-orange-400 shadow-lg shadow-orange-950/10">
                {number}
            </span>

            <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                    {title}
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    )
}

function Field({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    required = false,
    ...props
}) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
                {required && <span className="ml-1 text-orange-400">*</span>}
            </label>

            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={inputClass}
                {...props}
            />
        </div>
    )
}

function SummaryItem({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 py-3 last:border-0">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="max-w-[60%] break-words text-right text-sm font-semibold text-slate-200">
                {value || 'Not provided'}
            </span>
        </div>
    )
}

export default function TeamRegistration() {
    const [team, setTeam] = useState(initialTeam)
    const [players, setPlayers] = useState([createPlayer()])
    const [transactionReference, setTransactionReference] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('UPI')
    const [paymentScreenshot, setPaymentScreenshot] = useState(null)
    const [screenshotError, setScreenshotError] = useState('')
    const [screenshotPreview, setScreenshotPreview] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [notice, setNotice] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Dynamic Team Entry Fee
    const [entryFee, setEntryFee] = useState(2500)
    const [entryFeeLoaded, setEntryFeeLoaded] = useState(false)

    useEffect(() => {
        let isMounted = true

        async function fetchEntryFee() {
            try {
                const response = await api.get(
                    '/admin/team-registration-settings/entry-fee'
                )

                const currentFee = Number(response.data?.entryFee)

                if (
                    isMounted &&
                    Number.isFinite(currentFee) &&
                    currentFee > 0
                ) {
                    setEntryFee(currentFee)
                }
            } catch (error) {
                console.error(
                    'Failed to fetch current team entry fee:',
                    error
                )
            } finally {
                if (isMounted) {
                    setEntryFeeLoaded(true)
                }
            }
        }

        fetchEntryFee()

        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if (!paymentScreenshot) {
            setScreenshotPreview('')
            return
        }

        const previewUrl = URL.createObjectURL(paymentScreenshot)
        setScreenshotPreview(previewUrl)

        return () => URL.revokeObjectURL(previewUrl)
    }, [paymentScreenshot])

    function updateTeam(field, value) {
        setTeam((current) => ({
            ...current,
            [field]: value,
        }))
    }

    function updatePlayer(index, field, value) {
        setPlayers((current) =>
            current.map((player, i) =>
                i === index ? { ...player, [field]: value } : player
            )
        )
    }

    function addPlayer() {
        if (players.length >= 15) return

        setPlayers((current) => [...current, createPlayer()])
    }

    function removePlayer(index) {
        setPlayers((current) =>
            current.length > 1
                ? current.filter((_, i) => i !== index)
                : current
        )
    }

    function handleScreenshotChange(event) {
        const file = event.target.files?.[0]

        if (!file) return

        setScreenshotError('')

        const allowedTypes = ['image/jpeg', 'image/png']

        if (!allowedTypes.includes(file.type)) {
            setScreenshotError('Only JPG and PNG images are allowed.')
            event.target.value = ''
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            setScreenshotError(
                'File size must be less than or equal to 5 MB.'
            )
            event.target.value = ''
            return
        }

        setPaymentScreenshot(file)
        setNotice('')
    }

    function removeScreenshot() {
        setPaymentScreenshot(null)
        setScreenshotError('')

        const input = document.getElementById('paymentScreenshot')

        if (input) {
            input.value = ''
        }
    }

    // BACKEND API INTEGRATION
    async function handleSubmit(event) {
        event.preventDefault()

        if (isSubmitting) return

        setNotice('')
        setScreenshotError('')
        setIsSubmitting(true)

        const payload = {
            teamName: team.teamName.trim(),
            collegeUniversity: team.collegeName.trim(),
            captainFullName: team.captainName.trim(),
            captainCollegeId: team.captainCollegeId.trim(),
            captainEmail: team.captainEmail.trim(),
            captainContactNumber: team.captainPhone.trim(),
            alternateContact: team.alternateContact.trim() || null,
            city: team.teamCity.trim(),
            paymentMethod,
            transactionReference: transactionReference.trim() || null,

            players: players.map((player) => ({
                fullName: player.name.trim(),
                collegeId: player.collegeId.trim(),
                jerseyNumber: Number(player.jerseyNumber),
                contactNumber: player.phone.trim() || null,
            })),
        }

        try {
            const response = await api.post(
                '/team-registrations',
                payload
            )

            const registration = response.data || {}

            setNotice(
                `Registration successful! Your Team Registration ID is ${registration.id ?? 'generated'}. Payment Status: ${registration.paymentStatus || 'PENDING'}.`
            )

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } catch (error) {
            console.error('Team registration failed:', error)

            setNotice(
                error?.message ||
                'Team registration failed. Please try again.'
            )

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formattedEntryFee = entryFee.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
    })

    const displayedEntryFee = entryFeeLoaded
        ? `₹${formattedEntryFee}`
        : 'Loading...'

    const filledPlayers = players.filter(
        (player) =>
            player.name.trim() &&
            player.jerseyNumber &&
            player.collegeId.trim()
    ).length

    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-[#080F1D] px-4 py-8 text-white sm:px-6 sm:py-10">
            <TeamRegistrationBackground />

            <div className="relative z-10 mx-auto max-w-5xl">

                {/* Back navigation */}
                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-400 transition hover:text-orange-400"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                {/* Header */}
                <header className="mb-9">

                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-400 shadow-xl shadow-orange-950/20">
                        <Trophy size={30} />
                    </div>

                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-400 sm:text-sm">
                        ESCL · Season Registration
                    </p>

                    <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                        Team Registration
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        Build your squad, represent your college and compete in the
                        Engineering Students Cricket League.
                    </p>

                    {/* Registration overview */}
                    <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4">
                        {[
                            { number: '01', label: 'Team Details' },
                            { number: '02', label: 'Player Roster' },
                            { number: '03', label: 'Entry & Payment' },
                        ].map((step) => (
                            <div
                                key={step.number}
                                className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#111B2E]/90 p-3 shadow-lg sm:p-4"
                            >
                                <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-orange-500/80 to-transparent" />

                                <p className="text-xs font-black text-orange-400">
                                    {step.number}
                                </p>

                                <p className="mt-2 text-[11px] font-semibold text-slate-200 sm:text-sm">
                                    {step.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* SECTION 01: TEAM DETAILS */}
                    <section className="rounded-2xl border border-slate-800/90 bg-[#111B2E]/95 p-5 shadow-2xl shadow-black/20 sm:p-8">

                        <SectionHeading
                            number="01"
                            title="Team & Captain Details"
                            description="Provide your official team and captain information."
                        />

                        <div className="grid gap-5 sm:grid-cols-2">

                            <Field
                                id="teamName"
                                label="Team Name"
                                placeholder="e.g. Pune Warriors"
                                value={team.teamName}
                                onChange={(e) => updateTeam('teamName', e.target.value)}
                                required
                            />

                            <Field
                                id="collegeName"
                                label="College / University"
                                placeholder="Official college name"
                                value={team.collegeName}
                                onChange={(e) => updateTeam('collegeName', e.target.value)}
                                required
                            />

                            <Field
                                id="captainName"
                                label="Captain Full Name"
                                placeholder="Enter captain's full name"
                                value={team.captainName}
                                onChange={(e) => updateTeam('captainName', e.target.value)}
                                required
                            />

                            <Field
                                id="captainCollegeId"
                                label="Captain College ID"
                                placeholder="Enter college ID"
                                value={team.captainCollegeId}
                                onChange={(e) => updateTeam('captainCollegeId', e.target.value)}
                                required
                            />

                            <Field
                                id="captainEmail"
                                label="Captain Email"
                                type="email"
                                placeholder="captain@example.com"
                                value={team.captainEmail}
                                onChange={(e) => updateTeam('captainEmail', e.target.value)}
                                required
                            />

                            <Field
                                id="captainPhone"
                                label="Captain Contact Number"
                                type="tel"
                                placeholder="10-digit mobile number"
                                value={team.captainPhone}
                                onChange={(e) => updateTeam('captainPhone', e.target.value)}
                                pattern="[0-9+\-\s()]{10,15}"
                                required
                            />

                            <Field
                                id="alternateContact"
                                label="Alternate Contact (Optional)"
                                type="tel"
                                placeholder="Alternate mobile number"
                                value={team.alternateContact}
                                onChange={(e) => updateTeam('alternateContact', e.target.value)}
                                pattern="[0-9+\-\s()]{10,15}"
                            />

                            <Field
                                id="teamCity"
                                label="City"
                                placeholder="e.g. Pune"
                                value={team.teamCity}
                                onChange={(e) => updateTeam('teamCity', e.target.value)}
                                required
                            />

                        </div>
                    </section>

                    {/* SECTION 02: PLAYER ROSTER */}
                    <section className="rounded-2xl border border-slate-800/90 bg-[#111B2E]/95 p-5 shadow-2xl shadow-black/20 sm:p-8">

                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <SectionHeading
                                number="02"
                                title="Player Roster"
                                description="Add your squad members and their identification details."
                            />

                            <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-xs font-bold text-orange-300">
                                {players.length} / 15 Players
                            </span>
                        </div>

                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-orange-400/20 bg-orange-400/5 p-4">
                            <Users size={20} className="shrink-0 text-orange-400" />
                            <p className="text-xs leading-5 text-slate-300 sm:text-sm">
                                Add your team squad. A maximum of 15 players can be registered.
                            </p>
                        </div>

                        <div className="space-y-4">

                            {players.map((player, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-800 bg-[#0D1728] p-4 transition hover:border-slate-700 sm:p-5"
                                >
                                    <div className="mb-5 flex items-center justify-between gap-3">

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-black text-orange-400">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    Player {index + 1}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Squad member details
                                                </p>
                                            </div>
                                        </div>

                                        {players.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePlayer(index)}
                                                aria-label={`Remove player ${index + 1}`}
                                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-400/10"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        )}

                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <Field
                                            id={`player-${index}-name`}
                                            label="Player Full Name"
                                            placeholder="Enter full name"
                                            value={player.name}
                                            onChange={(e) =>
                                                updatePlayer(index, 'name', e.target.value)
                                            }
                                            required
                                        />

                                        <Field
                                            id={`player-${index}-jersey`}
                                            label="Jersey Number"
                                            type="number"
                                            min="1"
                                            max="99"
                                            placeholder="e.g. 18"
                                            value={player.jerseyNumber}
                                            onChange={(e) =>
                                                updatePlayer(index, 'jerseyNumber', e.target.value)
                                            }
                                            required
                                        />

                                        <Field
                                            id={`player-${index}-college`}
                                            label="College ID"
                                            placeholder="Enter college ID"
                                            value={player.collegeId}
                                            onChange={(e) =>
                                                updatePlayer(index, 'collegeId', e.target.value)
                                            }
                                            required
                                        />

                                        <Field
                                            id={`player-${index}-phone`}
                                            label="Contact Number (Optional)"
                                            type="tel"
                                            placeholder="Player contact number"
                                            value={player.phone}
                                            onChange={(e) =>
                                                updatePlayer(index, 'phone', e.target.value)
                                            }
                                            pattern="[0-9+\-\s()]{10,15}"
                                        />

                                    </div>
                                </div>
                            ))}

                        </div>

                        <button
                            type="button"
                            onClick={addPlayer}
                            disabled={players.length >= 15}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-400/40 bg-orange-500/5 px-4 py-3.5 text-sm font-bold text-orange-400 transition hover:border-orange-400 hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                        >
                            <Plus size={18} />
                            Add Another Player
                        </button>

                        <p className="mt-3 text-xs text-slate-500">
                            {filledPlayers} of {players.length} player entries completed.
                        </p>

                    </section>

                    {/* SECTION 03: PAYMENT */}
                    <section className="rounded-2xl border border-slate-800/90 bg-[#111B2E]/95 p-5 shadow-2xl shadow-black/20 sm:p-8">

                        <SectionHeading
                            number="03"
                            title="Entry Fee & Payment"
                            description="Review the entry fee and provide your payment details."
                        />

                        {/* Dynamic Entry Fee Card */}
                        <div className="relative mb-6 overflow-hidden rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/15 via-[#17243A] to-[#111B2E] p-5 sm:p-6">

                            <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border-[20px] border-orange-400/5" />

                            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/10 text-orange-400">
                                        <IndianRupee size={24} />
                                    </div>

                                    <div>
                                        <p className="font-bold text-white">
                                            Team Entry Fee
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Current registration fee
                                        </p>
                                    </div>
                                </div>

                                <p className="text-3xl font-black text-orange-400 sm:text-4xl">
                                    {displayedEntryFee}
                                </p>

                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label htmlFor="paymentMethod" className={labelClass}>
                                    Payment Method
                                    <span className="ml-1 text-orange-400">*</span>
                                </label>

                                <select
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="UPI" className="bg-[#0B1220]">
                                        UPI
                                    </option>
                                    <option value="Bank Transfer" className="bg-[#0B1220]">
                                        Bank Transfer
                                    </option>
                                    <option value="Other" className="bg-[#0B1220]">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <Field
                                id="transactionReference"
                                label="Transaction Reference (Optional)"
                                placeholder="Enter transaction / UTR ID"
                                value={transactionReference}
                                onChange={(e) =>
                                    setTransactionReference(e.target.value)
                                }
                            />

                        </div>

                        {/* Compact payment screenshot upload */}
                        <div className="mt-7">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-sm font-bold text-white">
                                        Payment Screenshot
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Attach payment proof if available.
                                    </p>
                                </div>
                                <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                                    Optional
                                </span>
                            </div>

                            <input
                                id="paymentScreenshot"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleScreenshotChange}
                                className="hidden"
                            />

                            {!paymentScreenshot ? (
                                <label
                                    htmlFor="paymentScreenshot"
                                    className="group flex min-h-[76px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-[#0D1728]/80 px-4 py-3 transition hover:border-orange-400/60 hover:bg-orange-400/5 sm:px-5"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-400/20 bg-orange-500/10 text-orange-400 transition group-hover:bg-orange-500/15">
                                        <UploadCloud size={19} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-semibold text-slate-200">
                                            Choose payment screenshot
                                        </span>
                                        <span className="mt-1 block text-xs text-slate-500">
                                            JPG or PNG · Maximum 5 MB
                                        </span>
                                    </span>
                                    <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-orange-300 transition group-hover:border-orange-400/40">
                                        Browse
                                    </span>
                                </label>
                            ) : (
                                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-[#0D1728]/90 p-3">
                                    {screenshotPreview ? (
                                        <img
                                            src={screenshotPreview}
                                            alt="Payment screenshot preview"
                                            className="h-14 w-14 shrink-0 rounded-lg border border-slate-700 object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                                            <FileImage size={22} />
                                        </span>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-200">
                                            {paymentScreenshot.name}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {(paymentScreenshot.size / (1024 * 1024)).toFixed(2)} MB · Attached
                                        </p>
                                    </div>
                                    <label
                                        htmlFor="paymentScreenshot"
                                        className="shrink-0 cursor-pointer rounded-lg border border-slate-700 px-2.5 py-2 text-xs font-semibold text-orange-300 transition hover:border-orange-400/50 hover:bg-orange-400/5"
                                    >
                                        Change
                                    </label>
                                    <button
                                        type="button"
                                        onClick={removeScreenshot}
                                        aria-label="Remove payment screenshot"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>
                            )}

                            {screenshotError && (
                                <p className="mt-2 text-xs font-medium text-red-400">
                                    {screenshotError}
                                </p>
                            )}
                            <p className="mt-2 text-[11px] leading-5 text-slate-500">
                                You can continue without uploading a screenshot. Payment verification will be handled separately.
                            </p>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-800 bg-[#0D1728] p-3.5">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    size={18}
                                    className="mt-0.5 shrink-0 text-orange-400"
                                />
                                <p className="text-xs leading-5 text-slate-400">
                                    Do not enter your UPI PIN, ATM PIN, card number or banking password. Only provide your transaction reference if available.
                                </p>
                            </div>
                        </div>

                    </section>

                    {/* REGISTRATION SUMMARY */}
                    <section className="rounded-2xl border border-slate-800 bg-[#111B2E]/95 p-5 shadow-xl sm:p-7">

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                <ShieldCheck size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-white">
                                    Registration Summary
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Review your information before proceeding.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div className="rounded-xl border border-slate-800 bg-[#0D1728] px-4">
                                <SummaryItem
                                    label="Team Name"
                                    value={team.teamName}
                                />
                                <SummaryItem
                                    label="College"
                                    value={team.collegeName}
                                />
                                <SummaryItem
                                    label="Captain"
                                    value={team.captainName}
                                />
                                <SummaryItem
                                    label="City"
                                    value={team.teamCity}
                                />
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-[#0D1728] px-4">
                                <SummaryItem
                                    label="Total Players"
                                    value={`${players.length} added`}
                                />
                                <SummaryItem
                                    label="Payment Method"
                                    value={paymentMethod}
                                />
                                <SummaryItem
                                    label="Entry Fee"
                                    value={displayedEntryFee}
                                />
                                <SummaryItem
                                    label="Screenshot"
                                    value={paymentScreenshot ? 'Attached' : 'Not uploaded'}
                                />
                            </div>

                        </div>
                    </section>

                    {/* TERMS */}
                    <section className="rounded-xl border border-slate-800 bg-[#111B2E]/95 p-5 sm:p-6">

                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 accent-orange-500"
                                required
                            />

                            <span className="text-sm leading-6 text-slate-300">
                                I confirm that the information provided is accurate
                                and agree to follow ESCL tournament rules and
                                eligibility requirements.
                                <span className="text-orange-400"> *</span>
                            </span>
                        </label>

                    </section>

                    {/* NOTICE */}
                    {notice && (
                        <div
                            role="status"
                            className="rounded-xl border border-orange-400/30 bg-orange-400/10 p-4 text-sm leading-6 text-orange-200"
                        >
                            {notice}
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <Link
                            to="/"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-1 hover:shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            <ShieldCheck size={19} />
                            {isSubmitting ? 'Submitting...' : 'Submit Team Registration'}
                        </button>

                    </div>

                </form>

                <footer className="mt-10 border-t border-slate-800/70 pt-6 text-center">
                    <p className="text-xs font-semibold tracking-wider text-slate-500">
                        ESCL · ENGINEERING STUDENTS CRICKET LEAGUE
                    </p>
                    <p className="mt-2 text-[10px] text-slate-600">
                        Play Together. Compete Together. Win Together.
                    </p>
                </footer>

            </div>
        </main>
    )
}
