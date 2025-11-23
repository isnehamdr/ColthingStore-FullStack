import React from 'react';
import {
  FiShoppingCart, FiX, FiLogOut
} from 'react-icons/fi';

const AdminSidebar = ({ sidebarOpen, toggleSidebar, navigationItems }) => {
 
  return (
    <>
      {/* Sidebar Backdrop (only visible on mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <a href="/">
            <div className="flex items-center">
              <FiShoppingCart className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                ShopDash
              </span>
            </div>
          </a>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <FiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {/* Safe navigation items rendering */}
            {navigationItems && navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg ${item.active ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100'}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="mx-4 font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <a href="/login" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <FiLogOut className="h-5 w-5" />
            <span className="mx-4 font-medium">Logout</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;