import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminService from "../../services/admin.service";
import { ArrowLeft, User, Mail, Calendar, ShieldCheck, ShieldBan, Building, AlertCircle, TrendingUp, Package } from "lucide-react";

const ViewOwner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOwnerDetails();
    }, [id]);

    const fetchOwnerDetails = async () => {
        try {
            const data = await AdminService.getOwnerDetails(id);
            setOwner(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching owner details:", err);
            if (err.response && err.response.status === 401) {
                setError("Unauthorized. Please log in again.");
            } else if (err.response && err.response.status === 404) {
                setError("Owner Not Found.");
            } else {
                setError("Failed to load owner details. " + (err.message || "Server Error"));
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

    const getPgStatusColor = (active) => {
        return active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
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
                <div className="text-xl text-gray-500 font-semibold animate-pulse">Loading Owner Details...</div>
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

    if (!owner) return null;

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
                                {owner.fullName || owner.username}
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${owner.active ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                    {owner.active ? "Active" : "Blocked"}
                                </span>
                            </h1>
                            <div className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                <Mail size={14} /> {owner.email}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const newStatus = !owner.active;
                            AdminService.updateUserStatus(owner.id, newStatus).then(() => {
                                setOwner({ ...owner, active: newStatus });
                            });
                        }}
                        className={`px-4 py-2 ${owner.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg shadow transition flex items-center gap-2`}
                    >
                        {owner.active ? <><ShieldBan size={16} /> Block Owner</> : <><ShieldCheck size={16} /> Unblock Owner</>}
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total PGs</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{owner.totalPgs}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <Building className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active PGs</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{owner.activePgs}</p>
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
                                <p className="text-2xl font-bold text-gray-800 mt-1">{owner.totalIssues}</p>
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
                                <p className="text-2xl font-bold text-red-600 mt-1">{owner.openIssues}</p>
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
                            <User size={18} /> Owner Information
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Full Name</span>
                                <span className="font-medium text-gray-800">{owner.fullName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Username</span>
                                <span className="font-medium text-gray-800">@{owner.username || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-blue-600">{owner.email}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-medium ${owner.active ? 'text-green-600' : 'text-red-600'}`}>
                                    {owner.active ? 'Active' : 'Blocked'}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Member Since</span>
                                <span className="font-medium text-gray-800 flex items-center gap-1">
                                    <Calendar size={14} /> {formatDate(owner.createdAt)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500">Roles</span>
                                <div className="flex gap-2 flex-wrap justify-end">
                                    {owner.roles && owner.roles.length > 0 ? (
                                        Array.from(owner.roles).map((role, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs border border-indigo-200 font-medium">
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

                    {/* PG Listings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-h-[500px] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 sticky top-0 bg-white pb-2">
                            <Building size={18} /> PG Listings ({owner.pgs ? owner.pgs.length : 0})
                        </h2>
                        {owner.pgs && owner.pgs.length > 0 ? (
                            <div className="space-y-3">
                                {owner.pgs.map((pg) => (
                                    <div
                                        key={pg.id}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition cursor-pointer"
                                        onClick={() => navigate(`/admin/pgs/${pg.id}`)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-medium text-gray-800">{pg.name}</div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPgStatusColor(pg.active)}`}>
                                                {pg.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <div>{pg.area}, {pg.city}</div>
                                            <div className="flex items-center gap-3">
                                                <span>{pg.totalRooms} Rooms</span>
                                                <span>•</span>
                                                <span>{pg.totalFloors} Floors</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${pg.gender === 'BOYS' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                                    {pg.gender}
                                                </span>
                                            </div>
                                            {pg.rating && (
                                                <div className="font-medium text-yellow-600 mt-1">
                                                    ★ {pg.rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No PG listings found.</p>
                        )}
                    </div>

                    {/* Issues - Full Width */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 max-h-[500px] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 sticky top-0 bg-white pb-2">
                            <AlertCircle size={18} /> Issues Reported ({owner.issues ? owner.issues.length : 0})
                        </h2>
                        {owner.issues && owner.issues.length > 0 ? (
                            <div className="space-y-3">
                                {owner.issues.map((issue) => (
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

export default ViewOwner;
