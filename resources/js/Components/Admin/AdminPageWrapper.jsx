import React, { useState } from 'react';
import { 
  FiHome, FiShoppingCart, FiUsers, FiPackage, 
  FiBarChart2, FiSettings, 
  FiActivity
} from 'react-icons/fi';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { usePage } from '@inertiajs/react';

const AdminPageWrapper = ({ children}) => {
  const {url,props} = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const authUser =props.auth?.user

  const isAdmin = authUser?.role === 'admin';
  const isCustomer = authUser?.role === 'customer';

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(prev => !prev);
  };

  // Navigation items for the sidebar
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  
    { name: 'Orders', href: '/order', icon: FiShoppingCart },
    // { name: 'Customers', href: '/customer', icon: FiUsers },
    ...(isAdmin ? [
      { name: 'Products', href: '/product', icon: FiPackage },
      { name: 'Users', href: '/user', icon: FiUsers },
      { name: 'Activity Log', href: '/activitylog', icon: FiActivity },
        { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
    { name: 'Settings', href: '/setting', icon: FiSettings },
    ] : []),
  
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        navigationItems={navigationItems}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <AdminNavbar 
          toggleSidebar={toggleSidebar}
          userDropdownOpen={userDropdownOpen}
          toggleUserDropdown={toggleUserDropdown}
          authUser={authUser}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminPageWrapper;