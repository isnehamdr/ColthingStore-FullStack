import AdminPageWrapper from '@/Components/Admin/AdminPageWrapper';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(route('ouractivities.index')); 
        
        if (response.data.success) {
          setActivities(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to load activities');
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load activity logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Filtering logic - UPDATED for new data structure
  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.name === filter;
    
    // Safe access with fallback to empty string if undefined
    const title = activity.title?.toLowerCase() || '';
    const name = activity.name?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      title.includes(searchLower) ||
      name.includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  // Helper functions - UPDATED
  const getActivityIcon = (name) => {
    switch (name) {
      case 'login': return '🔐';
      case 'file_upload': return '📁';
      case 'error': return '❌';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      default: return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });

  // Demo actions (optional for testing)
  const addDemoActivity = () => {
    const newActivity = {
      id: Date.now(),
      name: 'update',
      title: 'Added new demo activity',
      created_at: new Date().toISOString(),
      ip_address: '127.0.0.1'
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const clearActivities = () => setActivities([]);

  // Stats with safe access - UPDATED
  const total = activities.length;
  const loginCount = activities.filter(a => a.name === 'login').length;

  return (
    <AdminPageWrapper>
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
            <p className="text-sm text-gray-600 mt-1">Monitor system and user actions in real time</p>
          </header>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
              <div className="w-full md:w-64">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="login">Logins</option>
                  <option value="file_upload">Uploads</option>
                  <option value="update">Updates</option>
                  <option value="delete">Deletions</option>
                  <option value="error">Errors</option>
                </select>

                <button
                  onClick={addDemoActivity}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                >
                  + Demo
                </button>
                <button
                  onClick={clearActivities}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Loading / Error / Empty / List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-600">Loading activity log...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <h3 className="font-medium text-gray-900">No matching activities</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm">
                          {getActivityIcon(activity.name)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {/* Safe access for title */}
                            {activity.title || 'No title'}
                          </p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500">
                              {formatTime(activity.created_at)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor('success')}`}>
                              success
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                          <span>By System User</span>
                          <span>•</span>
                          <span>{formatDate(activity.created_at)}</span>
                          <span>•</span>
                          <span className="capitalize">{(activity.name || 'unknown').replace('_', ' ')}</span>
                          {activity.ip_address && (
                            <>
                              <span>•</span>
                              <span>IP: {activity.ip_address}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary - UPDATED */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: total, color: 'text-blue-600' },
              { label: 'Logins', value: loginCount, color: 'text-purple-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default ActivityLog;