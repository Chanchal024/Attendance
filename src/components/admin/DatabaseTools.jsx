import { useState, useEffect } from 'react'
import { FaDatabase, FaUpload, FaDownload, FaTrash, FaSync, FaShieldAlt, FaFilter, FaSearch, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const DatabaseTools = () => {
  const { databaseTools, getLogs } = useAttendance()
  const [backupStatus, setBackupStatus] = useState('Loading...')
  const [dbStats, setDbStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [logLoading, setLogLoading] = useState(false)

  useEffect(() => {
    loadStats()
    loadLogs()
  }, [])

  const loadStats = () => {
    const result = databaseTools.getStats()
    setDbStats(result.data)
  }

  const handleBackup = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    const result = databaseTools.backup()
    
    if (result.success) {
      const blob = new Blob([result.data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: result.message })
      setBackupStatus(`Last backup: ${new Date().toLocaleTimeString()}`)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setLoading(false)
  }

  const handleRestore = async () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    fileInput.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      setLoading(true)
      setMessage({ type: '', text: '' })
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = databaseTools.restore(event.target.result)
        if (result.success) {
          setMessage({ type: 'success', text: result.message })
          loadStats()
          setTimeout(() => window.location.reload(), 2000)
        } else {
          setMessage({ type: 'error', text: result.message })
        }
        setLoading(false)
      }
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Error reading file' })
        setLoading(false)
      }
      reader.readAsText(file)
    }
    fileInput.click()
  }

  const handleOptimize = async () => {
    if (!confirm('Are you sure you want to optimize the database? This may take a few moments.')) return

    setLoading(true)
    setMessage({ type: '', text: '' })
    const result = databaseTools.optimize()
    setMessage({ type: 'success', text: result.message })
    loadStats()
    setLoading(false)
  }

  const handleClearOldData = async () => {
    const days = prompt('Enter number of days to keep (records older than this will be deleted):', '365')
    if (!days || isNaN(days)) return

    if (!confirm(`Are you sure you want to delete records older than ${days} days?`)) return

    setLoading(true)
    setMessage({ type: '', text: '' })
    const result = databaseTools.clearOldData(parseInt(days))
    setMessage({ type: 'success', text: result.message })
    loadStats()
    setLoading(false)
  }

  const handleSecuritySettings = () => {
    setMessage({ type: 'info', text: 'Security settings functionality not yet implemented' })
  }

  const loadLogs = async () => {
    setLogLoading(true)
    const { data } = getLogs()
    setLogs(data)
    setLogLoading(false)
  }

  const handleViewStats = () => {
    setMessage({ type: 'info', text: 'Database statistics are shown below' })
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'error':
        return <FaTimesCircle className="text-red-400" />
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-400" />
      case 'success':
        return <FaCheckCircle className="text-green-400" />
      default:
        return <FaInfoCircle className="text-blue-400" />
    }
  }

  const getLogColor = (type) => {
    switch (type) {
      case 'error':
        return 'border-red-900/30 bg-red-900/10'
      case 'warning':
        return 'border-yellow-900/30 bg-yellow-900/10'
      case 'success':
        return 'border-green-900/30 bg-green-900/10'
      default:
        return 'border-blue-900/30 bg-blue-900/10'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.type === filter
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6 fade-in">
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

      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Database Tools & Logs</h2>
        <p className="text-gray-400">Superuser database management and security monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
              <FaDownload className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Backup Database</h3>
              <p className="text-gray-400 text-sm">{backupStatus}</p>
            </div>
          </div>
          <button
            onClick={handleBackup}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
          >
            {loading ? 'Creating...' : 'Create Backup'}
          </button>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
              <FaUpload className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Restore Database</h3>
              <p className="text-gray-400 text-sm">Restore from backup</p>
            </div>
          </div>
          <button
            onClick={handleRestore}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
          >
            {loading ? 'Restoring...' : 'Restore Backup'}
          </button>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg">
              <FaSync className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Optimize Database</h3>
              <p className="text-gray-400 text-sm">Clean and optimize</p>
            </div>
          </div>
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
          >
            {loading ? 'Optimizing...' : 'Optimize Now'}
          </button>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <FaTrash className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Clear Old Records</h3>
              <p className="text-gray-400 text-sm">Remove old attendance data</p>
            </div>
          </div>
          <button
            onClick={handleClearOldData}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
          >
            {loading ? 'Clearing...' : 'Clear Records'}
          </button>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Security Settings</h3>
              <p className="text-gray-400 text-sm">Database security</p>
            </div>
          </div>
          <button
            onClick={handleSecuritySettings}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
          >
            Configure
          </button>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 hover:border-maroon-700/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-maroon-600 to-maroon-700 rounded-lg">
              <FaDatabase className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Database Stats</h3>
              <p className="text-gray-400 text-sm">View statistics</p>
            </div>
          </div>
          <button
            onClick={handleViewStats}
            className="w-full px-4 py-2 bg-maroon-600 hover:bg-maroon-700 text-white rounded-lg transition-all"
          >
            View Stats
          </button>
        </div>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <h3 className="text-xl font-bold text-white mb-4">Database Information</h3>
        {dbStats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-dark-surface rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Students</p>
              <p className="text-2xl font-bold text-white">{dbStats.students_count || 0}</p>
            </div>
            <div className="bg-dark-surface rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Teachers</p>
              <p className="text-2xl font-bold text-white">{dbStats.teachers_count || 0}</p>
            </div>
            <div className="bg-dark-surface rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Attendance Records</p>
              <p className="text-2xl font-bold text-white">{dbStats.attendance_count || 0}</p>
            </div>
            <div className="bg-dark-surface rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Database Size</p>
              <p className="text-2xl font-bold text-white">{dbStats.database_size_mb || 0} MB</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Loading database statistics...
          </div>
        )}

        {dbStats && (
          <div className="mt-6 pt-6 border-t border-maroon-900/30">
            <h4 className="text-lg font-bold text-white mb-3">Additional Stats</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Attendance Sessions</p>
                <p className="text-white font-semibold">{dbStats.attendance_sessions_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Face Embeddings</p>
                <p className="text-white font-semibold">{dbStats.face_embeddings_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Updated</p>
                <p className="text-white font-semibold">Just now</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">System Logs</h3>
            <p className="text-gray-400">Monitor system activities and errors (Admin/Superuser Only)</p>
          </div>
          <button
            onClick={loadLogs}
            disabled={logLoading}
            className="px-4 py-2 bg-maroon-600 hover:bg-maroon-700 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <FaSync className={logLoading ? 'animate-spin' : ''} />
            {logLoading ? 'Loading...' : 'Refresh Logs'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-600"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-12 pr-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
            >
              <option value="all">All Logs</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border ${getLogColor(log.type)} flex items-start gap-4`}
              >
                <div className="mt-1">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-medium">{log.message}</p>
                    <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-sm">User: {log.user || 'System'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              {logLoading ? 'Loading logs...' : 'No system logs found'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DatabaseTools

