import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const AttendanceHistory = () => {
  const { students, loadAttendanceRecords, attendanceRecords, getStudentsByClass } = useAttendance()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [loading, setLoading] = useState(false)

  const classes = [...new Set(students.map(s => s.class_name).filter(Boolean))].sort()
  const allClasses = ['all', ...classes]

  useEffect(() => {
    const loadData = async () => {
      if (selectedDate) {
        setLoading(true)
        await loadAttendanceRecords(selectedDate)
        setLoading(false)
      }
    }
    loadData()
  }, [selectedDate, loadAttendanceRecords])

  // Get attendance for selected date
  const dateRecords = attendanceRecords[selectedDate] || {}
  
  // Filter by class if selected
  let filteredRecords = Object.keys(dateRecords).map(studentId => {
    const record = dateRecords[studentId]
    const student = students.find(s => 
      s.id === parseInt(studentId) || s.id.toString() === studentId.toString()
    )
    return {
      ...record,
      student: student || { name: 'Unknown', student_number: 'N/A' }
    }
  })

  if (selectedClass && selectedClass !== 'all') {
    filteredRecords = filteredRecords.filter(item => item.student.class_name === selectedClass)
  }

  if (searchTerm) {
    filteredRecords = filteredRecords.filter(item =>
      item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student?.student_number?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Get unique dates with attendance
  const datesWithAttendance = Object.keys(attendanceRecords)
    .filter(date => Object.keys(attendanceRecords[date]).length > 0)
    .sort()
    .reverse()
    .slice(0, 5)

  const attendanceHistory = datesWithAttendance.map(date => {
    const dayRecords = attendanceRecords[date] || {}
    const present = Object.keys(dayRecords).length
    const total = selectedClass && selectedClass !== 'all'
      ? getStudentsByClass(selectedClass).length
      : students.length
    const absent = total - present
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0
    
    return {
      date,
      present,
      absent,
      percentage: parseFloat(percentage)
    }
  })

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Attendance History</h2>
        <p className="text-gray-400">View attendance records by date</p>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Select Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Filter by Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
            >
              {allClasses.map(cls => (
                <option key={cls} value={cls}>
                  {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Search Student</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Records</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : attendanceHistory.length > 0 ? (
            <div className="space-y-3">
              {attendanceHistory.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dark-surface rounded-lg border border-maroon-900/30 hover:border-maroon-700/50 transition-all"
                >
                  <div>
                    <p className="text-white font-medium">{record.date}</p>
                    <p className="text-gray-400 text-sm">
                      Present: {record.present} | Absent: {record.absent}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-maroon-400">{record.percentage}%</p>
                    <p className="text-gray-400 text-sm">Attendance Rate</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No attendance records found</div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Student Attendance Details - {selectedDate}</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-maroon-900/30">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Student Number</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record, index) => (
                      <tr key={index} className="border-b border-maroon-900/20 hover:bg-dark-surface/50 transition-colors">
                        <td className="py-4 px-4 text-white">{record.student?.student_number}</td>
                        <td className="py-4 px-4 text-white">{record.student?.name}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-fit ${
                              record.status === 'present'
                                ? 'bg-green-900/30 text-green-300'
                                : 'bg-red-900/30 text-red-300'
                            }`}
                          >
                            {record.status === 'present' ? <FaCheckCircle /> : <FaTimesCircle />}
                            {record.status || 'Present'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {record.time_in 
                            ? new Date(record.time_in).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400">
                        No attendance records found for this date
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AttendanceHistory
