import { useState, useEffect } from 'react'
import { FaFileExcel, FaFilePdf, FaCalendarAlt, FaEdit, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAttendance } from '../../context/AttendanceContext'

const AttendanceReports = () => {
  const { students, attendanceRecords, loadAttendanceRecords, getAllClasses, updateAttendanceRecord } = useAttendance()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('all')
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [editFormData, setEditFormData] = useState({
    status: 'present',
    time_in: '',
    time_out: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const classes = getAllClasses()
  const allClasses = ['all', ...classes]

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true)
      await loadAttendanceRecords(selectedDate)
      setLoading(false)
      filterRecords()
    }

    loadRecords()
  }, [selectedDate, loadAttendanceRecords])

  const filterRecords = () => {
    const dateRecords = attendanceRecords[selectedDate] || {}

    let records = Object.keys(dateRecords).map(studentId => {
      const record = dateRecords[studentId]
      const student = students.find(s => s.id === parseInt(studentId) || s.id.toString() === studentId.toString())
      return {
        id: record.id,
        student_id: record.student_id,
        student_name: record.student_name || student?.name || 'Unknown',
        student_number: record.student_number || student?.student_number || 'N/A',
        class_name: record.class_name,
        time_in: record.time_in,
        time_out: record.time_out,
        status: record.status || 'present',
        date: selectedDate
      }
    })

    if (selectedClass !== 'all') {
      records = records.filter(r => r.class_name === selectedClass)
    }

    setFilteredRecords(records)
  }

  useEffect(() => {
    filterRecords()
  }, [selectedClass, attendanceRecords, selectedDate, students])

  const handleEdit = (record) => {
    setEditingRecord(record.id)
    setEditFormData({
      status: record.status || 'present',
      time_in: record.time_in ? new Date(record.time_in).toTimeString().slice(0, 5) : '',
      time_out: record.time_out ? new Date(record.time_out).toTimeString().slice(0, 5) : ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingRecord) return

    try {
      const updateData = {
        ...editFormData,
        date: selectedDate,
        time_in: editFormData.time_in ? `${selectedDate}T${editFormData.time_in}:00` : null,
        time_out: editFormData.time_out ? `${selectedDate}T${editFormData.time_out}:00` : null
      }

      const result = await updateAttendanceRecord(editingRecord, updateData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Attendance record updated successfully' })
        setEditingRecord(null)
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update record' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update record' })
    }
  }

  const handleCancelEdit = () => {
    setEditingRecord(null)
    setEditFormData({ status: 'present', time_in: '', time_out: '' })
  }

  const handleExport = async (format) => {
    if (filteredRecords.length === 0) {
      setMessage({ type: 'error', text: 'No records to export' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }

    if (format === 'Excel') {
      try {
        const headers = ['Student Number', 'Name', 'Class', 'Date', 'Time In', 'Time Out', 'Status']
        const csvContent = [
          headers.join(','),
          ...filteredRecords.map(r => {
            const timeIn = r.time_in ? new Date(r.time_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'
            const timeOut = r.time_out ? new Date(r.time_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'
            return [
              r.student_number,
              `"${r.student_name}"`, // Quote name in case it has commas
              r.class_name,
              r.date,
              timeIn,
              timeOut,
              r.status
            ].join(',')
          })
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance_report_${selectedDate}${selectedClass !== 'all' ? '_' + selectedClass : ''}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setMessage({ type: 'success', text: 'Excel (CSV) Export completed successfully!' })
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to export data' })
      }
    } else {
      setMessage({ type: 'info', text: 'PDF export is coming soon. Please use Excel/CSV export for now.' })
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const presentCount = filteredRecords.filter(r => r.status === 'present').length
  const absentCount = filteredRecords.filter(r => r.status !== 'present').length

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Attendance Reports & Data</h2>
          <p className="text-gray-400">View, analyze, and correct attendance records</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('Excel')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <FaFileExcel />
            Export Excel
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <FaFilePdf />
            Export PDF
          </button>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Filter by Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
            >
              {allClasses.map(cls => (
                <option key={cls} value={cls}>
                  {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-surface rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Records</p>
            <p className="text-3xl font-bold text-white">{filteredRecords.length}</p>
          </div>
          <div className="bg-dark-surface rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Present</p>
            <p className="text-3xl font-bold text-green-400">{presentCount}</p>
          </div>
          <div className="bg-dark-surface rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Absent/Other</p>
            <p className="text-3xl font-bold text-red-400">{absentCount}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-maroon-900/30">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student Number</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Class</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time In</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time Out</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr key={record.id || index} className="border-b border-maroon-900/20 hover:bg-dark-surface/50 transition-colors">
                    <td className="py-4 px-4 text-white">{record.student_number}</td>
                    <td className="py-4 px-4 text-white">{record.student_name}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-maroon-900/30 text-maroon-300 rounded text-sm">
                        {record.class_name}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {editingRecord === record.id ? (
                        <input
                          type="time"
                          value={editFormData.time_in}
                          onChange={(e) => setEditFormData({ ...editFormData, time_in: e.target.value })}
                          className="w-full px-2 py-1 bg-dark-surface border border-maroon-900/50 rounded text-white"
                        />
                      ) : (
                        record.time_in ? new Date(record.time_in).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {editingRecord === record.id ? (
                        <input
                          type="time"
                          value={editFormData.time_out}
                          onChange={(e) => setEditFormData({ ...editFormData, time_out: e.target.value })}
                          className="w-full px-2 py-1 bg-dark-surface border border-maroon-900/50 rounded text-white"
                        />
                      ) : (
                        record.time_out ? new Date(record.time_out).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingRecord === record.id ? (
                        <select
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                          className="w-full px-2 py-1 bg-dark-surface border border-maroon-900/50 rounded text-white"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 w-fit ${
                          record.status === 'present' ? 'bg-green-900/30 text-green-300' :
                          record.status === 'late' ? 'bg-yellow-900/30 text-yellow-300' :
                          'bg-red-900/30 text-red-300'
                        }`}>
                          {record.status === 'present' ? <FaCheckCircle /> :
                           record.status === 'absent' ? <FaTimesCircle /> :
                           <FaClock />}
                          {record.status || 'present'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingRecord === record.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1"
                          >
                            <FaCheckCircle />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-400 hover:bg-blue-900/20 rounded transition-all"
                          title="Edit Record"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No attendance records found for {selectedDate}
                    {selectedClass !== 'all' ? ` in class ${selectedClass}` : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AttendanceReports
