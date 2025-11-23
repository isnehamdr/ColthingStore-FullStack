import { usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiMail,
  FiCheckCircle,
} from 'react-icons/fi';

const AdminNavbar = ({ toggleSidebar, userDropdownOpen, toggleUserDropdown }) => {
  const { auth } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New user registered', read: false },
    { id: 2, message: 'Order #123 has been completed', read: false },
    { id: 3, message: 'Server maintenance scheduled', read: true },
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = () => {
    axios.post(route('logout')).then((response) => {
      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      } else {
        window.location.href = '/login';
      }
    }).catch((error) => {
      console.error('Logout error:', error);
      window.location.href = '/login';
    });
  };

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;
    console.log('Searching for:', searchQuery);

    // Example: You can integrate with an API route here
    // axios.get(`/api/search?query=${searchQuery}`).then(res => console.log(res.data));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  // Unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // User image handling
  const userImage = auth?.user?.image ? `/storage/${auth.user.image}` : null;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-600 lg:hidden"
          >
            <FiMenu className="h-6 w-6" />
          </button>

          <form onSubmit={handleSearch} className="relative ml-4 lg:ml-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center relative">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 text-gray-500 hover:text-gray-600 relative"
            >
              <FiBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <h4 className="text-sm font-semibold text-gray-700">Notifications</h4>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-center py-3 text-gray-500 text-sm">No notifications</p>
                ) : (
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 ${
                          !n.read ? 'bg-indigo-50' : ''
                        }`}
                      >
                        {n.read ? (
                          <FiCheckCircle className="text-gray-400" />
                        ) : (
                          <FiMail className="text-indigo-500" />
                        )}
                        <span className="text-gray-700">{n.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="ml-4 relative">
            <button
              onClick={toggleUserDropdown}
              className="flex items-center focus:outline-none"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-medium">
                    {auth?.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </span>
                </div>
              )}

              <div className="ml-2 hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">{auth?.user?.name}</p>
                <p className="text-xs text-gray-500">{auth?.user?.role}</p>
              </div>
              <FiChevronDown className="ml-1 h-4 w-4 text-gray-500" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-40">
                <a href="/profiles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a href="/setting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
