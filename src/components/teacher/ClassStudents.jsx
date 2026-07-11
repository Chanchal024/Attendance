import { useState, useEffect } from 'react'
import { FaSearch, FaUserCircle } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const ClassStudents = () => {
  const { students, getAllClasses, getStudentsByClass, loadAttendanceRecords, attendanceRecords } = useAttendance()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const classes = getAllClasses()
  const classStudents = selectedClass ? getStudentsByClass(selectedClass) : students

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await loadAttendanceRecords(today)
      setLoading(false)
    }
    loadData()
  }, [today, loadAttendanceRecords])

  const todayAttendance = attendanceRecords[today] || {}

  const filteredStudents = classStudents.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate attendance percentage for each student
  const getAttendancePercentage = (studentId) => {
    let presentCount = 0
    let totalDays = 0

    Object.keys(attendanceRecords).forEach(date => {
      const dateAttendance = attendanceRecords[date] || {}
      if (dateAttendance[studentId] || dateAttendance[studentId.toString()]) {
        presentCount++
      }
      totalDays++
    })

    return totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : 0
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Class Students</h2>
        <p className="text-gray-400">View all students in your classes</p>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <FaUserCircle className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No students found</p>
            <p className="text-gray-500 text-sm">
              {selectedClass ? `No students in class ${selectedClass}` : 'Add students to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => {
              const studentId = student.id || student.id?.toString()
              const isPresentToday = todayAttendance[studentId] ? true : false
              const attendancePercent = getAttendancePercentage(studentId)
              
              return (
                <div
                  key={student.id}
                  className="bg-dark-surface rounded-lg p-5 border border-maroon-900/30 hover:border-maroon-700/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-700 flex items-center justify-center">
                      <FaUserCircle className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{student.name}</h3>
                      <p className="text-gray-400 text-sm">#{student.student_number}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm">{student.email || '-'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Class:</span>
                      <span className="px-2 py-1 bg-maroon-900/30 text-maroon-300 rounded text-xs">
                        {student.class_name || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Today:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        isPresentToday 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'bg-red-900/30 text-red-300'
                      }`}>
                        {isPresentToday ? 'Present' : 'Absent'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Attendance:</span>
                      <span className="text-green-400 font-semibold">{attendancePercent}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassStudents
