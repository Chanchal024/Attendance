import { useState, useEffect } from 'react'
import { FaSearch, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const ViewAllAttendance = () => {
  const { attendanceRecords, students, getAllClasses, loadAttendanceRecords } = useAttendance()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const classes = getAllClasses()
  const allClasses = ['all', ...classes]

  // Load attendance for selected date
  useEffect(() => {
    const loadData = async () => {
      if (selectedDate && !attendanceRecords[selectedDate]) {
        setLoading(true)
        await loadAttendanceRecords(selectedDate)
        setLoading(false)
      }
    }
    loadData()
  }, [selectedDate, loadAttendanceRecords])

  // Get attendance for selected date
  const dateAttendance = attendanceRecords[selectedDate] || {}

  // Filter by class if selected
  let filteredAttendance = Object.keys(dateAttendance).map(studentId => {
    const record = dateAttendance[studentId]
    const student = students.find(s => s.id === parseInt(studentId) || s.id.toString() === studentId.toString())
    return {
      ...record,
      student: student || { name: 'Unknown', student_number: 'N/A', class_name: 'N/A' }
    }
  })

  if (selectedClass !== 'all') {
    filteredAttendance = filteredAttendance.filter(item => item.class_name === selectedClass)
  }

  if (searchTerm) {
    filteredAttendance = filteredAttendance.filter(item =>
      item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student_number?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const presentCount = filteredAttendance.length
  const totalStudents = selectedClass === 'all'
    ? students.length
    : students.filter(s => s.class_name === selectedClass).length
  const absentCount = totalStudents - presentCount

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">View All Attendance</h2>
        <p className="text-gray-400">View attendance records across all classes and dates</p>
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
            <label className="block text-gray-300 text-sm mb-2">Search</label>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-surface rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Students</p>
            <p className="text-3xl font-bold text-white">{totalStudents}</p>
          </div>
          <div className="bg-dark-surface rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Present</p>
            <p className="text-3xl font-bold text-green-400">{presentCount}</p>
          </div>
          <div className="bg-dark-surface rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-400">{absentCount}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading attendance data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-maroon-900/30">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Student Number</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Class</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, index) => (
                    <tr key={index} className="border-b border-maroon-900/20 hover:bg-dark-surface/50 transition-colors">
                      <td className="py-4 px-4 text-white">{record.student_number}</td>
                      <td className="py-4 px-4 text-white">{record.student_name || record.student?.name}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-maroon-900/30 text-maroon-300 rounded text-sm">
                          {record.class_name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {record.time_in ? new Date(record.time_in).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-fit bg-green-900/30 text-green-300">
                          <FaCheckCircle />
                          Present
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400">
                      No attendance records found for this date{selectedClass !== 'all' ? ` in class ${selectedClass}` : ''}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewAllAttendance
