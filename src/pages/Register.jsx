import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaIdCard } from 'react-icons/fa'
import { useAttendance } from '../context/AttendanceContext'

const Register = ({ onLogin }) => {
  const { addStudent } = useAttendance()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentNumber: '',
    className: '',
    role: 'STUDENT'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.role === 'STUDENT') {
      try {
        const result = addStudent({
          name: formData.name,
          email: formData.email,
          student_number: formData.studentNumber,
          class_name: formData.className
        })

        if (result.success) {
          setSuccess('Registration successful! You can now login.')
          setTimeout(() => {
            navigate('/login')
          }, 2000)
        } else {
          setError(result.message || 'Registration failed')
        }
      } catch (error) {
        setError('Registration failed')
      }
    } else {
      setError('Admin and Teacher registration is managed by system administrators')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-surface via-dark-primary to-dark-secondary px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-dark-card rounded-2xl shadow-2xl p-8 border border-maroon-900/30">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Register for attendance system</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER" disabled>Teacher (Admin Only)</option>
                <option value="ADMIN" disabled>Admin (System Only)</option>
              </select>
            </div>

            {formData.role === 'STUDENT' && (
              <>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Student Number
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.studentNumber}
                      onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                      placeholder="e.g., STU001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                    placeholder="e.g., 10A, 11B"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {formData.role === 'STUDENT' ? 'Register' : 'Register (Disabled)'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-maroon-400 hover:text-maroon-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
