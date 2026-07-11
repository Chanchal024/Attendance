import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserCircle, FaSave, FaTimes, FaUpload, FaCheckCircle, FaUserCheck, FaUsers, FaUserGraduate, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const StudentManagement = () => {
  const { students, addStudent, updateStudent, deleteStudent, uploadFaceEmbedding, getFaceEmbedding } = useAttendance()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentNumber: '',
    className: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [embeddings, setEmbeddings] = useState({})
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Load face embeddings status
  useEffect(() => {
    const loadEmbeddings = async () => {
      const embeds = {}
      for (const student of students) {
        const embed = await getFaceEmbedding(student.id)
        if (embed) {
          embeds[student.id] = embed
        }
      }
      setEmbeddings(embeds)
    }
    if (students.length > 0) {
      loadEmbeddings()
    }
  }, [students, getFaceEmbedding])

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingStudent(null)
    setFormData({ name: '', email: '', studentNumber: '', className: '' })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email || '',
      studentNumber: student.student_number,
      className: student.class_name || ''
    })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const result = await deleteStudent(studentId)
      if (result.success) {
        setMessage({ type: 'success', text: 'Student deleted successfully' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete student' })
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!formData.name || !formData.email || !formData.studentNumber || !formData.className) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    if (editingStudent) {
      const result = await updateStudent(editingStudent.id, formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Student updated successfully' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update student' })
      }
    } else {
      const result = await addStudent(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Student added successfully' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add student' })
      }
    }

    setTimeout(() => {
      setShowModal(false)
      setMessage({ type: '', text: '' })
      setFormData({ name: '', email: '', studentNumber: '', className: '' })
    }, 1000)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingStudent(null)
    setFormData({ name: '', email: '', studentNumber: '', className: '' })
    setMessage({ type: '', text: '' })
  }

  const handleUpload = async (e, studentId) => {
    e.preventDefault()
    const fileInput = document.getElementById(`faceFile-${studentId}`)
    if (!fileInput.files || !fileInput.files[0]) return

    setUploading(true)
    try {
      const file = fileInput.files[0]
      const result = await uploadFaceEmbedding(studentId, file)
      if (result.success) {
        const embed = await getFaceEmbedding(studentId)
        setEmbeddings(prev => ({ ...prev, [studentId]: embed }))
        setMessage({ type: 'success', text: 'Face embedding uploaded successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: result.message || 'Upload failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  const FaceUploadForm = ({ student, onUploadSuccess, onCancel, uploading, setUploading }) => (
    <form onSubmit={(e) => { handleUpload(e, student.id); onCancel(); }} className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Select Image File</label>
        <input
          id={`faceFile-${student.id}`}
          type="file"
          accept="image/*"
          className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-maroon-600 file:text-white hover:file:bg-maroon-700"
        />
        <p className="text-gray-500 text-xs mt-1">
          Upload a clear front-facing photo of the student
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-dark-surface border border-maroon-900/50 text-white rounded-lg hover:bg-dark-surface/80 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-maroon-600 to-maroon-700 text-white rounded-lg hover:from-maroon-700 hover:to-maroon-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <FaUpload />
              Upload Face Data
            </>
          )}
        </button>
      </div>
    </form>
  )

  // Calculate statistics
  const totalStudents = students.length
  const studentsWithFaceData = Object.keys(embeddings).length
  const faceDataPercentage = totalStudents > 0 ? Math.round((studentsWithFaceData / totalStudents) * 100) : 0

  return (
    <div className="space-y-6 fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Student Management</h2>
          <p className="text-gray-400">Complete student lifecycle and biometric data management</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-maroon-600/20"
        >
          <FaPlus />
          Add Student
        </button>
      </div>

      {/* Global Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-900/30 border-green-800 text-green-300'
              : 'bg-red-900/30 border-red-800 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Statistics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
              <FaUsers className="text-white text-2xl" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Students</h3>
          <p className="text-3xl font-bold text-white">{totalStudents}</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
              <FaUserGraduate className="text-white text-2xl" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Active Students</h3>
          <p className="text-3xl font-bold text-white">{filteredStudents.length}</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">With Face Data</h3>
          <p className="text-3xl font-bold text-white">{studentsWithFaceData}</p>
          <p className="text-green-400 text-sm">{faceDataPercentage}% complete</p>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-maroon-600 to-maroon-700 rounded-lg">
              <FaUpload className="text-white text-2xl" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Add New</h3>
          <p className="text-3xl font-bold text-maroon-300">+</p>
        </div>
      </div>

      {/* Main Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List Section */}
        <div className="lg:col-span-2 bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Student Directory</h3>
              <p className="text-gray-400">Manage student information and accounts</p>
            </div>
            <div className="text-sm text-gray-400">
              {filteredStudents.length} of {totalStudents} students
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, number, email, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600"
              />
            </div>
          </div>

          {/* Student List */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <FaUserCircle className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No students found</p>
              <p className="text-gray-500 text-sm">Add your first student or adjust your search</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => {
                const hasEmbedding = embeddings[student.id]
                return (
                  <div
                    key={student.id}
                    className="bg-dark-surface rounded-lg p-4 border border-maroon-900/30 hover:border-maroon-700/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${hasEmbedding ? 'bg-green-900/30' : 'bg-gray-900/30'}`}>
                          {hasEmbedding ? (
                            <FaCheckCircle className="text-green-400 text-xl" />
                          ) : (
                            <FaUserCircle className="text-gray-400 text-xl" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{student.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>#{student.student_number}</span>
                            <span>{student.email || 'No email'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-maroon-900/30 text-maroon-300 rounded text-sm">
                          Class {student.class_name}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Edit Student"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                            title="Delete Student"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Face Data Management Section */}
        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Face Recognition Data</h3>
            <p className="text-gray-400">Upload biometric data for face recognition</p>
          </div>

          <div className="space-y-4">
            <div className="bg-dark-surface rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Face Data Progress</span>
                <span className="text-maroon-300 font-semibold">{studentsWithFaceData}/{totalStudents}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-maroon-600 to-maroon-700 h-2 rounded-full transition-all"
                  style={{ width: `${faceDataPercentage}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-xs mt-2">{faceDataPercentage}% complete</p>
            </div>

            {filteredStudents.slice(0, 5).map((student) => {
              const hasEmbedding = embeddings[student.id]
              return (
                <div
                  key={student.id}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedStudent === student.id
                      ? 'bg-maroon-900/20 border-maroon-700'
                      : 'bg-dark-surface border-maroon-900/30 hover:border-maroon-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-medium">{student.name}</p>
                      <p className="text-gray-400 text-xs">#{student.student_number}</p>
                    </div>
                    {hasEmbedding && <FaCheckCircle className="text-green-400" />}
                  </div>

                  <div className="flex gap-2">
                    {selectedStudent === student.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => document.getElementById(`file-${student.id}`)?.click()}
                          disabled={uploading}
                          className="flex-1 px-3 py-2 bg-maroon-600 hover:bg-maroon-700 disabled:opacity-50 text-white rounded text-sm transition-all"
                        >
                          {uploading ? 'Uploading...' : 'Select File'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedStudent(student.id)}
                        className="w-full px-3 py-2 bg-maroon-600 hover:bg-maroon-700 text-white rounded text-sm transition-all"
                      >
                        {hasEmbedding ? 'Update' : 'Upload'} Face Data
                      </button>
                    )}
                  </div>

                  <input
                    id={`file-${student.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUpload(e, student.id)
                      }
                    }}
                  />
                </div>
              )
            })}

            {filteredStudents.length > 5 && (
              <div className="text-center text-gray-400 text-sm">
                And {filteredStudents.length - 5} more students...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-dark-surface rounded-lg transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                  placeholder="Enter student full name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                  placeholder="student@school.edu"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">Student Number *</label>
                  <input
                    type="text"
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                    placeholder="STU001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">Class Name *</label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                    placeholder="10A"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-dark-surface border border-maroon-900/50 text-white rounded-lg hover:bg-dark-surface/80 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentManagement
