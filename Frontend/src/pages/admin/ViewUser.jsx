import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminService from "../../services/admin.service";
import { ArrowLeft, User, Mail, Calendar, ShieldCheck, ShieldBan, BookOpen, AlertCircle, TrendingUp, Package } from "lucide-react";

const ViewUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const data = await AdminService.getUserDetails(id);
            setUser(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching user details:", err);
            if (err.response && err.response.status === 401) {
                setError("Unauthorized. Please log in again.");
            } else if (err.response && err.response.status === 404) {
                setError("User Not Found.");
            } else {
                setError("Failed to load user details. " + (err.message || "Server Error"));
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getBookingStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CHECKED_IN': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'REQUESTED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getIssueStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-red-100 text-red-700 border-red-200';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600';
            case 'MEDIUM': return 'text-yellow-600';
            case 'LOW': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-xl text-gray-500 font-semibold animate-pulse">Loading User Details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center flex-col gap-4">
                <div className="text-xl text-red-500 font-bold">{error}</div>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Go Back</button>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex flex-col bg-gray-50 min-h-screen font-sans text-gray-800">
            <div className="flex-1 p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                {user.fullName || user.username}
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${user.active ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                    {user.active ? "Active" : "Blocked"}
                                </span>
                            </h1>
                            <div className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                <Mail size={14} /> {user.email}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const newStatus = !user.active;
                            AdminService.updateUserStatus(user.id, newStatus).then(() => {
                                setUser({ ...user, active: newStatus });
                            });
                        }}
                        className={`px-4 py-2 ${user.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg shadow transition flex items-center gap-2`}
                    >
                        {user.active ? <><ShieldBan size={16} /> Block User</> : <><ShieldCheck size={16} /> Unblock User</>}
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{user.totalBookings}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Bookings</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{user.activeBookings}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Issues</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{user.totalIssues}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <AlertCircle className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Open Issues</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{user.openIssues}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <Package className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">

                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                            <User size={18} /> User Information
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Full Name</span>
                                <span className="font-medium text-gray-800">{user.fullName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Username</span>
                                <span className="font-medium text-gray-800">@{user.username || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-blue-600">{user.email}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-medium ${user.active ? 'text-green-600' : 'text-red-600'}`}>
                                    {user.active ? 'Active' : 'Blocked'}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Member Since</span>
                                <span className="font-medium text-gray-800 flex items-center gap-1">
                                    <Calendar size={14} /> {formatDate(user.createdAt)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500">Roles</span>
                                <div className="flex gap-2 flex-wrap justify-end">
                                    {user.roles && user.roles.length > 0 ? (
                                        Array.from(user.roles).map((role, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs border border-purple-200 font-medium">
                                                {role.replace('ROLE_', '')}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">No roles</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bookings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-h-[500px] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 sticky top-0 bg-white pb-2">
                            <BookOpen size={18} /> Bookings ({user.bookings ? user.bookings.length : 0})
                        </h2>
                        {user.bookings && user.bookings.length > 0 ? (
                            <div className="space-y-3">
                                {user.bookings.map((booking) => (
                                    <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-medium text-gray-800">{booking.pgName}</div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getBookingStatusColor(booking.bookingStatus)}`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <div>{booking.pgArea}, {booking.pgCity}</div>
                                            <div className="flex items-center gap-2">
                                                <span>Check-in: {formatDate(booking.checkInDate)}</span>
                                                {booking.checkOutDate && <span>• Check-out: {formatDate(booking.checkOutDate)}</span>}
                                            </div>
                                            {booking.totalAmount && (
                                                <div className="font-medium text-gray-700 mt-1">
                                                    ₹{booking.totalAmount.toLocaleString()} • {booking.roomSharingType || 'N/A'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No bookings found.</p>
                        )}
                    </div>

                    {/* Issues - Full Width */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 max-h-[500px] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 sticky top-0 bg-white pb-2">
                            <AlertCircle size={18} /> Issues Reported ({user.issues ? user.issues.length : 0})
                        </h2>
                        {user.issues && user.issues.length > 0 ? (
                            <div className="space-y-3">
                                {user.issues.map((issue) => (
                                    <div key={issue.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-medium text-gray-800">{issue.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">PG: {issue.pgName || 'N/A'}</div>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                                                    {issue.priority}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getIssueStatusColor(issue.status)}`}>
                                                    {issue.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">{issue.description}</div>
                                        <div className="text-xs text-gray-400">
                                            Type: <span className="font-medium">{issue.issueType}</span> •
                                            Reported: {formatDate(issue.reportedAt)}
                                            {issue.resolvedAt && ` • Resolved: ${formatDate(issue.resolvedAt)}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No issues reported.</p>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ViewUser;
