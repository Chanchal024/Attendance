import { FaUsers, FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const MyClasses = ({ user }) => {
  const { getAllClasses, getStudentsByClass } = useAttendance()
  const studentClass = user?.class_name || user?.className
  const allClasses = getAllClasses()

  // Get student's class info
  const classInfo = studentClass ? {
    name: studentClass,
    students: getStudentsByClass(studentClass)
  } : null

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Classes</h2>
        <p className="text-gray-400">View classes you should attend</p>
      </div>

      {!studentClass ? (
        <div className="bg-dark-card rounded-xl p-12 border border-maroon-900/30 text-center">
          <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No class assigned</p>
          <p className="text-gray-500 text-sm">Please contact your teacher or administrator</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-maroon-600 to-maroon-700 rounded-lg">
                <FaUsers className="text-white text-3xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Class {studentClass}</h3>
                <p className="text-gray-400">Your assigned class</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-dark-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Total Students</span>
                  <FaUsers className="text-maroon-400" />
                </div>
                <p className="text-3xl font-bold text-white">{classInfo?.students.length || 0}</p>
              </div>

              <div className="bg-dark-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Class Name</span>
                  <FaCalendarAlt className="text-maroon-400" />
                </div>
                <p className="text-2xl font-bold text-maroon-400">{studentClass}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaChalkboardTeacher />
              Classmates
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {classInfo?.students && classInfo.students.length > 0 ? (
                classInfo.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 bg-dark-surface rounded-lg border border-maroon-900/30"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-700 flex items-center justify-center">
                      <FaUsers className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-gray-400 text-sm">#{student.student_number}</p>
                    </div>
                    {(student.id === user?.id || student.id === user?.student_id) && (
                      <span className="px-2 py-1 bg-maroon-900/30 text-maroon-300 rounded text-xs">
                        You
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No classmates found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {allClasses.length > 0 && (
        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <h3 className="text-xl font-bold text-white mb-4">All Available Classes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allClasses.map((className) => (
              <div
                key={className}
                className={`p-4 rounded-lg border ${
                  className === studentClass
                    ? 'bg-maroon-900/30 border-maroon-700'
                    : 'bg-dark-surface border-maroon-900/30'
                }`}
              >
                <p className="text-white font-semibold">Class {className}</p>
                {className === studentClass && (
                  <p className="text-maroon-300 text-xs mt-1">Your Class</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyClasses

