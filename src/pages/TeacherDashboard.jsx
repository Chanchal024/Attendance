import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TeacherOverview from '../components/teacher/TeacherOverview'
import AttendanceSession from '../components/teacher/AttendanceSession'
import ClassStudents from '../components/teacher/ClassStudents'
import ManageStudents from '../components/teacher/ManageStudents'
import AttendanceHistory from '../components/teacher/AttendanceHistory'
import ManualRequests from '../components/teacher/ManualRequests'

const TeacherDashboard = ({ user, onLogout }) => {
  const menuItems = [
    { path: '/teacher', label: 'Overview', icon: 'home' },
    { path: '/teacher/manage', label: 'Manage Students', icon: 'students' },
    { path: '/teacher/session', label: 'Start Attendance', icon: 'camera' },
    { path: '/teacher/students', label: 'View Students', icon: 'users' },
    { path: '/teacher/history', label: 'Attendance History', icon: 'calendar' },
    { path: '/teacher/requests', label: 'Manual Requests', icon: 'attendance' },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-dark-surface via-dark-primary to-dark-secondary">
      <Sidebar user={user} onLogout={onLogout} menuItems={menuItems} />
      <div className="flex-1 lg:ml-64">
        <Header user={user} />
        <main className="p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<TeacherOverview />} />
            <Route path="manage" element={<ManageStudents />} />
            <Route path="session" element={<AttendanceSession />} />
            <Route path="students" element={<ClassStudents />} />
            <Route path="history" element={<AttendanceHistory />} />
            <Route path="requests" element={<ManualRequests />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default TeacherDashboard
