import { useState } from 'react'
import { FaPlus, FaTrash, FaUsers, FaSave, FaTimes, FaEdit, FaBook } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const ManageClasses = () => {
  const { students, classes, addClass, updateClass, deleteClass } = useAttendance()
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const classStats = classes.map(classItem => {
    const classStudents = students.filter(s => s.class_name === classItem.name)
    return {
      ...classItem,
      studentCount: classStudents.length,
      activeCount: classStudents.filter(s => s.status === 'Active').length
    }
  })

  const handleAdd = () => {
    setEditingClass(null)
    setFormData({ name: '', subject: '', description: '' })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleEdit = (classItem) => {
    setEditingClass(classItem)
    setFormData({
      name: classItem.name,
      subject: classItem.subject || '',
      description: classItem.description || ''
    })
    setShowModal(true)
    setMessage({ type: '', text: '' })
  }

  const handleDelete = async (classItem) => {
    const classStudents = students.filter(s => s.class_name === classItem.name)
    if (classStudents.length > 0) {
      const confirmMsg = `This class has ${classStudents.length} students. Deleting this class will also remove the class assignment from all students. Are you sure you want to proceed?`
      if (!window.confirm(confirmMsg)) {
        return
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete the class "${classItem.name}"?`)) {
        return
      }
    }

    const result = deleteClass(classItem.id)
    if (result.success) {
      setMessage({ type: 'success', text: 'Class deleted successfully' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to delete class' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!formData.name.trim() || !formData.subject.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    if (editingClass) {
      const result = updateClass(editingClass.id, formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Class updated successfully' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update class' })
      }
    } else {
      const duplicateName = classes.find(c => c.name === formData.name)
      if (duplicateName) {
        setMessage({ type: 'error', text: 'A class with this name already exists' })
        return
      }

      const result = addClass(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Class added successfully' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add class' })
      }
    }

    setTimeout(() => {
      setShowModal(false)
      setFormData({ name: '', subject: '', description: '' })
      setEditingClass(null)
      setMessage({ type: '', text: '' })
    }, 1000)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingClass(null)
    setFormData({ name: '', subject: '', description: '' })
    setMessage({ type: '', text: '' })
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">System Structure & Classes</h2>
        <p className="text-gray-400">Manage the organizational structure: departments, courses, classes, and sections</p>
      </div>
        <button
          onClick={() => handleAdd()}
          className="px-4 py-2 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg flex items-center gap-2 transition-all"
        >
          <FaPlus />
          Add Class
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-900/30 border-green-800 text-green-300'
              : message.type === 'error'
              ? 'bg-red-900/30 border-red-800 text-red-300'
              : 'bg-blue-900/30 border-blue-800 text-blue-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {classes.length === 0 ? (
        <div className="bg-dark-card rounded-xl p-12 border border-maroon-900/30 text-center">
          <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No classes found</p>
          <p className="text-gray-500 text-sm">Create your first class to get started with student management.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classStats.map((classStat) => (
            <div
              key={classStat.id}
              className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Class {classStat.name}</h3>
                  <p className="text-maroon-300 font-medium flex items-center gap-1 mb-1">
                    <FaBook className="text-sm" />
                    {classStat.subject}
                  </p>
                  {classStat.description && (
                    <p className="text-gray-400 text-sm">{classStat.description}</p>
                  )}
                </div>
                <div className="p-3 bg-gradient-to-br from-maroon-600 to-maroon-700 rounded-lg">
                  <FaUsers className="text-white text-2xl" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-dark-surface rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-white">{classStat.studentCount}</p>
                </div>
                <div className="bg-dark-surface rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Active Students</p>
                  <p className="text-2xl font-bold text-green-400">{classStat.activeCount}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(classStat)}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(classStat)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h3>
              <button
                onClick={handleModalClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-dark-surface rounded-lg transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Class Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                  placeholder="e.g., 10A, 11B, Science III"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Subject Name *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent"
                  placeholder="e.g., Mathematics, Biology, Chemistry"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-transparent resize-none"
                  placeholder="Additional notes about this class..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-3 bg-dark-surface border border-maroon-900/50 text-white rounded-lg hover:bg-dark-surface/80 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {editingClass ? 'Update Class' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageClasses
