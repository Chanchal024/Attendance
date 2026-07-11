import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { FaHome, FaUsers, FaChalkboardTeacher, FaUserGraduate, FaChartBar, FaDatabase, FaFileExport, FaCog, FaSignOutAlt, FaCamera, FaCalendarAlt, FaUserCircle, FaClipboardList, FaBars, FaTimes } from 'react-icons/fa'

const Sidebar = ({ user, onLogout, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = (iconName) => {
    const icons = {
      home: FaHome,
      students: FaUserGraduate,
      teachers: FaChalkboardTeacher,
      users: FaUsers,
      reports: FaChartBar,
      database: FaDatabase,
      export: FaFileExport,
      settings: FaCog,
      camera: FaCamera,
      calendar: FaCalendarAlt,
      profile: FaUserCircle,
      attendance: FaClipboardList,
    }
    return icons[iconName] || FaHome
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-card border border-maroon-900/30 rounded-lg text-white hover:bg-dark-surface transition-all"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 bg-dark-card border-r border-maroon-900/30 min-h-screen fixed left-0 top-0 overflow-y-auto z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-maroon-900/30">
          <h2 className="text-2xl font-bold text-white mb-1">Attendance</h2>
          <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-maroon-600 to-maroon-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-dark-surface hover:text-white'
                  }`
                }
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-maroon-900/30">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar

