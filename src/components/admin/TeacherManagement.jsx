import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserCircle, FaChalkboardTeacher, FaSave, FaTimes } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const TeacherManagement = () => {
  const { teachers, registerTeacher, updateTeacher, deleteTeacher, getAllClasses } = useAttendance()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    assignedClasses: []
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const classes = getAllClasses()

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setEditingTeacher(null)
    setFormData({ name: '', email: '', password: '', assignedClasses: [] })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: '',
      assignedClasses: teacher.assignedClasses || []
    })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleDelete = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacher(teacherId)
      setMessage({ type: 'success', text: 'Teacher deleted successfully' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleClassToggle = (className) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(className)
        ? prev.assignedClasses.filter(c => c !== className)
        : [...prev.assignedClasses, className]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!formData.name || !formData.email) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    if (!editingTeacher && !formData.password) {
      setMessage({ type: 'error', text: 'Password is required for new teachers' })
      return
    }

    // Check for duplicate email
    const duplicate = teachers.find(
      t => t.email === formData.email && t.id !== editingTeacher?.id
    )
    if (duplicate) {
      setMessage({ type: 'error', text: 'Email already exists' })
      return
    }

    if (editingTeacher) {
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }
      updateTeacher(editingTeacher.id, updateData)
      setMessage({ type: 'success', text: 'Teacher updated successfully' })
    } else {
      registerTeacher(formData)
      setMessage({ type: 'success', text: 'Teacher registered successfully' })
    }

    setTimeout(() => {
      setShowModal(false)
      setMessage({ type: '', text: '' })
      setFormData({ name: '', email: '', password: '', assignedClasses: [] })
    }, 1000)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingTeacher(null)
    setFormData({ name: '', email: '', password: '', assignedClasses: [] })
    setMessage({ type: '', text: '' })
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Teacher Management</h2>
        <p className="text-gray-400">Register teachers and assign class responsibilities</p>
      </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg flex items-center gap-2 transition-all"
        >
          <FaPlus />
          Register Teacher
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
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600"
            />
          </div>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <FaChalkboardTeacher className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No teachers found</p>
            <p className="text-gray-500 text-sm">Register your first teacher to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-dark-surface rounded-lg p-5 border border-maroon-900/30 hover:border-maroon-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-maroon-600 to-maroon-700 rounded-lg">
                      <FaChalkboardTeacher className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{teacher.name}</h3>
                      <p className="text-gray-400 text-sm">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="p-2 text-blue-400 hover:bg-blue-900/20 rounded transition-all"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-all"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Assigned Classes:</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.assignedClasses.map((cls, idx) => (
                          <span key={idx} className="px-2 py-1 bg-maroon-900/30 text-maroon-300 rounded text-xs">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="inline-block px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                    {teacher.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">
                {editingTeacher ? 'Edit Teacher' : 'Register Teacher'}
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
                  placeholder="Enter teacher name"
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
                <label className="block text-gray-300 text-sm mb-2">
                  Password {!editingTeacher && '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder={editingTeacher ? "Leave blank to keep current" : "Enter password"}
                  required={!editingTeacher}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Assign Classes</label>
                {classes.length === 0 ? (
                  <p className="text-gray-400 text-sm">No classes available. Add students with classes first.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto bg-dark-surface p-3 rounded-lg border border-maroon-900/30">
                    {classes.map(cls => (
                      <label key={cls} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.assignedClasses.includes(cls)}
                          onChange={() => handleClassToggle(cls)}
                          className="w-4 h-4 text-maroon-600 bg-dark-surface border-maroon-900/50 rounded focus:ring-maroon-600"
                        />
                        <span className="text-white text-sm">Class {cls}</span>
                      </label>
                    ))}
                  </div>
                )}
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
                  {editingTeacher ? 'Update' : 'Register'} Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherManagement
