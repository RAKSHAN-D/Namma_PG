import React, { useState, useEffect } from 'react';
import { AlertCircle, Filter, Search, Clock, MapPin, User, CheckCircle } from 'lucide-react';
import AdminService from "../../services/admin.service";

const Issues = () => {
    const [issues, setIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const data = await AdminService.getAllIssues();
                console.log("Issues data:", data);
                setIssues(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching issues:", error);
                setIssues([]);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-red-100 text-red-700 border-red-200';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-50 text-red-700 border-red-300';
            case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-300';
            case 'LOW': return 'bg-green-50 text-green-700 border-green-300';
            default: return 'bg-gray-50 text-gray-600 border-gray-300';
        }
    };

    const getIssueTypeIcon = (type) => {
        const typeUpper = type?.toUpperCase() || '';
        if (typeUpper.includes('WATER')) return '💧';
        if (typeUpper.includes('ELECTRICITY')) return '⚡';
        if (typeUpper.includes('FOOD')) return '🍽️';
        if (typeUpper.includes('WIFI')) return '📶';
        if (typeUpper.includes('CLEANLINESS')) return '🧹';
        return '📋';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch =
            (issue.title && issue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (issue.issueType && issue.issueType.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = filterStatus === "All" || issue.status === filterStatus;
        const matchesPriority = filterPriority === "All" || issue.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Statistics
    const stats = {
        total: issues.length,
        open: issues.filter(i => i.status === 'OPEN').length,
        inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
        resolved: issues.filter(i => i.status === 'RESOLVED').length,
        high: issues.filter(i => i.priority === 'HIGH').length
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading Issues...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-500">Total Issues</div>
                    <div className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
                    <div className="text-sm text-red-600">Open</div>
                    <div className="text-2xl font-bold text-red-700 mt-1">{stats.open}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200">
                    <div className="text-sm text-yellow-600">In Progress</div>
                    <div className="text-2xl font-bold text-yellow-700 mt-1">{stats.inProgress}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                    <div className="text-sm text-green-600">Resolved</div>
                    <div className="text-2xl font-bold text-green-700 mt-1">{stats.resolved}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
                    <div className="text-sm text-orange-600">High Priority</div>
                    <div className="text-2xl font-bold text-orange-700 mt-1">{stats.high}</div>
                </div>
            </div>

            {/* Main Issues Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <AlertCircle className="mr-2 text-indigo-600" />
                            Issues & Support Tickets
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Manage complaints, support requests, and reported issues.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="All">All Priority</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm">
                                <th className="px-6 py-4 font-semibold">Issue Details</th>
                                <th className="px-6 py-4 font-semibold">PG & Location</th>
                                <th className="px-6 py-4 font-semibold">Reported By</th>
                                <th className="px-6 py-4 font-semibold">Priority</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {filteredIssues.length > 0 ? (
                                filteredIssues.map((issue) => (
                                    <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2">
                                                <span className="text-lg">{getIssueTypeIcon(issue.issueType)}</span>
                                                <div>
                                                    <div className="font-medium text-gray-900">{issue.title || 'Untitled Issue'}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{issue.issueType || 'OTHER'}</div>
                                                    {issue.description && (
                                                        <div className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-xs">
                                                            {issue.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {issue.pg ? (
                                                <div className="flex items-start gap-1">
                                                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <div className="font-medium text-gray-700">{issue.pg.name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {issue.pg.area}, {issue.pg.city}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">No PG assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {issue.user ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                                        {issue.user.username ? issue.user.username.substring(0, 2).toUpperCase() : '??'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-700">{issue.user.fullName || issue.user.username}</div>
                                                        <div className="text-xs text-gray-500">@{issue.user.username || 'unknown'}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Unknown</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(issue.priority)}`}>
                                                {issue.priority || 'MEDIUM'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                                                {issue.status ? issue.status.replace('_', ' ') : 'OPEN'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="text-gray-400" />
                                                <span className="text-xs">{formatDate(issue.reportedAt)}</span>
                                            </div>
                                            {issue.resolvedAt && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <CheckCircle size={12} className="text-green-500" />
                                                    <span className="text-xs text-green-600">{formatDate(issue.resolvedAt)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm hover:underline">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                        No issues found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500 bg-gray-50">
                    <span>Showing {filteredIssues.length} of {issues.length} issues</span>
                    <div className="text-xs text-gray-400">
                        {filterStatus !== 'All' && `Filtered by: ${filterStatus}`}
                        {filterPriority !== 'All' && ` • ${filterPriority} Priority`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Issues;
