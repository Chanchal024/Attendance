import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserCircle, FaSave, FaTimes } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const ManageStudents = () => {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    getAllClasses 
  } = useAttendance()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_number: '',
    class_name: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const classes = getAllClasses()
  const allClasses = ['all', ...classes]

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === 'all' || student.class_name === selectedClass
    return matchesSearch && matchesClass
  })

  const handleAdd = () => {
    setEditingStudent(null)
    setFormData({ name: '', email: '', student_number: '', class_name: '' })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      student_number: student.student_number,
      class_name: student.class_name
    })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(studentId)
      setMessage({ type: 'success', text: 'Student deleted successfully' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    // Validation
    if (!formData.name || !formData.email || !formData.student_number || !formData.class_name) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    // Check for duplicate student number
    const duplicate = students.find(
      s => s.student_number === formData.student_number && s.id !== editingStudent?.id
    )
    if (duplicate) {
      setMessage({ type: 'error', text: 'Student number already exists' })
      return
    }

    if (editingStudent) {
      // Update existing student
      updateStudent(editingStudent.id, formData)
      setMessage({ type: 'success', text: 'Student updated successfully' })
    } else {
      // Add new student
      addStudent(formData)
      setMessage({ type: 'success', text: 'Student added successfully' })
    }

    setTimeout(() => {
      setShowModal(false)
      setMessage({ type: '', text: '' })
      setFormData({ name: '', email: '', student_number: '', class_name: '' })
    }, 1000)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingStudent(null)
    setFormData({ name: '', email: '', student_number: '', class_name: '' })
    setMessage({ type: '', text: '' })
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Manage Students</h2>
          <p className="text-gray-400">Add, edit, and manage student information</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg flex items-center gap-2 transition-all"
        >
          <FaPlus />
          Add Student
        </button>
      </div>

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
            {allClasses.map(cls => (
              <option key={cls} value={cls}>
                {cls === 'all' ? 'All Classes' : `Class ${cls}`}
              </option>
            ))}
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <FaUserCircle className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No students found</p>
            <p className="text-gray-500 text-sm">Add your first student to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-maroon-900/30">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Student Number</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Class</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-maroon-900/20 hover:bg-dark-surface/50 transition-colors">
                    <td className="py-4 px-4 text-white font-medium">{student.student_number}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <FaUserCircle className="text-gray-400" />
                        <span className="text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{student.email}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-maroon-900/30 text-maroon-300 rounded text-sm">
                        {student.class_name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-sm">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-blue-400 hover:bg-blue-900/20 rounded transition-all"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-all"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
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

            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-900/30 border-green-800 text-green-300'
                    : 'bg-red-900/30 border-red-800 text-red-300'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Student Number *</label>
                <input
                  type="text"
                  value={formData.student_number}
                  onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder="e.g., STU001"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Class Name *</label>
                <input
                  type="text"
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder="e.g., 10A, 11B"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-dark-surface border border-maroon-900/50 text-white rounded-lg hover:bg-dark-surface/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-maroon-600 to-maroon-700 text-white rounded-lg hover:from-maroon-700 hover:to-maroon-800 transition-all flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {editingStudent ? 'Update' : 'Add'} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageStudents

