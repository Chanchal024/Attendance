import { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimesCircle, FaClock, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const SubmitAttendance = ({ studentId: rawStudentId }) => {
  const studentId = parseInt(rawStudentId) || 1
  const {
    isAttendanceEnabled,
    submitAttendance,
    getStudentAttendance,
    attendanceSession,
    getStudentById
  } = useAttendance()
  
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [submissionTime, setSubmissionTime] = useState(null)

  const student = getStudentById(studentId)
  const canSubmit = student ? isAttendanceEnabled(student.class_name) : false

  useEffect(() => {
    const checkAttendance = async () => {
      const today = new Date().toISOString().split('T')[0]
      const submission = await getStudentAttendance(studentId, today)
      if (submission) {
        setAlreadySubmitted(true)
        setSubmissionTime(new Date(submission.time_in).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }))
      }
    }
    if (studentId) {
      checkAttendance()
    }
  }, [studentId, getStudentAttendance])

  const handleSubmit = async () => {
    const student = getStudentById(studentId)
    if (!student) {
      setMessage({ type: 'error', text: 'Student information not found' })
      return
    }

    if (!isAttendanceEnabled(student.class_name)) {
      setMessage({ type: 'error', text: 'Attendance is not currently enabled by your teacher' })
      return
    }

    if (alreadySubmitted) {
      setMessage({ type: 'info', text: 'You have already submitted attendance for today' })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    const result = submitAttendance(studentId)
    
    setIsSubmitting(false)
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setAlreadySubmitted(true)
      setSubmissionTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }))
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaClock />
        Submit Attendance
      </h3>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-900/30 border-green-800 text-green-300'
              : message.type === 'error'
              ? 'bg-red-900/30 border-red-800 text-red-300'
              : 'bg-blue-900/30 border-blue-800 text-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' && <FaCheckCircle />}
            {message.type === 'error' && <FaExclamationTriangle />}
            {message.type === 'info' && <FaClock />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-dark-surface rounded-lg p-4 border border-maroon-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Attendance Status:</span>
            {canSubmit ? (
              <span className="flex items-center gap-2 text-green-400">
                <FaCheckCircle />
                Enabled for {student.class_name}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-400">
                <FaTimesCircle />
                Disabled
              </span>
            )}
          </div>
          {attendanceSession && canSubmit && (
            <div className="mt-2 text-sm text-gray-400">
              <p>Class: {attendanceSession.class_name}</p>
              <p>Date: {attendanceSession.date}</p>
            </div>
          )}
        </div>

        {alreadySubmitted ? (
          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6 text-center">
            <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Attendance Submitted!</h4>
            <p className="text-gray-300 mb-1">You have successfully submitted your attendance</p>
            {submissionTime && (
              <p className="text-green-400 font-semibold">Time: {submissionTime}</p>
            )}
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={`w-full px-6 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              canSubmit && !isSubmitting
                ? 'bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white transform hover:scale-[1.02]'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Submit Attendance
              </>
            )}
          </button>
        )}

        {!canSubmit && !alreadySubmitted && (
          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-400 mt-1" />
              <div>
                <p className="text-yellow-300 font-medium mb-1">Attendance Not Available</p>
                <p className="text-yellow-200 text-sm">
                  Your teacher has not enabled attendance submission yet. Please wait for them to start the attendance session.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubmitAttendance
