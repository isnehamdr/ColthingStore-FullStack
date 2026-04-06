


import AdminPageWrapper from '@/Components/Admin/AdminPageWrapper';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Projector, ShoppingBag, MessageSquare, User, Home } from 'lucide-react';
import axios from 'axios';
import {
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { usePage } from '@inertiajs/react';



// ─── icon map ────────────────────────────────────────────────────────────────
const ICON_MAP = {
  dollar:  FiDollarSign,
  cart:    FiShoppingCart,
  package: FiPackage,
  users:   FiUsers,
};

const COLOR_MAP = {
  green:  { bg: 'bg-green-50',  icon: 'text-green-600'  },
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600'   },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
};

const CHART_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// ─── skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ─── main component ───────────────────────────────────────────────────────────
const Dashboard = () => {
   const cards = [
        {
            title: "Profiles",
            breadcrumb: "Profiles",
            icon: User,
            link: "/profiles"
        },
        {
            title: "Orders",
            breadcrumb: "Products",
            icon: ShoppingBag,
            link: "/order"
        },
        {
            title: "Go Back to Home",
            breadcrumb: "Home",
            icon: Home,
            link: "/"
        },
    ];
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const user = usePage().props.auth.user;
    const isAdmin = user?.role === "admin";
    const isCustomer = user?.role === "customer";

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(route('dashboard.stats'));
      if (res.data.success) {
        setData(res.data.data);
        setLastUpdated(new Date());
      } else {
        setError('Failed to load dashboard data.');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const timer = setInterval(fetchDashboard, 60_000);
    return () => clearInterval(timer);
  }, [fetchDashboard]);

  return (
    <AdminPageWrapper>
      {isAdmin && (
         <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Track your business performance and metrics</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-gray-400">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* ── Error banner ────────────────────────────────────────────────── */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchDashboard}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Revenue note ────────────────────────────────────────────────── */}
          <div className="mb-4 text-xs text-gray-400 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Revenue figures include only <strong className="text-gray-600 ml-1">completed</strong> orders
          </div>

          {/* ── Stats Grid ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading
              ? [0,1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between mb-4">
                      <Skeleton className="w-12 h-12" />
                      <Skeleton className="w-16 h-5" />
                    </div>
                    <Skeleton className="w-24 h-3 mb-2" />
                    <Skeleton className="w-32 h-7" />
                  </div>
                ))
              : (data?.stats || []).map((stat, index) => {
                  const Icon    = ICON_MAP[stat.icon] || FiDollarSign;
                  const colors  = COLOR_MAP[stat.color] || COLOR_MAP.blue;
                  const isUp    = stat.trend === 'up';
                  return (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${colors.bg} p-3 rounded-lg`}>
                          <Icon className={`h-6 w-6 ${colors.icon}`} />
                        </div>
                        <span className={`flex items-center text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isUp ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  );
                })
            }
          </div>

          {/* ── Charts ──────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Line Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiMoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-5">Completed orders only · last 7 days</p>
              {loading
                ? <Skeleton className="w-full h-72" />
                : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data?.revenueChart || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={v => `$${v}`} />
                      <Tooltip
                        formatter={v => [`$${Number(v).toFixed(2)}`, 'Revenue']}
                        contentStyle={{ backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'8px' }}
                      />
                      <Line
                        type="monotone" dataKey="revenue" stroke="#4F46E5"
                        strokeWidth={2} dot={{ fill:'#4F46E5', r:4 }}
                        activeDot={{ r:6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )
              }
            </div>

            {/* Orders Bar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">Daily Orders</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiMoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-5">All statuses · last 7 days</p>
              {loading
                ? <Skeleton className="w-full h-72" />
                : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data?.ordersChart || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        formatter={v => [v, 'Orders']}
                        contentStyle={{ backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'8px' }}
                      />
                      <Bar dataKey="orders" fill="#4F46E5" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )
              }
            </div>
          </div>

          {/* ── Bottom Section ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Category Pie */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Sales by Category</h2>
              <p className="text-xs text-gray-400 mb-4">Completed orders only</p>
              {loading
                ? <Skeleton className="w-full h-60" />
                : (data?.categoryData?.length
                  ? <>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={data.categoryData} cx="50%" cy="50%"
                            innerRadius={55} outerRadius={85}
                            paddingAngle={4} dataKey="value"
                          >
                            {data.categoryData.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={v => [`${v}%`, 'Share']} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-3 space-y-2">
                        {data.categoryData.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                              <span className="text-sm text-gray-600 truncate max-w-[120px]">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  : <div className="text-center py-12 text-sm text-gray-400">No category data yet</div>
                )
              }
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Top Products</h2>
              <p className="text-xs text-gray-400 mb-4">By completed-order revenue</p>
              {loading
                ? <div className="space-y-4">{[0,1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
                : (data?.topProducts?.length
                  ? <div className="space-y-4">
                      {data.topProducts.map((product, i) => (
                        <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{product.sales} units sold</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 ml-2">{product.revenue}</span>
                        </div>
                      ))}
                    </div>
                  : <div className="text-center py-12 text-sm text-gray-400">No product sales yet</div>
                )
              }
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Recent Orders</h2>
              <p className="text-xs text-gray-400 mb-4">Latest 5 orders (all statuses)</p>
              {loading
                ? <div className="space-y-4">{[0,1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
                : (data?.recentOrders?.length
                  ? <div className="space-y-4">
                      {data.recentOrders.map((order, i) => (
                        <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{order.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{order.customer}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                            <span className="text-xs text-gray-400">{order.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  : <div className="text-center py-12 text-sm text-gray-400">No orders yet</div>
                )
              }
            </div>

          </div>
        </div>
      </div>
      )}

      {isCustomer && (
       <div className="max-w-7xl mx-auto py-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-10">
                    Dashboard
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Link key={index} href={card.link} className="block">
                                <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="text-xl font-semibold text-gray-800">Home</span>
                                        <span className="text-sm text-gray-500">| {card.breadcrumb}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
                                            <Icon className="w-7 h-7 text-gray-700" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800">{card.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
      )}
     
    </AdminPageWrapper>
  );
};

export default Dashboard;