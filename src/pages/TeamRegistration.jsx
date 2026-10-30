
import { useState } from 'react'
import { ArrowLeft, Users, Plus, Trash2, CreditCard, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const inputClass =
    'w-full rounded-xl border border-slate-700 bg-[#0B1220] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20'

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
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-sm font-bold text-orange-400">
                {number}
            </span>
            <div>
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-5 text-slate-400">{description}</p>
            </div>
        </div>
    )
}

function Field({ id, label, value, onChange, placeholder, type = 'text', required = false, ...props }) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}{required && <span className="ml-1 text-orange-400">*</span>}
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

export default function TeamRegistration() {
    const [team, setTeam] = useState(initialTeam)
    const [players, setPlayers] = useState([createPlayer()])
    const [transactionReference, setTransactionReference] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('UPI')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [notice, setNotice] = useState('')

    function updateTeam(field, value) {
        setTeam((current) => ({ ...current, [field]: value }))
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
            current.length > 1 ? current.filter((_, i) => i !== index) : current
        )
    }

    function handleSubmit(event) {
        event.preventDefault()
        setNotice(
            'UI preview only: your details have not been submitted or saved. Backend integration will be added later.'
        )
    }

    return (
        <main className="min-h-screen bg-[#0B1220] px-4 py-8 text-white sm:px-6 sm:py-10">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/"
                    className="mb-7 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-orange-400"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <header className="mb-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                        <Users size={28} />
                    </div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400 sm:text-sm">
                        ESCL · Season Registration
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Team Registration
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        Represent your college. Register your team details and player roster
                        for the Engineering Students Cricket League.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                        {[
                            { number: '01', label: 'Team Details' },
                            { number: '02', label: 'Player Roster' },
                            { number: '03', label: 'Entry & Payment' },
                        ].map((step) => (
                            <div
                                key={step.number}
                                className="rounded-xl border border-slate-800 bg-[#111B2E] p-3 sm:p-4"
                            >
                                <p className="text-xs font-bold text-orange-400">{step.number}</p>
                                <p className="mt-1 text-xs font-semibold text-slate-200 sm:text-sm">
                                    {step.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-2xl border border-slate-800 bg-[#111B2E] p-5 shadow-xl sm:p-8">
                        <SectionHeading
                            number="01"
                            title="Team & Captain Details"
                            description="Provide the official team and captain information."
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

                    <section className="rounded-2xl border border-slate-800 bg-[#111B2E] p-5 shadow-xl sm:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <SectionHeading
                                number="02"
                                title="Player Roster"
                                description="Add your squad members and their identification details."
                            />
                            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                                {players.length}/15 players
                            </span>
                        </div>

                        <div className="mb-5 rounded-xl border border-orange-400/20 bg-orange-400/5 p-3 text-xs leading-5 text-slate-300">
                            Add up to 15 players. Ensure each player's details are correct before
                            final submission.
                        </div>

                        <div className="space-y-4">
                            {players.map((player, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-800 bg-[#0D1728] p-4 sm:p-5"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">
                                            Player {String(index + 1).padStart(2, '0')}
                                        </p>
                                        {players.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePlayer(index)}
                                                aria-label={`Remove player ${index + 1}`}
                                                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-400/10"
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
                                            onChange={(e) => updatePlayer(index, 'name', e.target.value)}
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
                                            onChange={(e) => updatePlayer(index, 'phone', e.target.value)}
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
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-orange-400/50 px-4 py-3 text-sm font-bold text-orange-400 transition hover:bg-orange-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Plus size={17} />
                            Add Another Player
                        </button>
                    </section>

                    <section className="rounded-2xl border border-slate-800 bg-[#111B2E] p-5 shadow-xl sm:p-8">
                        <SectionHeading
                            number="03"
                            title="Entry Fee & Payment"
                            description="Payment information is displayed for UI planning only."
                        />

                        <div className="mb-5 flex flex-col gap-4 rounded-xl border border-orange-400/30 bg-orange-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                                    <CreditCard size={22} />
                                </span>
                                <div>
                                    <p className="font-bold text-white">Team Entry Fee</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Reference amount from the provided design
                                    </p>
                                </div>
                            </div>
                            <p className="text-3xl font-extrabold text-orange-400">₹2,500</p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="paymentMethod" className={labelClass}>
                                    Payment Method <span className="text-orange-400">*</span>
                                </label>
                                <select
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="UPI" className="bg-[#0B1220]">UPI</option>
                                    <option value="Bank Transfer" className="bg-[#0B1220]">Bank Transfer</option>
                                    <option value="Other" className="bg-[#0B1220]">Other</option>
                                </select>
                            </div>

                            <Field
                                id="transactionReference"
                                label="Transaction Reference (Optional)"
                                placeholder="Enter transaction / UTR ID"
                                value={transactionReference}
                                onChange={(e) => setTransactionReference(e.target.value)}
                            />
                        </div>

                        <p className="mt-4 text-xs leading-5 text-slate-400">
                            Payment verification and payment instructions will be connected
                            during backend integration. Do not enter sensitive banking details here.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-slate-800 bg-[#111B2E] p-5 sm:p-6">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 accent-orange-500"
                                required
                            />
                            <span className="text-sm leading-6 text-slate-300">
                                I confirm that the information provided is accurate and agree to
                                follow ESCL tournament rules and eligibility requirements.
                                <span className="text-orange-400"> *</span>
                            </span>
                        </label>
                    </section>

                    {notice && (
                        <div
                            role="status"
                            className="rounded-xl border border-orange-400/30 bg-orange-400/10 p-4 text-sm leading-6 text-orange-200"
                        >
                            {notice}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            to="/"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0B1220]"
                        >
                            <ShieldCheck size={18} />
                            Preview Registration
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-xs text-slate-500">
                    ESCL · Engineering Students Cricket League
                </p>
            </div>
        </main>
    )
}
