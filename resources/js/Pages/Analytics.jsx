import AdminPageWrapper from '@/Components/Admin/AdminPageWrapper';
import React, { useState } from 'react';
import {
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data
  const stats = [
    {
      name: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      name: 'Total Orders',
      value: '2,345',
      change: '+15.3%',
      trend: 'up',
      icon: FiShoppingCart,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Total Products',
      value: '1,234',
      change: '+5.2%',
      trend: 'up',
      icon: FiPackage,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      name: 'Active Users',
      value: '8,765',
      change: '-2.4%',
      trend: 'down',
      icon: FiUsers,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const revenueData = [
    { name: 'Mon', revenue: 4200 },
    { name: 'Tue', revenue: 3800 },
    { name: 'Wed', revenue: 5100 },
    { name: 'Thu', revenue: 4600 },
    { name: 'Fri', revenue: 6200 },
    { name: 'Sat', revenue: 7500 },
    { name: 'Sun', revenue: 6800 }
  ];

  const orderData = [
    { name: 'Mon', orders: 45 },
    { name: 'Tue', orders: 52 },
    { name: 'Wed', orders: 61 },
    { name: 'Thu', orders: 48 },
    { name: 'Fri', orders: 72 },
    { name: 'Sat', orders: 88 },
    { name: 'Sun', orders: 79 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Clothing', value: 28 },
    { name: 'Home & Garden', value: 20 },
    { name: 'Sports', value: 12 },
    { name: 'Others', value: 5 }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 1243, revenue: '$24,860' },
    { name: 'Smart Watch Pro', sales: 987, revenue: '$19,740' },
    { name: 'Laptop Stand', sales: 856, revenue: '$12,840' },
    { name: 'USB-C Cable', sales: 745, revenue: '$7,450' },
    { name: 'Phone Case', sales: 623, revenue: '$6,230' }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$125.00', status: 'Completed', date: '2 min ago' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing', date: '15 min ago' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: '$234.00', status: 'Completed', date: '1 hour ago' },
    { id: '#ORD-004', customer: 'Sarah Williams', amount: '$156.75', status: 'Pending', date: '2 hours ago' },
    { id: '#ORD-005', customer: 'Tom Brown', amount: '$98.25', status: 'Completed', date: '3 hours ago' }
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
    <AdminPageWrapper>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your business performance and metrics</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <span className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FiMoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Daily Orders</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FiMoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="orders" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{product.sales} sales</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{order.customer}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                    <span className="text-xs text-gray-500">{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminPageWrapper>
    </>
  );
};

export default Analytics;