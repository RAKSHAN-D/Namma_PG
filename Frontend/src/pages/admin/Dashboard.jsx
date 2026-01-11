import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Building,
    Users,
    UserCheck,
    AlertCircle,
    TrendingUp,
    UserPlus
} from "lucide-react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import AdminService from "../../services/admin.service";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalPGs: 0, activeOwners: 0, activeUsers: 0, pendingApprovals: 0 });
    const [pgGrowthData, setPgGrowthData] = useState([]);
    const [userSignupData, setUserSignupData] = useState([]);
    const [onboardingData, setOnboardingData] = useState([]);
    const [pgStatusData, setPgStatusData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    statsData,
                    pgGrowth,
                    userSignup,
                    onboarding,
                    pgStatus
                ] = await Promise.all([
                    AdminService.getDashboardStats(),
                    AdminService.getPgGrowthData(),
                    AdminService.getUserSignupTrend(),
                    AdminService.getOnboardingTrend(),
                    AdminService.getPgStatusDistribution()
                ]);

                setStats(statsData);
                setPgGrowthData(pgGrowth);
                setUserSignupData(userSignup);
                setOnboardingData(onboarding);
                setPgStatusData(pgStatus);
            } catch (error) {
                console.error("Error fetching admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

            {/* 1. Stats Cards (Clickable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total PGs -> All PGs */}
                <Link
                    to="/admin/pgs"
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">Total PGs</p>
                        <h3 className="text-3xl font-bold text-indigo-900 mt-1">{stats.totalPGs}</h3>
                        <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                            <TrendingUp size={12} className="mr-1" /> +12% this month
                        </p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <Building size={24} />
                    </div>
                </Link>

                {/* Active Owners -> Owners */}
                <Link
                    to="/admin/owners"
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-purple-600 transition-colors">Active Owners</p>
                        <h3 className="text-3xl font-bold text-purple-900 mt-1">{stats.activeOwners}</h3>
                        <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                            <UserPlus size={12} className="mr-1" /> +2 new today
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                        <UserCheck size={24} />
                    </div>
                </Link>

                {/* Active Users -> Users */}
                <Link
                    to="/admin/users"
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">Active Users</p>
                        <h3 className="text-3xl font-bold text-blue-900 mt-1">{stats.activeUsers}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <Users size={24} />
                    </div>
                </Link>

                {/* Pending Issues -> Issues */}
                <Link
                    to="/admin/issues"
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-amber-600 transition-colors">Pending Issues</p>
                        <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats.pendingApprovals}</h3>
                        <p className="text-xs text-amber-600 font-medium mt-1">Unresolved</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 transition-colors">
                        <AlertCircle size={24} />
                    </div>
                </Link>
            </div>

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PG Growth Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">PG Growth Over Time</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={pgGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                                <Line type="monotone" dataKey="pgs" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: "#4F46E5" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Signup Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">User Signup Trend (This Month)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userSignupData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                                <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Onboarding Trend (Grouped Bar Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Onboarding Trend (Users vs Owners)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={onboardingData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" allowDecimals={false} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: "8px", border: "none" }} />
                                <Legend />
                                <Bar dataKey="users" name="Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="owners" name="Owners" fill="#F97316" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PG Status Listing (Full Width) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">PG Status Listing</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
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
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
