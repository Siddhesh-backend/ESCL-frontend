import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-pitch-50">
      <Sidebar />
      <div className="min-w-0 flex-1 pb-20 md:pb-0">
        <Outlet />
      </div>
    </div>
  )
}
