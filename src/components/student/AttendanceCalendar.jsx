import { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const AttendanceCalendar = ({ user }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { loadAttendanceRecords, attendanceRecords } = useAttendance()
  
  const studentId = user?.id || user?.student_id
  const [attendanceData, setAttendanceData] = useState({})
  const [loading, setLoading] = useState(false)

  // Load attendance data for the current month
  useEffect(() => {
    const loadMonthData = async () => {
      if (!studentId) return
      
      setLoading(true)
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      // Load all dates in the month
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day)
        const dateKey = date.toISOString().split('T')[0]
        if (!attendanceRecords[dateKey]) {
          await loadAttendanceRecords(dateKey)
        }
      }
      
      // Build attendance data
      const data = {}
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day)
        const dateKey = date.toISOString().split('T')[0]
        const dateRecords = attendanceRecords[dateKey] || {}
        const attendance = dateRecords[studentId] || dateRecords[studentId?.toString()]
        if (attendance) {
          data[dateKey] = 'present'
        }
      }
      
      setAttendanceData(data)
      setLoading(false)
    }
    
    loadMonthData()
  }, [currentMonth, studentId, loadAttendanceRecords, attendanceRecords])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const formatDateKey = (day) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }

  const getAttendanceStatus = (day) => {
    if (!day) return null
    const dateKey = formatDateKey(day)
    return attendanceData[dateKey] || null
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentMonth)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const presentCount = Object.values(attendanceData).filter(status => status === 'present').length
  const absentCount = Object.keys(attendanceData).length - presentCount

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Attendance Calendar</h2>
        <p className="text-gray-400">View your attendance by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-dark-surface rounded-lg transition-all"
              >
                <FaChevronLeft className="text-white" />
              </button>
              <h3 className="text-2xl font-bold text-white">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-dark-surface rounded-lg transition-all"
              >
                <FaChevronRight className="text-white" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-gray-400 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading calendar data...</div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const status = getAttendanceStatus(day)
                  return (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-lg border transition-all ${
                        day
                          ? status === 'present'
                            ? 'bg-green-900/30 border-green-700/50 text-green-300'
                            : status === null
                            ? 'bg-dark-surface border-maroon-900/30 text-white hover:border-maroon-700/50'
                            : 'bg-red-900/30 border-red-700/50 text-red-300'
                          : 'border-transparent'
                      }`}
                    >
                      {day && (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{day}</span>
                          {status && (
                            <span className="text-xs mt-1">
                              {status === 'present' ? <FaCheckCircle /> : <FaTimesCircle />}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-900/30 border border-green-700/50 rounded"></div>
                <span className="text-gray-300 text-sm">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-900/30 border border-red-700/50 rounded"></div>
                <span className="text-gray-300 text-sm">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-dark-surface border border-maroon-900/30 rounded"></div>
                <span className="text-gray-300 text-sm">No Data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
            <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="bg-dark-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Days Present</span>
                  <FaCheckCircle className="text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400">{presentCount}</p>
              </div>
              <div className="bg-dark-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Days Absent</span>
                  <FaTimesCircle className="text-red-400" />
                </div>
                <p className="text-3xl font-bold text-red-400">{absentCount}</p>
              </div>
              <div className="bg-dark-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Attendance Rate</span>
                  <FaCalendarAlt className="text-maroon-400" />
                </div>
                <p className="text-3xl font-bold text-maroon-400">
                  {presentCount + absentCount > 0
                    ? ((presentCount / (presentCount + absentCount)) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceCalendar
