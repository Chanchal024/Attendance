import { useState, useEffect } from 'react'
import { FaUsers, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChartBar } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAttendance } from '../../context/AttendanceContext'
import { Link } from 'react-router-dom'

const TeacherOverview = () => {
  const { 
    students, 
    loadAttendanceRecords,
    attendanceRecords,
    attendanceEnabled,
    attendanceSession,
    getAllClasses
  } = useAttendance()
  
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    rate: 0
  })
  const [recentAttendance, setRecentAttendance] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]
  const classes = getAllClasses()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      try {
        // Load all required attendance data
        const promises = []
        const weekData = []

        // Load data for current week (today and 4 previous days)
        for (let i = 4; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateKey = date.toISOString().split('T')[0]

          // Load data for this date if we don't have it or want fresh data
          promises.push(loadAttendanceRecords(dateKey))

          weekData.push({
            dateKey,
            displayDay: date.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: dateKey
          })
        }

        // Wait for all data to be loaded
        await Promise.all(promises)

        // Process weekly data
        const weeklyCharts = weekData.map(({ dateKey, displayDay }) => {
          const dayRecords = attendanceRecords[dateKey] || {}
          const dayAttendance = attendanceSession?.class_name
            ? Object.keys(dayRecords).filter(id => {
                const student = students.find(s => s.id.toString() === id)
                return student && student.class_name === attendanceSession.class_name
              }).reduce((acc, id) => {
                acc[id] = dayRecords[id]
                return acc
              }, {})
            : dayRecords

          const present = Object.keys(dayAttendance).length
          const dayTotal = attendanceSession?.class_name
            ? students.filter(s => s.class_name === attendanceSession.class_name).length
            : students.length
          const absent = Math.max(0, dayTotal - present) // Ensure non-negative

          return {
            day: displayDay,
            present,
            absent
          }
        })

        // Calculate today's stats
        const todayRecords = attendanceRecords[today] || {}
        const todayAttendance = attendanceSession?.class_name
          ? Object.keys(todayRecords).filter(id => {
              const student = students.find(s => s.id.toString() === id)
              return student && student.class_name === attendanceSession.class_name
            }).reduce((acc, id) => {
              acc[id] = todayRecords[id]
              return acc
            }, {})
          : todayRecords

        const presentCount = Object.keys(todayAttendance).length
        const totalStudents = attendanceSession?.class_name
          ? students.filter(s => s.class_name === attendanceSession.class_name).length
          : students.length
        const absentCount = Math.max(0, totalStudents - presentCount)
        const rate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : '0.0'

        setStats({
          total: totalStudents,
          present: presentCount,
          absent: absentCount,
          rate: parseFloat(rate)
        })

        // Get recent attendance list
        const studentsToShow = attendanceSession?.class_name
          ? students.filter(s => s.class_name === attendanceSession.class_name).slice(0, 4)
          : students.slice(0, 4)

        const recent = studentsToShow.map(student => {
          const attendance = todayAttendance[student.id] || todayAttendance[student.id.toString()]
          return {
            name: student.name,
            status: attendance ? 'Present' : 'Absent',
            time: attendance?.time_in
              ? new Date(attendance.time_in).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '-'
          }
        })

        setRecentAttendance(recent)
        setWeeklyData(weeklyCharts)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [today, students, attendanceSession, loadAttendanceRecords])

  const statsCards = [
    { label: 'Total Students', value: stats.total, icon: FaUsers, color: 'from-blue-600 to-blue-700' },
    { label: 'Present Today', value: stats.present, icon: FaCheckCircle, color: 'from-green-600 to-green-700' },
    { label: 'Absent Today', value: stats.absent, icon: FaTimesCircle, color: 'from-red-600 to-red-700' },
    { label: 'Attendance Rate', value: `${stats.rate}%`, icon: FaChartBar, color: 'from-maroon-600 to-maroon-700' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Teacher Dashboard</h2>
        <p className="text-gray-400">Manage your class attendance</p>
      </div>

      {attendanceEnabled && attendanceSession && (
        <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 font-semibold">Attendance Session Active</p>
              <p className="text-green-200 text-sm">Students in class {attendanceSession.class_name} can now submit their attendance</p>
            </div>
            <Link
              to="/teacher/session"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              View Session
            </Link>
          </div>
        </div>
      )}

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
          ) : weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a1a1a" />
                <XAxis dataKey="day" stroke="#9ca3af" />
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
          <h3 className="text-xl font-bold text-white mb-4">Today's Attendance</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : recentAttendance.length > 0 ? (
              recentAttendance.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dark-surface rounded-lg border border-maroon-900/30"
                >
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-gray-400 text-sm">{student.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      student.status === 'Present'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No attendance records yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/teacher/session"
            className="p-6 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg text-left transition-all transform hover:scale-[1.02]"
          >
            <FaCalendarAlt className="text-3xl mb-3" />
            <h4 className="text-xl font-semibold mb-1">Start Attendance Session</h4>
            <p className="text-maroon-200 text-sm">Enable attendance submission for your class</p>
          </Link>
          <Link
            to="/teacher/students"
            className="p-6 bg-dark-surface border border-maroon-900/50 hover:border-maroon-700/50 text-white rounded-lg text-left transition-all"
          >
            <FaUsers className="text-3xl mb-3 text-maroon-400" />
            <h4 className="text-xl font-semibold mb-1">View Class List</h4>
            <p className="text-gray-400 text-sm">See all students in your class</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TeacherOverview
