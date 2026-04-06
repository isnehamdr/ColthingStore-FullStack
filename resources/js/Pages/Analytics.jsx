import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AdminPageWrapper from "@/Components/Admin/AdminPageWrapper";

const COLORS = ["#378ADD", "#7F77DD", "#1D9E75", "#EF9F27", "#D85A30", "#888780"];

const Analytics = ({ initialData }) => {
    const [data, setData] = useState(
        initialData || {
            totalVisitors: 0,
            totalPageViews: 0,
            visitorsAndPageViews: [],
            topPages: [],
            topBrowsers: [],
        }
    );
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!initialData) fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/admin/analytics/data");
            setData(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load analytics data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const allPages = data.topPages || [];
    const top5Pages = allPages.slice(0, 5);
    const total = allPages.reduce((sum, p) => sum + (p.screenPageViews || 0), 0);
    const maxViews = allPages[0]?.screenPageViews || 1;

    const pieData = top5Pages.map((p, i) => ({
        name: p.pageTitle || p.pagePath || "Unknown",
        value: p.screenPageViews || 0,
        url: p.pagePath || "",
        percentage: total > 0 ? ((p.screenPageViews / total) * 100).toFixed(1) + "%" : "0%",
        color: COLORS[i % COLORS.length],
    }));

    const barData = (data.visitorsAndPageViews || []).map((item) => ({
        name: item.date,
        visitors: item.visitors || 0,
        pageviews: item.pageViews || 0,
    }));

    const avgVisitors = barData.length > 0
        ? Math.round(barData.reduce((s, i) => s + i.visitors, 0) / barData.length).toLocaleString()
        : "0";
    const avgPageViews = barData.length > 0
        ? Math.round(barData.reduce((s, i) => s + i.pageviews, 0) / barData.length).toLocaleString()
        : "0";

    const PieCustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-gray-900/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-gray-800 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                        <p className="font-semibold text-white truncate max-w-[200px]">{d.name}</p>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-gray-300">Views</span>
                        <span className="font-semibold text-white">{d.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-gray-300">Share</span>
                        <span className="font-semibold text-white">{d.percentage}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <AdminPageWrapper>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Loading analytics data...</p>
                    </div>
                </div>
            </AdminPageWrapper>
        );
    }

    if (error) {
        return (
            <AdminPageWrapper>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Try Again
                        </button>
                    </div>
                </div>
            </AdminPageWrapper>
        );
    }

    return (
        <AdminPageWrapper>
            <div className="sm:px-6 lg:px-8 py-6 lg:py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-500 mt-2">Monitor your website performance in real-time</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">Last 30 days</span>
                            <button onClick={fetchData} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-2">Total Visitors</p>
                        <p className="text-4xl font-bold text-gray-900">{data.totalVisitors?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-2">Page Views</p>
                        <p className="text-4xl font-bold text-gray-900">{data.totalPageViews?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-2">Avg. Visitors</p>
                        <p className="text-4xl font-bold text-gray-900">{avgVisitors}</p>
                        <p className="text-xs text-gray-500 mt-1">Daily average</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-2">Avg. Page Views</p>
                        <p className="text-4xl font-bold text-gray-900">{avgPageViews}</p>
                        <p className="text-xs text-gray-500 mt-1">Daily average</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                    {/* Pie Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top pages distribution</h3>
                        {pieData.length > 0 ? (
                            <>
                                <div className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%" cy="50%"
                                                innerRadius={isMobile ? 50 : 65}
                                                outerRadius={isMobile ? 80 : 95}
                                                paddingAngle={1}
                                                dataKey="value"
                                                strokeWidth={0}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} stroke="#fff" strokeWidth={2} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<PieCustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {pieData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{item.url}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-3">
                                                <p className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</p>
                                                <p className="text-xs text-gray-400">{item.percentage}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No page data available</div>
                        )}
                    </div>

                    {/* Top 5 Pages ranked list */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 pages</h3>
                        {top5Pages.length > 0 ? (
                            <div className="space-y-4">
                                {top5Pages.map((page, index) => {
                                    const views = page.screenPageViews || 0;
                                    const pct = total > 0 ? ((views / total) * 100).toFixed(1) : "0";
                                    const barWidth = Math.round((views / maxViews) * 100);
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-xs font-semibold text-gray-400 w-4">{index + 1}</span>
                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                        {page.pageTitle || page.pagePath || "Unknown"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                    <span className="text-xs text-gray-400">{pct}%</span>
                                                    <span className="text-sm font-bold text-gray-900">{views.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${barWidth}%`, backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No data available</div>
                        )}

                        {/* Top Browsers */}
                        {data.topBrowsers?.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Top browsers</h4>
                                <div className="space-y-2">
                                    {data.topBrowsers.slice(0, 4).map((browser, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span className="text-sm text-gray-800">{browser.browser}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {browser.visitors?.toLocaleString()} visitors
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* All Pages Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">All page views</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Complete breakdown of every tracked page</p>
                    </div>
                    {allPages.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 w-10">#</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500">Page</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500">Path</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-right">Views</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-right">Share</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 w-36">Distribution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {allPages.map((page, index) => {
                                        const views = page.screenPageViews || 0;
                                        const pct = total > 0 ? ((views / total) * 100).toFixed(1) : "0";
                                        const barWidth = Math.round((views / maxViews) * 100);
                                        const color = index < 5 ? COLORS[index] : "#B4B2A9";
                                        return (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-3 text-sm text-gray-400 font-medium">{index + 1}</td>
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900 max-w-[200px] truncate">
                                                    {page.pageTitle || "Unknown"}
                                                </td>
                                                <td className="px-6 py-3 text-xs text-gray-400 max-w-[180px] truncate">
                                                    {page.pagePath || "—"}
                                                </td>
                                                <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">
                                                    {views.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500 text-right">{pct}%</td>
                                                <td className="px-6 py-3">
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-2 rounded-full"
                                                            style={{ width: `${barWidth}%`, backgroundColor: color }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center text-gray-400 text-sm">No page data available</div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Data updates in real-time &bull; Last updated:{" "}
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
        </AdminPageWrapper>
    );
};

export default Analytics;