import React, { useState } from "react";
import {
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiTrendingUp,
  FiSearch,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const MainContent = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [search, setSearch] = useState("");

  // Mock chart data
  const salesData = {
    monthly: [
      { name: "Jan", value: 65 },
      { name: "Feb", value: 59 },
      { name: "Mar", value: 80 },
      { name: "Apr", value: 81 },
      { name: "May", value: 56 },
      { name: "Jun", value: 72 },
      { name: "Jul", value: 68 },
      { name: "Aug", value: 75 },
      { name: "Sep", value: 60 },
      { name: "Oct", value: 78 },
      { name: "Nov", value: 82 },
      { name: "Dec", value: 70 },
    ],
    weekly: [
      { name: "W1", value: 30 },
      { name: "W2", value: 45 },
      { name: "W3", value: 50 },
      { name: "W4", value: 42 },
    ],
    daily: [
      { name: "Mon", value: 5 },
      { name: "Tue", value: 7 },
      { name: "Wed", value: 8 },
      { name: "Thu", value: 6 },
      { name: "Fri", value: 9 },
      { name: "Sat", value: 10 },
      { name: "Sun", value: 8 },
    ],
  };

  const customerData = {
    monthly: [
      { name: "Jan", value: 120 },
      { name: "Feb", value: 150 },
      { name: "Mar", value: 180 },
      { name: "Apr", value: 210 },
      { name: "May", value: 230 },
      { name: "Jun", value: 250 },
      { name: "Jul", value: 275 },
      { name: "Aug", value: 300 },
      { name: "Sep", value: 280 },
      { name: "Oct", value: 310 },
      { name: "Nov", value: 340 },
      { name: "Dec", value: 360 },
    ],
    weekly: [
      { name: "W1", value: 40 },
      { name: "W2", value: 50 },
      { name: "W3", value: 65 },
      { name: "W4", value: 70 },
    ],
    daily: [
      { name: "Mon", value: 10 },
      { name: "Tue", value: 12 },
      { name: "Wed", value: 15 },
      { name: "Thu", value: 18 },
      { name: "Fri", value: 20 },
      { name: "Sat", value: 22 },
      { name: "Sun", value: 25 },
    ],
  };

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, Admin! Here's your latest overview.
            </p>
          </div>

          <div className="mt-3 md:mt-0 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Sales",
              value: "$24,500",
              change: "+12.5%",
              color: "blue",
              icon: FiShoppingCart,
            },
            {
              title: "Total Customers",
              value: "1,258",
              change: "+8.2%",
              color: "green",
              icon: FiUsers,
            },
            {
              title: "Total Products",
              value: "356",
              change: "+3.1%",
              color: "purple",
              icon: FiPackage,
            },
            {
              title: "Conversion Rate",
              value: "4.5%",
              change: "-1.2%",
              color: "yellow",
              icon: FiBarChart2,
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white border-l-4 border-${card.color}-500 rounded-lg shadow p-4 flex items-center`}
            >
              <div className={`p-3 bg-${card.color}-100 rounded-lg`}>
                <card.icon className={`text-${card.color}-600 w-6 h-6`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {card.value}
                </p>
                <span
                  className={`text-xs font-semibold ${
                    card.change.includes("-")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Overview */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Overview
              </h3>
              <button className="text-sm text-blue-600 hover:underline">
                View Report
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData[timeRange]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Acquisition */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Acquisition
              </h3>
              <button className="text-sm text-blue-600 hover:underline">
                View Report
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerData[timeRange]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <ul className="divide-y divide-gray-100">
            {[
              {
                icon: FiShoppingCart,
                color: "blue",
                title: "New order #3245 placed",
                desc: "Customer: John Doe • Total: $245.99",
                time: "2h ago",
              },
              {
                icon: FiUsers,
                color: "green",
                title: "New customer registered",
                desc: "Sarah Johnson joined the platform",
                time: "5h ago",
              },
              {
                icon: FiPackage,
                color: "yellow",
                title: "Product low in stock",
                desc: "Wireless Headphones has only 3 items left",
                time: "1d ago",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-center py-3">
                <div
                  className={`flex-shrink-0 bg-${item.color}-100 text-${item.color}-600 p-2 rounded-full`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {item.time}
                </p>
              </li>
            ))}
          </ul>
 <a href="/activitylog">
          <div className="mt-4">
           
            <button className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              View all activity
            </button>
          </div>
          </a>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
