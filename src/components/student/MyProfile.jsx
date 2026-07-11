import { useState } from 'react'
import { FaUserCircle, FaEdit, FaCamera, FaSave, FaTimes } from 'react-icons/fa'

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    roll: '101',
    class: '10A',
    phone: '+1234567890',
    address: '123 Main Street, City, State',
  })

  const handleSave = () => {
    // In real app, this would save to backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
        <p className="text-gray-400">View and update your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-700 flex items-center justify-center mx-auto">
                <FaUserCircle className="text-white text-6xl" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-maroon-600 rounded-full hover:bg-maroon-700 transition-all">
                  <FaCamera className="text-white" />
                </button>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{profileData.name}</h3>
            <p className="text-gray-400 mb-4">{profileData.email}</p>
            <div className="space-y-2">
              <div className="bg-dark-surface rounded-lg p-3">
                <p className="text-gray-400 text-sm">Roll Number</p>
                <p className="text-white font-semibold">{profileData.roll}</p>
              </div>
              <div className="bg-dark-surface rounded-lg p-3">
                <p className="text-gray-400 text-sm">Class</p>
                <p className="text-white font-semibold">{profileData.class}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-maroon-600 hover:bg-maroon-700 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-dark-surface border border-maroon-900/50 text-white rounded-lg flex items-center gap-2 transition-all hover:bg-dark-surface/80"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg flex items-center gap-2 transition-all"
                  >
                    <FaSave />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  />
                ) : (
                  <p className="text-white">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  />
                ) : (
                  <p className="text-white">{profileData.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                    />
                  ) : (
                    <p className="text-white">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Class</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.class}
                      onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                    />
                  ) : (
                    <p className="text-white">{profileData.class}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600 resize-none"
                  />
                ) : (
                  <p className="text-white">{profileData.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-6 border border-maroon-900/30 mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-dark-surface border border-maroon-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white rounded-lg transition-all">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile




