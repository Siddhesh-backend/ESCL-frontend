import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-pitch-50">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
