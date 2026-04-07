import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, Mail, Shield, Loader, Edit, Trash2, X, Save } from 'lucide-react';
import AdminPageWrapper from '@/Components/Admin/AdminPageWrapper';
import axios from 'axios';
import { getUserImage } from '@/utils/media';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    address: '',
    phone_number: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  // Get CSRF token from Laravel (it's automatically set in the HTML head)
  const getCsrfToken = () => {
    // Laravel automatically provides a CSRF token via the 'XSRF-TOKEN' cookie
    // Axios will automatically use it if we set withCredentials to true
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
           document.querySelector('input[name="_token"]')?.value;
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(route('users.index'));
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const addUser = async (userData) => {
    try {
      setActionLoading('adding');
      const response = await axios.post(route('users.store'), userData, {
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });

      setUsers(prev => [...prev, response.data.data]);
      setShowAddModal(false);
      resetForm();
      return response.data;
    } catch (err) {
      console.error('Error adding user:', err);
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
      throw err.response?.data?.message || err.message || 'Failed to add user';
    } finally {
      setActionLoading(null);
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    try {
      setActionLoading(`updating-${id}`);
      const response = await axios.put(route('users.update', id), userData, {
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });

      setUsers(prev => prev.map(user => 
        user.id === id ? response.data.data : user
      ));
      setEditingUser(null);
      return response.data;
    } catch (err) {
      console.error('Error updating user:', err);
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
      throw err.response?.data?.message || err.message || 'Failed to update user';
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(`deleting-${id}`);
      await axios.delete(route('users.destroy', id), {
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });

      setUsers(prev => prev.filter(user => user.id !== id));
      setActiveDropdown(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user: ' + (err.response?.data?.message || err.message || 'Failed to delete user'));
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    const colors = {
      'admin': 'bg-purple-100 text-purple-700 border-purple-200',
      'customer': 'bg-blue-100 text-blue-700 border-blue-200',
      'manager': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      setActiveDropdown(null);
    } catch (err) {
      alert('Error updating user role: ' + err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Don't pre-fill password for security
      role: user.role || 'customer',
      address: user.address || '',
      phone_number: user.phone_number || ''
    });
    setFormErrors({});
  };

  const handleSave = async (userId) => {
    try {
      // Remove password if empty to avoid validation issues
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await updateUser(userId, dataToSend);
    } catch (err) {
      // Error handling is done in updateUser
    }
  };

  const handleAddNewUser = async () => {
    try {
      await addUser(formData);
      resetForm();
    } catch (err) {
      // Error handling is done in addUser
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
      address: '',
      phone_number: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  if (loading) {
    return (
      <AdminPageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-slate-600 mt-2">Loading users...</p>
          </div>
        </div>
      </AdminPageWrapper>
    );
  }

  if (error) {
    return (
      <AdminPageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Shield className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Error loading users</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <button 
              onClick={fetchUsers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">User Management</h1>
            <p className="text-slate-600">Manage your team members and their roles</p>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <img
                      src={getUserImage(user)}
                      alt={user.name}
                      className="w-16 h-16 rounded-full border-2 border-slate-100 group-hover:border-blue-200 transition-colors object-cover"
                    />
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === user.id ? null : user.id);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        disabled={actionLoading}
                      >
                        {actionLoading === `updating-${user.id}` || actionLoading === `deleting-${user.id}` ? (
                          <Loader className="w-5 h-5 text-slate-400 animate-spin" />
                        ) : (
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      
                      {/* Dropdown menu for actions */}
                      {activeDropdown === user.id && (
                        <div 
                          className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <button 
                              onClick={() => handleRoleChange(user.id, 'admin')}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                              disabled={user.role === 'admin' || actionLoading}
                            >
                              <Shield className="w-4 h-4" />
                              Make Admin
                            </button>
                            <button 
                              onClick={() => handleRoleChange(user.id, 'customer')}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                              disabled={user.role === 'customer' || actionLoading}
                            >
                              <Edit className="w-4 h-4" />
                              Make Customer
                            </button>
                            <hr className="my-1" />
                            <button 
                              onClick={() => handleEdit(user)}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-slate-50"
                            >
                              <Edit className="w-4 h-4" />
                              Edit User
                            </button>
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingUser === user.id ? (
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Name"
                        />
                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
                      </div>
                      <div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Email"
                        />
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email[0]}</p>}
                      </div>
                      <div>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="New Password (leave empty to keep current)"
                        />
                        {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password[0]}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSave(user.id)}
                          disabled={actionLoading === `updating-${user.id}`}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50"
                        >
                          {actionLoading === `updating-${user.id}` ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingUser(null)}
                          className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate">
                        {user.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)} capitalize`}>
                          {user.role || 'customer'}
                        </span>
                      </div>

                      {user.address && (
                        <p className="text-sm text-slate-600 mt-2 truncate">{user.address}</p>
                      )}
                      {user.phone_number && (
                        <p className="text-sm text-slate-600 mt-1">{user.phone_number}</p>
                      )}
                    </>
                  )}
                </div>
                
                {editingUser !== user.id && (
                  <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add User Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Add New User</h3>
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter address"
                    />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                    {formErrors.phone_number && <p className="text-red-500 text-xs mt-1">{formErrors.phone_number[0]}</p>}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleAddNewUser}
                    disabled={actionLoading === 'adding'}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === 'adding' ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    Add User
                  </button>
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-2.5 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredUsers.length === 0 && users.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="text-slate-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No users found</h3>
              <p className="text-slate-500">Try adjusting your search criteria</p>
            </div>
          )}

          {/* No Users State */}
          {users.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="text-slate-400 mb-4">
                <UserPlus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No users yet</h3>
              <p className="text-slate-500 mb-4">Get started by adding your first user</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Add First User
              </button>
            </div>
          )}

          {/* Stats Footer */}
          {users.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">
                  Showing <span className="font-semibold text-slate-800">{filteredUsers.length}</span> of <span className="font-semibold text-slate-800">{users.length}</span> users
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default UserManagement;
