import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiMail,
  FiCheckCircle,
} from 'react-icons/fi';
import { DEFAULT_AVATAR, getUserImage } from '@/utils/media';

const AdminNavbar = ({ toggleSidebar, userDropdownOpen, toggleUserDropdown }) => {
  const { auth } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await axios.get(route('notifications.index'));
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Notification fetch error:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log('Searching for:', searchQuery);
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(route('notifications.markAllRead'));
      setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Mark notifications read error:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      await axios.delete(route('notifications.clear'));
      setNotifications([]);
    } catch (error) {
      console.error('Clear notifications error:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const userImage = getUserImage(auth?.user);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
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

        <div className="flex items-center relative">
          <div className="relative">
            <button
              onClick={() => {
                const nextOpen = !notificationOpen;
                setNotificationOpen(nextOpen);
                if (nextOpen) {
                  fetchNotifications();
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-600 relative"
            >
              <FiBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <h4 className="text-sm font-semibold text-gray-700">Notifications</h4>
                  <div className="flex items-center gap-3">
                    <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:underline">
                      Mark all as read
                    </button>
                    <button onClick={clearNotifications} className="text-xs text-red-600 hover:underline">
                      Clear all
                    </button>
                  </div>
                </div>

                {loadingNotifications ? (
                  <p className="text-center py-3 text-gray-500 text-sm">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-center py-3 text-gray-500 text-sm">No notifications</p>
                ) : (
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 ${!n.read ? 'bg-indigo-50' : ''}`}
                      >
                        {n.read ? (
                          <FiCheckCircle className="text-gray-400" />
                        ) : (
                          <FiMail className="text-indigo-500" />
                        )}
                        <div className="text-gray-700">
                          <p className="font-medium">{n.title}</p>
                          <p>{n.message}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="ml-4 relative">
            <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none">
              <img
                src={userImage}
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />

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
