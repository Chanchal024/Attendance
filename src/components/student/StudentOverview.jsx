import { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChartLine, FaClock } from 'react-icons/fa'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useAttendance } from '../../context/AttendanceContext'
import SubmitAttendance from './SubmitAttendance'

const StudentOverview = ({ user }) => {
  const { 
    getStudentAttendance, 
    loadAttendanceRecords,
    attendanceRecords,
    isAttendanceEnabled 
  } = useAttendance()
  
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    total: 0,
    rate: 0
  })
  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  // Get student ID from user
  const studentId = user?.id || user?.student_id

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      try {
        // Load attendance for last 7 days
        const dates = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          dates.push(date.toISOString().split('T')[0])
        }

        // Load all dates in parallel
        await Promise.all(dates.map(date => loadAttendanceRecords(date)))

        // Calculate statistics
        let presentCount = 0
        const recent = []

        dates.forEach(date => {
          const dateRecords = attendanceRecords[date] || {}
          const attendance = dateRecords[studentId] || dateRecords[studentId?.toString()]
          if (attendance) {
            presentCount++
            recent.push({
              date,
              status: 'Present',
              time: attendance.time_in
                ? new Date(attendance.time_in).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '-'
            })
          } else {
            recent.push({
              date,
              status: 'Absent',
              time: '-'
            })
          }
        })

        const totalDays = dates.length
        const absentCount = totalDays - presentCount
        const rate = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : '0.0'

        setStats({
          present: presentCount,
          absent: absentCount,
          total: totalDays,
          rate: parseFloat(rate)
        })

        setRecentAttendance(recent.reverse())
      } catch (error) {
        console.error('Error loading student data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      loadData()
    }
  }, [studentId, loadAttendanceRecords])

  const attendanceData = [
    { name: 'Present', value: stats.present, color: '#10b981' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' },
  ]

  const statsCards = [
    { label: 'Days Present', value: stats.present, icon: FaCheckCircle, color: 'from-green-600 to-green-700' },
    { label: 'Days Absent', value: stats.absent, icon: FaTimesCircle, color: 'from-red-600 to-red-700' },
    { label: 'Attendance Rate', value: `${stats.rate}%`, icon: FaChartLine, color: 'from-maroon-600 to-maroon-700' },
    { label: 'Total Days', value: stats.total, icon: FaCalendarAlt, color: 'from-blue-600 to-blue-700' },
  ]

  const classSchedule = [
    { subject: 'Mathematics', time: '09:00 AM - 10:00 AM', teacher: 'Dr. Sarah Williams' },
    { subject: 'Science', time: '10:15 AM - 11:15 AM', teacher: 'Prof. Michael Brown' },
    { subject: 'English', time: '11:30 AM - 12:30 PM', teacher: 'Ms. Emily Davis' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Dashboard</h2>
        <p className="text-gray-400">View your attendance and class information</p>
      </div>

      {/* Submit Attendance Section */}
      {studentId && <SubmitAttendance studentId={studentId} />}

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
          <h3 className="text-xl font-bold text-white mb-4">Attendance Overview</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2a0010',
                    border: '1px solid #800020',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No attendance data yet
            </div>
          )}
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <h3 className="text-xl font-bold text-white mb-4">Recent Attendance</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : recentAttendance.length > 0 ? (
              recentAttendance.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dark-surface rounded-lg border border-maroon-900/30"
                >
                  <div>
                    <p className="text-white font-medium">{record.date}</p>
                    <p className="text-gray-400 text-sm">{record.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                      record.status === 'Present'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}
                  >
                    {record.status === 'Present' ? <FaCheckCircle /> : <FaTimesCircle />}
                    {record.status}
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
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaClock />
          Today's Class Schedule
        </h3>
        <div className="space-y-3">
          {classSchedule.map((classItem, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-dark-surface rounded-lg border border-maroon-900/30 hover:border-maroon-700/50 transition-all"
            >
              <div>
                <p className="text-white font-semibold">{classItem.subject}</p>
                <p className="text-gray-400 text-sm">{classItem.teacher}</p>
              </div>
              <div className="text-right">
                <p className="text-maroon-400 font-medium">{classItem.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudentOverview
