import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Contact from '../pages/Contact'
import Schedule from '../pages/Schedule'
import UpcomingSeries from '../pages/UpcomingSeries'
import PointsTable from '../pages/PointsTable'
import PlayerList from '../pages/PlayerList'
import PlayerDetails from '../pages/PlayerDetails'
import EditPlayer from '../pages/EditPlayer'
import About from '../pages/About'
import NotFound from '../pages/NotFound'

import Dashboard from '../pages/admin/Dashboard'
import ManagePlayers from '../pages/admin/ManagePlayers'
import ManageSchedule from '../pages/admin/ManageSchedule'
import ManageUpcomingSeries from '../pages/admin/ManageUpcomingSeries'
import ManagePointsTable from '../pages/admin/ManagePointsTable'
import ManageContactMessages from '../pages/admin/ManageContactMessages'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/upcoming-series" element={<UpcomingSeries />} />
        <Route path="/points-table" element={<PointsTable />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/players/:id" element={<PlayerDetails />} />
        <Route
          path="/players/:id/edit"
          element={
            <ProtectedRoute>
              <EditPlayer />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="players" element={<ManagePlayers />} />
        <Route path="schedule" element={<ManageSchedule />} />
        <Route path="upcoming-series" element={<ManageUpcomingSeries />} />
        <Route path="points-table" element={<ManagePointsTable />} />
        <Route path="messages" element={<ManageContactMessages />} />
      </Route>
    </Routes>
  )
}
