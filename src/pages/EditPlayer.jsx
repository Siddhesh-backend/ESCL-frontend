import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import playerService from '../services/playerService'
import useFetch from '../hooks/useFetch'
import Input from '../components/Input'
import Button from '../components/Button'
import Loader from '../components/Loader'
import { isValidEmail, isValidPhone, isNotEmpty } from '../utils/validators'
import { useToast } from '../context/ToastContext'

export default function EditPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: player, loading } = useFetch(() => playerService.getById(id), [id])

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (player) {
      setForm({ name: player.name || '', email: player.email || '', phone: player.phone || '' })
    }
  }, [player])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!isNotEmpty(form.name)) next.name = 'Name is required'
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address'
    if (!isValidPhone(form.phone)) next.phone = 'Enter a valid 10-digit phone number'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await playerService.update(id, form)
      showToast('Player updated successfully', 'success')
      navigate(`/players/${id}`)
    } catch (err) {
      showToast(err.message || 'Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading player..." />

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-navy-900">Edit Player</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-navy-100 p-6">
        <Input id="name" label="Full Name" value={form.name} error={errors.name} onChange={(e) => update('name', e.target.value)} />
        <Input id="email" label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => update('email', e.target.value)} />
        <Input id="phone" label="Phone" type="tel" value={form.phone} error={errors.phone} onChange={(e) => update('phone', e.target.value)} />
        <Button type="submit" variant="primary" loading={saving} className="mt-2 w-full">
          Save Changes
        </Button>
      </form>
    </div>
  )
}
