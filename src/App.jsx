import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AttendanceProvider } from './context/AttendanceContext'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-surface to-dark-primary">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <AttendanceProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={(!user || !user.role) ? <Login onLogin={handleLogin} /> : <Navigate to={`/${user.role.toLowerCase()}`} />} 
          />
          <Route 
            path="/register" 
            element={(!user || !user.role) ? <Register onLogin={handleLogin} /> : <Navigate to={`/${user.role.toLowerCase()}`} />} 
          />
          <Route 
            path="/admin/*" 
            element={user?.role === 'ADMIN' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/teacher/*" 
            element={user?.role === 'TEACHER' ? <TeacherDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/student/*" 
            element={user?.role === 'STUDENT' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={(user && user.role) ? `/${user.role.toLowerCase()}` : "/login"} />} />
        </Routes>
      </Router>
    </AttendanceProvider>
  )
}

export default App

