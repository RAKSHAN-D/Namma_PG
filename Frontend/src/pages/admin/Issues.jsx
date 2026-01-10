import React, { useState } from 'react';
import { AlertCircle, Filter, Search, MessageSquare, CheckCircle, Clock } from 'lucide-react';

// Mock data until backend is ready
const MOCK_ISSUES = [
    { id: 1, type: "Complaint", subject: "Water issue in Room 101", raisedBy: "Rahul (User)", date: "2023-10-25", status: "Open", purity: "High" },
    { id: 2, type: "Support", subject: "Payment not reflecting", raisedBy: "Suresh (Owner)", date: "2023-10-24", status: "In Progress", purity: "Medium" },
    { id: 3, type: "Complaint", subject: "Noisy neighbors", raisedBy: "Anita (User)", date: "2023-10-22", status: "Resolved", purity: "Low" },
    { id: 4, type: "Bug Report", subject: "Cannot upload PG images", raisedBy: "Ramesh (Owner)", date: "2023-10-20", status: "Open", purity: "High" },
];

const Issues = () => {
    const [issues, setIssues] = useState(MOCK_ISSUES);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-700 border-red-200';
            case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
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
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm">
                            <th className="px-6 py-4 font-semibold">Subject</th>
                            <th className="px-6 py-4 font-semibold">Type</th>
                            <th className="px-6 py-4 font-semibold">Raised By</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {issues.filter(i => filterStatus === "All" || i.status === filterStatus).map((issue) => (
                            <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{issue.subject}</div>
                                    <div className="text-xs text-red-500 mt-0.5" hidden={issue.purity !== 'High'}>High Priority</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="flex items-center">
                                        {issue.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{issue.raisedBy}</td>
                                <td className="px-6 py-4 text-gray-600 flex items-center">
                                    <Clock size={14} className="mr-1 text-gray-400" /> {issue.date}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {issues.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No issues found matching your filters.
                </div>
            )}
        </div>
    );
};

export default Issues;
