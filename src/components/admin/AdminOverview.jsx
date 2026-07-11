import { useState, useEffect } from 'react'
import { FaUsers, FaChalkboardTeacher, FaUserGraduate, FaChartLine, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAttendance } from '../../context/AttendanceContext'
import { Link } from 'react-router-dom'

const AdminOverview = () => {
  const { students, teachers, loadAttendanceRecords, attendanceRecords } = useAttendance()
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    present: 0,
    absent: 0
  })
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      try {
        // Load attendance for today and previous 5 days
        const weekData = []
        const dates = []

        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateKey = date.toISOString().split('T')[0]
          dates.push(dateKey)

          weekData.push({
            dateKey,
            displayName: date.toLocaleDateString('en-US', { weekday: 'short' })
          })
        }

        // Load all dates in parallel
        await Promise.all(dates.map(date => loadAttendanceRecords(date)))

        // Process weekly data
        const weeklyCharts = weekData.map(({ dateKey, displayName }) => {
          const dayRecords = attendanceRecords[dateKey] || {}
          const present = Object.keys(dayRecords).length
          const absent = Math.max(0, students.length - present)

          return {
            name: displayName,
            present,
            absent
          }
        })

        // Calculate today's stats
        const todayRecords = attendanceRecords[today] || {}
        const presentCount = Object.keys(todayRecords).length
        const totalStudents = students.length
        const absentCount = Math.max(0, totalStudents - presentCount)

        setStats({
          students: totalStudents,
          teachers: teachers.length,
          present: presentCount,
          absent: absentCount
        })

        setAttendanceData(weeklyCharts)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [students, teachers, today, loadAttendanceRecords])

  const statsCards = [
    { label: 'Total Students', value: stats.students, icon: FaUserGraduate, color: 'from-blue-600 to-blue-700' },
    { label: 'Total Teachers', value: stats.teachers, icon: FaChalkboardTeacher, color: 'from-green-600 to-green-700' },
    { label: 'Today Present', value: stats.present, icon: FaCheckCircle, color: 'from-maroon-600 to-maroon-700' },
    { label: 'Today Absent', value: stats.absent, icon: FaTimesCircle, color: 'from-red-600 to-red-700' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Admin Overview</h2>
        <p className="text-gray-400">Complete system control and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-white">{loading ? '...' : stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <h3 className="text-xl font-bold text-white mb-4">Weekly Attendance</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a1a1a" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2a0010',
                    border: '1px solid #800020',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name="Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No attendance data yet
            </div>
          )}
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/students"
              className="w-full text-left p-4 bg-dark-surface rounded-lg hover:bg-maroon-900/20 transition-all border border-maroon-900/30 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Student Management</span>
                <span className="text-maroon-400">→</span>
              </div>
            </Link>
            <Link
              to="/admin/teachers"
              className="w-full text-left p-4 bg-dark-surface rounded-lg hover:bg-maroon-900/20 transition-all border border-maroon-900/30 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Teacher Management</span>
                <span className="text-maroon-400">→</span>
              </div>
            </Link>
            <Link
              to="/admin/attendance"
              className="w-full text-left p-4 bg-dark-surface rounded-lg hover:bg-maroon-900/20 transition-all border border-maroon-900/30 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Attendance Reports & Data</span>
                <span className="text-maroon-400">→</span>
              </div>
            </Link>
            <Link
              to="/admin/classes"
              className="w-full text-left p-4 bg-dark-surface rounded-lg hover:bg-maroon-900/20 transition-all border border-maroon-900/30 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">System Structure & Classes</span>
                <span className="text-maroon-400">→</span>
              </div>
            </Link>
            <Link
              to="/admin/database"
              className="w-full text-left p-4 bg-dark-surface rounded-lg hover:bg-maroon-900/20 transition-all border border-maroon-900/30 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Database Tools & Logs</span>
                <span className="text-maroon-400">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
