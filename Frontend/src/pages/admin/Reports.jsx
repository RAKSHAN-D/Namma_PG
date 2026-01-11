import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, TrendingUp, MapPin, AlertCircle, Users } from 'lucide-react';
import AdminService from '../../services/admin.service';

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            const data = await AdminService.getReportData();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl text-gray-500 font-semibold animate-pulse">Loading Reports...</div>
            </div>
        );
    }

    if (!reportData) {
        return <div className="p-10 text-center text-red-500">Failed to load reports</div>;
    }

    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

    // Prepare data for charts
    const pgStatusData = [
        { name: 'Approved', value: reportData.pgStatus.approved, color: '#10b981' },
        { name: 'Pending', value: reportData.pgStatus.pending, color: '#f59e0b' }
    ];

    const issueStatusData = [
        { name: 'Open', value: reportData.issueAnalytics.open, color: '#ef4444' },
        { name: 'In Progress', value: reportData.issueAnalytics.inProgress, color: '#f59e0b' },
        { name: 'Resolved', value: reportData.issueAnalytics.resolved, color: '#10b981' }
    ];

    const locationData = reportData.locationDistribution.map(item => ({
        location: item.location,
        count: item.count
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
                <p className="text-gray-500 mt-1">Historical insights and data trends for informed decision-making</p>
            </div>

            {/* Filter Section (UI Only for MVP) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Select date range"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option>All Entities</option>
                            <option>PGs Only</option>
                            <option>Users Only</option>
                            <option>Issues Only</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Card - Moved to Top */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Report Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <div className="text-gray-600">Platform Users</div>
                        <div className="text-2xl font-bold text-indigo-600">{reportData.userGrowth.totalUsers + reportData.userGrowth.totalOwners}</div>
                    </div>
                    <div>
                        <div className="text-gray-600">Active PGs</div>
                        <div className="text-2xl font-bold text-green-600">{reportData.pgStatus.approved}</div>
                    </div>
                    <div>
                        <div className="text-gray-600">Open Issues</div>
                        <div className="text-2xl font-bold text-red-600">{reportData.issueAnalytics.open}</div>
                    </div>
                    <div>
                        <div className="text-gray-600">Locations Covered</div>
                        <div className="text-2xl font-bold text-purple-600">{locationData.length}</div>
                    </div>
                </div>
            </div>

            {/* Reports Grid - 2 columns on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. User Growth Report */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="text-indigo-600" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">User Growth Report</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="text-sm text-gray-600 mb-1">Total Users</div>
                                <div className="text-2xl font-bold text-blue-600">{reportData.userGrowth.totalUsers}</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <div className="text-sm text-gray-600 mb-1">Total Owners</div>
                                <div className="text-2xl font-bold text-purple-600">{reportData.userGrowth.totalOwners}</div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500 italic">
                                📈 Time-series chart coming soon with date range filtering
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PG Status Report */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-green-600" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">PG Status Distribution</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={pgStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pgStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Total PGs: <span className="font-bold text-gray-800">{reportData.pgStatus.total}</span>
                    </div>
                </div>

                {/* 3. Issue Analytics Report */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="text-orange-600" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">Issue Analytics</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={issueStatusData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#6366f1">
                                {issueStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Total Issues: <span className="font-bold text-gray-800">{reportData.issueAnalytics.total}</span>
                    </div>
                </div>

                {/* 4. Location-wise PG Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="text-red-600" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">PG Distribution by Location</h2>
                    </div>
                    {locationData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={locationData}>
                                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-6 max-h-40 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Location</th>
                                            <th className="px-4 py-2 text-right font-semibold text-gray-700">PG Count</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {locationData.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-gray-800">{item.location}</td>
                                                <td className="px-4 py-2 text-right font-medium text-indigo-600">{item.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-10">No location data available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
