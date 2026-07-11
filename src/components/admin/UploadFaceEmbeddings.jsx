import { useState, useEffect } from 'react'
import { FaUpload, FaSearch, FaUserCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const UploadFaceEmbeddings = () => {
  const { students, uploadFaceEmbedding, getFaceEmbedding } = useAttendance()
  const [embeddings, setEmbeddings] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileSelect = (studentId) => {
    setSelectedStudent(studentId)
    setMessage({ type: '', text: '' })
  }

  useEffect(() => {
    // Load embeddings for all students
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

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedStudent) {
      setMessage({ type: 'error', text: 'Please select a student first' })
      return
    }

    const fileInput = document.getElementById('faceFile')
    if (!fileInput.files || !fileInput.files[0]) {
      setMessage({ type: 'error', text: 'Please select a file to upload' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const file = fileInput.files[0]
      const result = await uploadFaceEmbedding(selectedStudent, file)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Face embedding uploaded successfully!' })
        // Reload embedding status
        const embed = await getFaceEmbedding(selectedStudent)
        if (embed) {
          setEmbeddings(prev => ({ ...prev, [selectedStudent]: embed }))
        }
        fileInput.value = ''
        setSelectedStudent(null)
      } else {
        setMessage({ type: 'error', text: result.message || 'Upload failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Upload failed' })
    } finally {
      setUploading(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Upload Face Embeddings</h2>
        <p className="text-gray-400">Upload and manage student face recognition data</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <h3 className="text-xl font-bold text-white mb-4">Select Student</h3>
          <div className="mb-4">
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
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => {
              const hasEmbedding = embeddings[student.id]
              return (
                <div
                  key={student.id}
                  onClick={() => handleFileSelect(student.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedStudent === student.id
                      ? 'bg-maroon-900/30 border-maroon-700'
                      : 'bg-dark-surface border-maroon-900/30 hover:border-maroon-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-2xl text-gray-400" />
                      <div>
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-gray-400 text-sm">#{student.student_number} - {student.class_name}</p>
                      </div>
                    </div>
                    {hasEmbedding ? (
                      <FaCheckCircle className="text-green-400" title="Face embedding uploaded" />
                    ) : (
                      <FaTimesCircle className="text-gray-500" title="No face embedding" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <h3 className="text-xl font-bold text-white mb-4">Upload Face Data</h3>
          {selectedStudent ? (
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="bg-dark-surface rounded-lg p-4 border border-maroon-900/30">
                <p className="text-gray-400 text-sm mb-1">Selected Student</p>
                <p className="text-white font-semibold">
                  {students.find(s => s.id === selectedStudent)?.name}
                </p>
                <p className="text-gray-400 text-sm">
                  #{students.find(s => s.id === selectedStudent)?.student_number} - 
                  {students.find(s => s.id === selectedStudent)?.class_name}
                </p>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Select Image File</label>
                <input
                  id="faceFile"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-maroon-600 file:text-white hover:file:bg-maroon-700"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Upload a clear front-facing photo of the student
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full px-4 py-3 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload Face Embedding
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <FaUserCircle className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a student from the list to upload face data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadFaceEmbeddings

