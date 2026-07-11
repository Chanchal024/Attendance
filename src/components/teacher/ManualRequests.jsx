import { useState } from 'react'
import { FaCheckCircle, FaTimesCircle, FaUserCircle, FaClock } from 'react-icons/fa'

const ManualRequests = () => {
  const [requests] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      roll: '101',
      date: '2024-01-15',
      reason: 'Medical appointment',
      status: 'pending',
      requestedAt: '2024-01-15 10:30 AM'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      roll: '102',
      date: '2024-01-14',
      reason: 'Family emergency',
      status: 'pending',
      requestedAt: '2024-01-14 09:15 AM'
    },
    {
      id: 3,
      studentName: 'Bob Johnson',
      roll: '103',
      date: '2024-01-13',
      reason: 'Late arrival due to traffic',
      status: 'approved',
      requestedAt: '2024-01-13 11:20 AM'
    },
  ])

  const handleApprove = (id) => {
    // In real app, this would update the request status
    console.log('Approved request:', id)
  }

  const handleReject = (id) => {
    // In real app, this would update the request status
    console.log('Rejected request:', id)
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const processedRequests = requests.filter(r => r.status !== 'pending')

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Manual Attendance Requests</h2>
        <p className="text-gray-400">Approve or reject manual attendance corrections</p>
      </div>

      {pendingRequests.length > 0 && (
        <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaClock className="text-yellow-400" />
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-dark-surface rounded-lg p-5 border border-maroon-900/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-700 flex items-center justify-center">
                      <FaUserCircle className="text-white text-xl" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{request.studentName}</h4>
                      <p className="text-gray-400 text-sm">Roll: {request.roll}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-sm">
                    Pending
                  </span>
                </div>
                <div className="mb-4 space-y-2">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Date:</span> {request.date}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Reason:</span> {request.reason}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Requested at: {request.requestedAt}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaTimesCircle />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
        <h3 className="text-xl font-bold text-white mb-4">Processed Requests</h3>
        <div className="space-y-3">
          {processedRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-dark-surface rounded-lg border border-maroon-900/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-700 flex items-center justify-center">
                  <FaUserCircle className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{request.studentName}</p>
                  <p className="text-gray-400 text-sm">{request.date} - {request.reason}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  request.status === 'approved'
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-red-900/30 text-red-300'
                }`}
              >
                {request.status === 'approved' ? 'Approved' : 'Rejected'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManualRequests




