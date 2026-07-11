import { useState, useEffect } from 'react'
import { FaVideo, FaStop, FaCheckCircle, FaUser, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const AttendanceSession = () => {
  const { 
    attendanceEnabled, 
    enableAttendance, 
    disableAttendance, 
    attendanceSession,
    loadAttendanceRecords,
    attendanceRecords,
    getStudentsByClass,
    getAllClasses
  } = useAttendance()
  
  const [selectedClass, setSelectedClass] = useState('')
  const [submittedStudents, setSubmittedStudents] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    rate: 0
  })
  const [loading, setLoading] = useState(false)
  
  const classes = getAllClasses()
  const today = new Date().toISOString().split('T')[0]
  
  // Get students for selected class or active session class
  const activeClass = attendanceSession?.class_name || selectedClass
  const classStudents = activeClass ? getStudentsByClass(activeClass) : []

  // Set selected class from active session on mount
  useEffect(() => {
    if (attendanceSession?.class_name) {
      setSelectedClass(attendanceSession.class_name)
    } else if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0])
    }
  }, [attendanceSession, classes])

  // Load and update attendance data
  useEffect(() => {
    const loadData = async () => {
      if (activeClass) {
        setLoading(true)
        const todayRecords = await loadAttendanceRecords(today)

        const classAttendance = Object.keys(todayRecords)
          .filter(id => {
            const record = todayRecords[id]
            const student = classStudents.find(s => s.id.toString() === id)
            return student && student.class_name === activeClass
          })
          .reduce((acc, id) => {
            acc[id] = todayRecords[id]
            return acc
          }, {})

        // Get students who submitted attendance
        const submitted = Object.keys(classAttendance).map(studentId => {
          const record = classAttendance[studentId]
          const student = classStudents.find(s =>
            s.id === parseInt(studentId) || s.id.toString() === studentId.toString()
          )
          if (student) {
            return {
              ...student,
              submission: record,
              time: record.time_in
                ? new Date(record.time_in).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })
                : '-'
            }
          }
          return null
        }).filter(Boolean)

        setSubmittedStudents(submitted)

        const totalStudents = classStudents.length
        const presentCount = submitted.length
        const absentCount = totalStudents - presentCount
        const attendanceRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0

        setStats({
          total: totalStudents,
          present: presentCount,
          absent: absentCount,
          rate: parseFloat(attendanceRate)
        })
        setLoading(false)
      }
    }

    loadData()
  }, [activeClass, today, classStudents, loadAttendanceRecords])

  const handleEnable = async () => {
    if (!selectedClass) {
      alert('Please select a class first')
      return
    }
    await enableAttendance(selectedClass)
  }

  const handleDisable = async () => {
    await disableAttendance()
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Attendance Control</h2>
        <p className="text-gray-400">Enable or disable student attendance submission for a class</p>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={attendanceEnabled}
            className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
          {classes.length === 0 && (
            <p className="text-yellow-400 text-sm mt-2">
              No classes available. Please add students with class names first.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Attendance Status</h3>
            <p className="text-gray-400">
              {attendanceEnabled && activeClass
                ? `Students in class ${activeClass} can now submit their attendance` 
                : 'Attendance is currently disabled'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {attendanceEnabled ? (
              <>
                <div className="flex items-center gap-2 text-green-400">
                  <FaToggleOn className="text-3xl" />
                  <span className="font-semibold">Enabled</span>
                </div>
                <button
                  onClick={handleDisable}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <FaStop />
                  Disable Attendance
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-gray-400">
                  <FaToggleOff className="text-3xl" />
                  <span className="font-semibold">Disabled</span>
                </div>
                <button
                  onClick={handleEnable}
                  disabled={!selectedClass}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaVideo />
                  Enable Attendance
                </button>
              </>
            )}
          </div>
        </div>

        {attendanceSession && (
          <div className="bg-dark-surface rounded-lg p-4 border border-maroon-900/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Class</p>
                <p className="text-white font-semibold">{attendanceSession.class_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Date</p>
                <p className="text-white font-semibold">{attendanceSession.date}</p>
              </div>
              <div>
                <p className="text-gray-400">Started At</p>
                <p className="text-white font-semibold">
                  {attendanceSession.start_time 
                    ? new Date(attendanceSession.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeClass && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
              <h3 className="text-xl font-bold text-white mb-4">
                Student Submissions - Class {activeClass}
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : submittedStudents.length > 0 ? (
                  submittedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-4 bg-dark-surface rounded-lg border border-maroon-900/30"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-700 flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-gray-400 text-sm">#{student.student_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold text-sm">{student.time}</p>
                        <FaCheckCircle className="text-green-400 mt-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No students have submitted attendance yet</p>
                    {!attendanceEnabled && (
                      <p className="text-gray-500 text-sm mt-2">Enable attendance to allow submissions</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
            <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="bg-dark-surface rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-500 text-xs mt-1">in Class {activeClass}</p>
              </div>
              <div className="bg-dark-surface rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Present</p>
                <p className="text-3xl font-bold text-green-400">{stats.present}</p>
              </div>
              <div className="bg-dark-surface rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Absent</p>
                <p className="text-3xl font-bold text-red-400">{stats.absent}</p>
              </div>
              <div className="bg-dark-surface rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold text-maroon-400">{stats.rate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceSession
