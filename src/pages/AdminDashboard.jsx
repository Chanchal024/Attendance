import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import AdminOverview from '../components/admin/AdminOverview'
import StudentManagement from '../components/admin/StudentManagement'
import TeacherManagement from '../components/admin/TeacherManagement'
import ViewAllAttendance from '../components/admin/ViewAllAttendance'
import UploadFaceEmbeddings from '../components/admin/UploadFaceEmbeddings'
import ManageClasses from '../components/admin/ManageClasses'
import AttendanceReports from '../components/admin/AttendanceReports'
import DatabaseTools from '../components/admin/DatabaseTools'
import SystemLogs from '../components/admin/SystemLogs'

const AdminDashboard = ({ user, onLogout }) => {
  const menuItems = [
    { path: '/admin', label: 'Admin Overview', icon: 'home' },
    { path: '/admin/students', label: 'Student Management', icon: 'students' },
    { path: '/admin/teachers', label: 'Teacher Management', icon: 'teachers' },
    { path: '/admin/attendance', label: 'Attendance Reports & Data', icon: 'reports' },
    { path: '/admin/classes', label: 'System Structure & Classes', icon: 'users' },
    { path: '/admin/database', label: 'Database Tools & Logs', icon: 'database' },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-dark-surface via-dark-primary to-dark-secondary">
      <Sidebar user={user} onLogout={onLogout} menuItems={menuItems} />
      <div className="flex-1 lg:ml-64">
        <Header user={user} />
        <main className="p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="attendance" element={<AttendanceReports />} />
            <Route path="classes" element={<ManageClasses />} />
            <Route path="database" element={<DatabaseTools />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
