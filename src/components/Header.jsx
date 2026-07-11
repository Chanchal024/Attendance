import { FaBell, FaUserCircle } from 'react-icons/fa'

const Header = ({ user }) => {
  return (
    <header className="bg-dark-card border-b border-maroon-900/30 px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
      </div>
      <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-dark-surface rounded-lg transition-all">
          <FaBell className="text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 bg-dark-surface px-3 lg:px-4 py-2 rounded-lg">
          <FaUserCircle className="text-xl lg:text-2xl text-gray-400" />
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

