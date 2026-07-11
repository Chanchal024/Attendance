import { useState, useEffect } from 'react'
import { FaFilter, FaSearch, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAttendance } from '../../context/AttendanceContext'

const SystemLogs = () => {
  const { getLogs } = useAttendance()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const { data } = getLogs()
      setLogs(data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load system logs' })
    } finally {
      setLoading(false)
    }
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
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">System Logs</h2>
        <p className="text-gray-400">Monitor system activities and errors</p>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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

        <div className="space-y-3">
          {filteredLogs.map((log) => (
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
                  <span className="text-gray-400 text-sm">{log.timestamp}</span>
                </div>
                <p className="text-gray-400 text-sm">User: {log.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemLogs

