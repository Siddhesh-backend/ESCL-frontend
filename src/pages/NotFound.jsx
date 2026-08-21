import { Link } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import Button from '../components/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 px-4 text-center">
      <CircleAlert size={48} className="text-orange-500" />
      <h1 className="font-display text-5xl font-bold text-navy-900">404</h1>
      <p className="max-w-sm text-sm text-navy-700/70">
        This page has been given out — the innings you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  )
}
