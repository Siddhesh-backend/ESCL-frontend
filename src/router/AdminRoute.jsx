import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader label="Checking permissions..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}