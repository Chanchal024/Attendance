import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaUserGraduate, FaChalkboardTeacher, FaShieldAlt } from 'react-icons/fa'
import { useAttendance } from '../context/AttendanceContext'

const Login = ({ onLogin }) => {
  const { students, teachers } = useAttendance()
  const [selectedRole, setSelectedRole] = useState('')
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Demo credentials for authentication
  const demoCredentials = {
    // Students
    '001': { password: 'student123', role: 'STUDENT' },
    '002': { password: 'student123', role: 'STUDENT' },
    '003': { password: 'student123', role: 'STUDENT' },
    '004': { password: 'student123', role: 'STUDENT' },
    '005': { password: 'student123', role: 'STUDENT' },

    // Teachers
    'DR001': { password: 'teacher123', role: 'TEACHER' },
    'DR002': { password: 'teacher123', role: 'TEACHER' },
    'MS001': { password: 'teacher123', role: 'TEACHER' },

    // Admins
    'ADMIN': { password: 'admin123', role: 'ADMIN' }
  }

  // Demo users data
  const demoUsers = {
    // Students
    '001': {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      role: 'STUDENT',
      class_name: 'Math 101',
      student_number: '001'
    },
    '002': {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      role: 'STUDENT',
      class_name: 'Math 101',
      student_number: '002'
    },
    '003': {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      role: 'STUDENT',
      class_name: 'Science 101',
      student_number: '003'
    },
    '004': {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      role: 'STUDENT',
      class_name: 'Science 101',
      student_number: '004'
    },
    '005': {
      id: 5,
      name: 'Eva Martinez',
      email: 'eva.martinez@email.com',
      role: 'STUDENT',
      class_name: 'English 101',
      student_number: '005'
    },

    // Teachers
    'DR001': {
      id: 1,
      name: 'Dr. Sarah Williams',
      email: 'sarah.williams@email.com',
      role: 'TEACHER',
      assignedClasses: ['Math 101']
    },
    'DR002': {
      id: 2,
      name: 'Prof. Michael Brown',
      email: 'michael.brown@email.com',
      role: 'TEACHER',
      assignedClasses: ['Science 101']
    },
    'MS001': {
      id: 3,
      name: 'Ms. Emily Davis',
      email: 'emily.davis@email.com',
      role: 'TEACHER',
      assignedClasses: ['English 101']
    },

    // Admins
    'ADMIN': {
      id: 1,
      name: 'Admin User',
      email: 'admin@demo.com',
      role: 'ADMIN'
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!selectedRole) {
        throw new Error('Please select your role first (Student, Teacher, or Admin).')
      }

      let { userId, password } = formData
      userId = userId.trim()
      password = password.trim()
      const userIdUpper = userId.toUpperCase()
      const userIdLower = userId.toLowerCase()

      // Check if credentials exist in demo
      let credentials = demoCredentials[userIdUpper] || demoCredentials[userId]
      let user = demoUsers[userIdUpper] || demoUsers[userId]

      // If not found in demo by ID, check demo users by name/email
      if (!user) {
        const foundDemoUserKey = Object.keys(demoUsers).find(key => {
          const du = demoUsers[key];
          return du.name?.toLowerCase() === userIdLower || du.email?.toLowerCase() === userIdLower;
        });
        if (foundDemoUserKey) {
          user = demoUsers[foundDemoUserKey];
          credentials = demoCredentials[foundDemoUserKey];
        }
      }

      // If still not found, check context state
      if (!credentials) {
        if (selectedRole === 'STUDENT') {
          const student = students.find(s => 
            s.student_number === userId || 
            s.student_number === userIdUpper ||
            s.name?.toLowerCase() === userIdLower ||
            s.email?.toLowerCase() === userIdLower
          )
          if (student) {
            credentials = { password: 'student123', role: 'STUDENT' }
            user = { ...student, role: 'STUDENT' }
          }
        } else if (selectedRole === 'TEACHER') {
          const teacher = teachers.find(t => 
            t.email?.toLowerCase() === userIdLower || 
            t.name?.toLowerCase() === userIdLower ||
            (t.id && `T${t.id}` === userIdUpper)
          )
          if (teacher) {
            credentials = { password: teacher.password || 'teacher123', role: 'TEACHER' }
            user = { ...teacher, role: 'TEACHER' }
          }
        }
      }

      if (!credentials) {
        throw new Error('Invalid user ID or password')
      }

      if (credentials.role !== selectedRole) {
        throw new Error(`Invalid role selected. Please select the ${credentials.role} role.`)
      }

      if (credentials.password !== password) {
        throw new Error('Invalid user ID or password')
      }

      if (!user) {
        throw new Error('User data not found')
      }

      setTimeout(() => {
        onLogin(user)
        navigate(`/${user.role.toLowerCase()}`)
        setLoading(false)
      }, 1000)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-surface via-dark-primary to-dark-secondary px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-dark-card rounded-2xl shadow-2xl p-8 border border-maroon-900/30">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Attendance System</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('STUDENT')}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg border transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'bg-blue-900/30 border-blue-500 text-blue-400'
                    : 'bg-dark-surface border-maroon-900/50 text-gray-400 hover:border-maroon-700'
                }`}
              >
                <FaUserGraduate className="text-sm" />
                <span className="text-xs">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('TEACHER')}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg border transition-all ${
                  selectedRole === 'TEACHER'
                    ? 'bg-green-900/30 border-green-500 text-green-400'
                    : 'bg-dark-surface border-maroon-900/50 text-gray-400 hover:border-maroon-700'
                }`}
              >
                <FaChalkboardTeacher className="text-sm" />
                <span className="text-xs">Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('ADMIN')}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg border transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'bg-maroon-900/30 border-maroon-500 text-maroon-400'
                    : 'bg-dark-surface border-maroon-900/50 text-gray-400 hover:border-maroon-700'
                }`}
              >
                <FaShieldAlt className="text-sm" />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                User ID
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                  placeholder={
                    selectedRole === 'STUDENT' ? 'e.g., 001, 002' :
                    selectedRole === 'TEACHER' ? 'e.g., DR001, DR002' :
                    selectedRole === 'ADMIN' ? 'ADMIN' : 'Enter your User ID'
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                  placeholder={
                    selectedRole === 'STUDENT' ? 'student123' :
                    selectedRole === 'TEACHER' ? 'teacher123' :
                    selectedRole === 'ADMIN' ? 'admin123' : 'Enter your password'
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : (selectedRole ? `Sign In as ${selectedRole}` : 'Sign In')}
            </button>
          </form>

          {/* Role-specific credentials display */}
          {selectedRole && (
            <div className="bg-dark-surface p-4 rounded-lg border border-maroon-900/30">
              <h3 className="text-gray-300 font-medium text-sm mb-3">
                {selectedRole} Login Credentials
              </h3>
              <div className="text-left space-y-2 text-xs">
                {selectedRole === 'STUDENT' && (
                  <div className="space-y-1">
                    <div className="text-white font-medium">Student IDs:</div>
                    <div className="text-white"><strong className="text-blue-400">001:</strong> Alice Johnson (Math 101)</div>
                    <div className="text-white"><strong className="text-blue-400">002:</strong> Bob Smith (Math 101)</div>
                    <div className="text-white"><strong className="text-blue-400">003:</strong> Carol Davis (Science 101)</div>
                    <div className="text-white"><strong className="text-blue-400">004:</strong> David Wilson (Science 101)</div>
                    <div className="text-white"><strong className="text-blue-400">005:</strong> Eva Martinez (English 101)</div>
                    <div className="text-white mt-2"><strong className="text-blue-400">Password:</strong> student123</div>
                  </div>
                )}
                {selectedRole === 'TEACHER' && (
                  <div className="space-y-1">
                    <div className="text-white font-medium">Teacher IDs:</div>
                    <div className="text-white"><strong className="text-green-400">DR001:</strong> Dr. Sarah Williams (Math 101)</div>
                    <div className="text-white"><strong className="text-green-400">DR002:</strong> Prof. Michael Brown (Science 101)</div>
                    <div className="text-white"><strong className="text-green-400">MS001:</strong> Ms. Emily Davis (English 101)</div>
                    <div className="text-white mt-2"><strong className="text-green-400">Password:</strong> teacher123</div>
                  </div>
                )}
                {selectedRole === 'ADMIN' && (
                  <div className="space-y-1">
                    <div className="text-white font-medium">Admin ID:</div>
                    <div className="text-white"><strong className="text-maroon-400">ADMIN:</strong> Admin User (System Administrator)</div>
                    <div className="text-white mt-2"><strong className="text-maroon-400">Password:</strong> admin123</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-maroon-400 hover:text-maroon-300 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
