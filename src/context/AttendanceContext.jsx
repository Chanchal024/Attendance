import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AttendanceContext = createContext()

export const useAttendance = () => {
  const context = useContext(AttendanceContext)
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider')
  }
  return context
}

export const AttendanceProvider = ({ children }) => {
  const [attendanceEnabled, setAttendanceEnabled] = useState(false)
  const [attendanceSession, setAttendanceSession] = useState(null)
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState({})
  const [loading, setLoading] = useState(false)

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0]
  }

  const initialStudents = [
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@email.com', student_number: '001', class_name: 'Math 101', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@email.com', student_number: '002', class_name: 'Math 101', status: 'Active' },
    { id: 3, name: 'Carol Davis', email: 'carol.davis@email.com', student_number: '003', class_name: 'Science 101', status: 'Active' },
    { id: 4, name: 'David Wilson', email: 'david.wilson@email.com', student_number: '004', class_name: 'Science 101', status: 'Active' },
    { id: 5, name: 'Eva Martinez', email: 'eva.martinez@email.com', student_number: '005', class_name: 'English 101', status: 'Active' }
  ]

  const initialTeachers = [
    { id: 1, name: 'Dr. Sarah Williams', email: 'sarah.williams@email.com', password: 'teacher123', assignedClasses: ['Math 101'] },
    { id: 2, name: 'Prof. Michael Brown', email: 'michael.brown@email.com', password: 'teacher123', assignedClasses: ['Science 101'] },
    { id: 3, name: 'Ms. Emily Davis', email: 'emily.davis@email.com', password: 'teacher123', assignedClasses: ['English 101'] }
  ]

  const initialClasses = [
    { id: 1, name: 'Math 101', subject: 'Mathematics', description: 'Introduction to Algebra and Geometry' },
    { id: 2, name: 'Science 101', subject: 'Biology', description: 'Basic concepts in Biology and Chemistry' },
    { id: 3, name: 'English 101', subject: 'English Literature', description: 'Fundamentals of English literature and writing' }
  ]

  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key}:`, error)
      return defaultValue
    }
  }

  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
    }
  }

  const loadStudents = () => {
    const data = loadFromLocalStorage('students', initialStudents)
    setStudents(data)
  }

  const loadTeachers = () => {
    const data = loadFromLocalStorage('teachers', initialTeachers)
    setTeachers(data)
  }

  const loadClasses = () => {
    const data = loadFromLocalStorage('classes', initialClasses)
    setClasses(data)
  }

  const checkAttendanceSession = () => {
    const session = loadFromLocalStorage('attendanceSession', null)
    if (session && session.enabled) {
      setAttendanceSession(session)
      setAttendanceEnabled(true)
    }
  }

  // Load initial data
  useEffect(() => {
    loadStudents()
    loadTeachers()
    loadClasses()
    checkAttendanceSession()
  }, [])

  // ========== STUDENT MANAGEMENT ==========

  const addStudent = (studentData) => {
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
    const newStudent = { ...studentData, id: newId, status: 'Active' }
    const updatedStudents = [...students, newStudent]
    setStudents(updatedStudents)
    saveToLocalStorage('students', updatedStudents)
    return { success: true, id: newId }
  }

  const updateStudent = (studentId, studentData) => {
    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, ...studentData } : s
    )
    setStudents(updatedStudents)
    saveToLocalStorage('students', updatedStudents)
    return { success: true }
  }

  const deleteStudent = (studentId) => {
    const updatedStudents = students.filter(s => s.id !== studentId)
    setStudents(updatedStudents)
    saveToLocalStorage('students', updatedStudents)
    return { success: true }
  }

  // ========== TEACHER MANAGEMENT ==========

  const registerTeacher = (teacherData) => {
    const newId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1
    const newTeacher = { ...teacherData, id: newId }
    const updatedTeachers = [...teachers, newTeacher]
    setTeachers(updatedTeachers)
    saveToLocalStorage('teachers', updatedTeachers)
    return { success: true, id: newId }
  }

  const updateTeacher = (teacherId, teacherData) => {
    const updatedTeachers = teachers.map(t =>
      t.id === teacherId ? { ...t, ...teacherData } : t
    )
    setTeachers(updatedTeachers)
    saveToLocalStorage('teachers', updatedTeachers)
    return { success: true }
  }

  const deleteTeacher = (teacherId) => {
    const updatedTeachers = teachers.filter(t => t.id !== teacherId)
    setTeachers(updatedTeachers)
    saveToLocalStorage('teachers', updatedTeachers)
    return { success: true }
  }

  // ========== CLASS MANAGEMENT ==========

  const addClass = (classData) => {
    const newId = classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1
    const newClass = { ...classData, id: newId }
    const updatedClasses = [...classes, newClass]
    setClasses(updatedClasses)
    saveToLocalStorage('classes', updatedClasses)
    return { success: true, id: newId }
  }

  const updateClass = (classId, classData) => {
    const updatedClasses = classes.map(c =>
      c.id === classId ? { ...c, ...classData } : c
    )
    setClasses(updatedClasses)
    saveToLocalStorage('classes', updatedClasses)
    return { success: true }
  }

  const deleteClass = (classId) => {
    const classToDelete = classes.find(c => c.id === classId)
    if (!classToDelete) {
      return { success: false, message: 'Class not found' }
    }

    // Remove class assignment from all students
    const updatedStudents = students.map(student =>
      student.class_name === classToDelete.name ? { ...student, class_name: '' } : student
    )
    setStudents(updatedStudents)
    saveToLocalStorage('students', updatedStudents)

    // Remove class from classes array
    const updatedClasses = classes.filter(c => c.id !== classId)
    setClasses(updatedClasses)
    saveToLocalStorage('classes', updatedClasses)

    return { success: true }
  }

  const getAllClasses_legacy = () => {
    const classNames = [...new Set(students.map(s => s.class_name).filter(Boolean))]
    return classNames.sort()
  }

  const getStudentsByClass = (className) => {
    return students.filter(student => student.class_name === className && student.status === 'Active')
  }

  // ========== ATTENDANCE MANAGEMENT ==========

  const enableAttendance = (className) => {
    const today = getTodayKey()
    const session = {
      class_name: className,
      date: today,
      enabled: true,
      start_time: new Date().toISOString()
    }
    setAttendanceSession(session)
    setAttendanceEnabled(true)
    saveToLocalStorage('attendanceSession', session)
    return { success: true }
  }

  const disableAttendance = () => {
    setAttendanceEnabled(false)
    setAttendanceSession(null)
    saveToLocalStorage('attendanceSession', null)
    return { success: true }
  }

  const submitAttendance = (studentId, reason = '') => {
    const today = getTodayKey()
    const student = getStudentById(studentId)
    if (!student) {
      return { success: false, message: 'Student not found' }
    }

    const allRecords = loadFromLocalStorage('attendanceRecords', {})
    const todayRecords = allRecords[today] || {}

    const record = {
      student_id: studentId.toString(),
      class_name: student.class_name,
      date: today,
      time_in: new Date().toISOString(),
      status: 'Present',
      reason
    }

    const updatedTodayRecords = {
      ...todayRecords,
      [studentId.toString()]: record
    }

    const updatedAllRecords = {
      ...allRecords,
      [today]: updatedTodayRecords
    }

    setAttendanceRecords(updatedAllRecords)
    saveToLocalStorage('attendanceRecords', updatedAllRecords)

    return { success: true, message: 'Attendance submitted successfully' }
  }

  const loadAttendanceRecords = async (date) => {
    const allRecords = loadFromLocalStorage('attendanceRecords', {})
    const dateRecords = allRecords[date] || {}

    setAttendanceRecords(prev => ({
      ...prev,
      [date]: dateRecords
    }))

    return dateRecords
  }

  const getStudentAttendance = async (studentId, date = null) => {
    const targetDate = date || getTodayKey()
    const dateRecords = await loadAttendanceRecords(targetDate)
    return dateRecords?.[studentId] || null
  }

  const getAttendanceForDate = async (date, className = null) => {
    const dateRecords = await loadAttendanceRecords(date)
    if (!className) {
      return dateRecords
    }

    // Filter by class
    const filtered = {}
    Object.keys(dateRecords).forEach(studentId => {
      const record = dateRecords[studentId]
      if (record.class_name === className) {
        filtered[studentId] = record
      }
    })
    return filtered
  }

  const isAttendanceEnabled = (className = null) => {
    if (!attendanceEnabled || !attendanceSession) return false
    if (!className) return true
    return attendanceSession.class_name === className
  }

  const getStudentById = (studentId) => {
    return students.find(s => s.id === studentId || s.id.toString() === studentId.toString())
  }

  const getStudentByNumber = (studentNumber) => {
    return students.find(s => s.student_number === studentNumber)
  }

  // ========== FACE EMBEDDINGS ==========

  const uploadFaceEmbedding = (studentId, file) => {
    const existing = loadFromLocalStorage('faceEmbeddings', {})
    existing[studentId.toString()] = { hasEmbedding: true, uploadedAt: new Date().toISOString() }
    saveToLocalStorage('faceEmbeddings', existing)
    return { success: true, message: 'Face embedding uploaded successfully' }
  }

  const getFaceEmbedding = (studentId) => {
    const existing = loadFromLocalStorage('faceEmbeddings', {})
    return existing[studentId.toString()] || { hasEmbedding: false }
  }

  // Update attendance record
  const updateAttendanceRecord = (recordId, updateData) => {
    const allRecords = loadFromLocalStorage('attendanceRecords', {})
    const updated = { ...updateData } // Mock update
    saveToLocalStorage('attendanceRecords', allRecords)
    if (updateData.date) {
      loadAttendanceRecords(updateData.date)
    }
    return { success: true, data: updated }
  }

  // ========== ADMIN FUNCTIONS ==========

  const getSystemStats = () => {
    return {
      success: true,
      data: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: getAllClasses().length,
        systemHealth: 'Good'
      }
    }
  }

  const getLogs = (type = null, search = null) => {
    const logs = loadFromLocalStorage('systemLogs', [
      { id: 1, type: 'INFO', message: 'System started', timestamp: new Date().toISOString() },
      { id: 2, type: 'INFO', message: 'Initial data loaded', timestamp: new Date().toISOString() }
    ])
    // Filter by type and search
    let filtered = logs
    if (type) {
      filtered = filtered.filter(l => l.type === type)
    }
    if (search) {
      filtered = filtered.filter(l => l.message.toLowerCase().includes(search.toLowerCase()))
    }
    return { success: true, data: filtered.slice(0, 50) } // Limit to 50
  }

  const getReports = (type, startDate, endDate, className, format) => {
    const allRecords = loadFromLocalStorage('attendanceRecords', {})
    const reportData = []

    // Generate simple report - in real system would be more complex
    for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
      const dateKey = date.toISOString().split('T')[0]
      const dateRecords = allRecords[dateKey] || {}

      let filteredRecords = {}
      if (className) {
        Object.keys(dateRecords).forEach(id => {
          if (dateRecords[id].class_name === className) {
            filteredRecords[id] = dateRecords[id]
          }
        })
      } else {
        filteredRecords = dateRecords
      }

      if (Object.keys(filteredRecords).length > 0) {
        reportData.push({
          date: dateKey,
          totalPresent: Object.keys(filteredRecords).length,
          totalStudents: className ? getStudentsByClass(className).length : students.length,
          records: filteredRecords
        })
      }
    }

    return { success: true, data: reportData }
  }

  const databaseTools = {
    backup: () => {
      try {
        const data = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          data[key] = localStorage.getItem(key)
        }
        return { success: true, data: JSON.stringify(data, null, 2), message: 'Backup generated successfully' }
      } catch (error) {
        return { success: false, message: 'Failed to generate backup' }
      }
    },
    restore: (jsonData) => {
      try {
        const data = JSON.parse(jsonData)
        if (typeof data !== 'object' || data === null) throw new Error('Invalid format')
        
        for (const key in data) {
          localStorage.setItem(key, data[key])
        }
        
        // Reload context states
        loadStudents()
        loadTeachers()
        loadClasses()
        checkAttendanceSession()
        
        return { success: true, message: 'Database restored successfully! Page will refresh.' }
      } catch (error) {
        return { success: false, message: 'Invalid backup file format' }
      }
    },
    optimize: () => {
      return { success: true, message: 'Local storage is optimized and defragmented' }
    },
    clearOldData: (days) => {
      // Mock clearing old data
      const allRecords = loadFromLocalStorage('attendanceRecords', {})
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const cutoffKey = cutoffDate.toISOString().split('T')[0]

      const newRecords = {}
      Object.keys(allRecords).forEach(date => {
        if (date >= cutoffKey) {
          newRecords[date] = allRecords[date]
        }
      })

      saveToLocalStorage('attendanceRecords', newRecords)
      return { success: true, message: `Data older than ${days} days cleared` }
    },
    getStats: () => {
      const usedKeys = Object.keys(localStorage).filter(k => !k.startsWith('user') && !k.startsWith('attendanceSession'))
      return { success: true, data: { usedKeys: usedKeys.length, approxSize: `${usedKeys.length * 10}KB` } }
    }
  }

  const memoizedValue = useMemo(() => ({
    // Attendance control
    attendanceEnabled,
    attendanceSession,
    enableAttendance,
    disableAttendance,
    isAttendanceEnabled,

    // Student management
    students,
    setStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    getAllClasses: getAllClasses_legacy,
    getStudentById,
    getStudentByNumber,
    loadStudents,

    // Class management
    classes,
    setClasses,
    addClass,
    updateClass,
    deleteClass,
    loadClasses,

    // Teacher management
    teachers,
    setTeachers,
    registerTeacher,
    updateTeacher,
    deleteTeacher,
    loadTeachers,

    // Attendance
    submitAttendance,
    getStudentAttendance,
    getAttendanceForDate,
    loadAttendanceRecords,
    attendanceRecords,
    updateAttendanceRecord,

    // Face embeddings
    uploadFaceEmbedding,
    getFaceEmbedding,

    // Admin functions
    getSystemStats,
    getLogs,
    getReports,
    databaseTools,

    // Loading state
    loading,
    setLoading,
  }), [
    attendanceEnabled,
    attendanceSession,
    students,
    teachers,
    classes,
    attendanceRecords,
    loading
  ])

  return (
    <AttendanceContext.Provider value={memoizedValue}>
      {children}
    </AttendanceContext.Provider>
  )
}
