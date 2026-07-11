import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import StudentOverview from '../components/student/StudentOverview'
import AttendanceCalendar from '../components/student/AttendanceCalendar'
import MyClasses from '../components/student/MyClasses'
import MyProfile from '../components/student/MyProfile'

const StudentDashboard = ({ user, onLogout }) => {
  const menuItems = [
    { path: '/student', label: 'Overview', icon: 'home' },
    { path: '/student/calendar', label: 'Attendance Calendar', icon: 'calendar' },
    { path: '/student/classes', label: 'My Classes', icon: 'users' },
    { path: '/student/profile', label: 'My Profile', icon: 'profile' },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-dark-surface via-dark-primary to-dark-secondary">
      <Sidebar user={user} onLogout={onLogout} menuItems={menuItems} />
      <div className="flex-1 lg:ml-64">
        <Header user={user} />
        <main className="p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<StudentOverview user={user} />} />
            <Route path="calendar" element={<AttendanceCalendar user={user} />} />
            <Route path="classes" element={<MyClasses user={user} />} />
            <Route path="profile" element={<MyProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard
