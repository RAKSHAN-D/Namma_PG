import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import OwnerService from '../../../services/owner.service';

const IssuesTab = ({ pgId }) => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIssues();
    }, [pgId]);

    useEffect(() => {
        applyFilters();
    }, [issues, filterStatus]);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const data = await OwnerService.getPGIssues(pgId);
            setIssues(data);
        } catch (error) {
            console.error('Error fetching issues:', error);
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        setIssues([
            {
                id: 1,
                title: 'Water leakage in Room 5',
                description: 'Water is dripping from the ceiling. Please fix urgently.',
                category: 'Maintenance',
                priority: 'High',
                status: 'Open',
                reportedBy: 'Amit Kumar',
                reportedAt: '2024-01-10',
                ownerComment: null
            },
            {
                id: 2,
                title: 'Wi-Fi not working',
                description: 'Internet connection is very slow in Room 12.',
                category: 'Connectivity',
                priority: 'Medium',
                status: 'InProgress',
                reportedBy: 'Ravi Shah',
                reportedAt: '2024-01-09',
                ownerComment: 'Technician will visit tomorrow'
            },
            {
                id: 3,
                title: 'AC repair needed',
                description: 'AC is making noise in Room 8.',
                category: 'Maintenance',
                priority: 'Low',
                status: 'Resolved',
                reportedBy: 'John Doe',
                reportedAt: '2024-01-05',
                ownerComment: 'Fixed by technician on Jan 6'
            },
            {
                id: 4,
                title: 'Food quality issue',
                description: 'Food was not fresh today.',
                category: 'Food',
                priority: 'High',
                status: 'Open',
                reportedBy: 'Priya Sharma',
                reportedAt: '2024-01-10',
                ownerComment: null
            }
        ]);
    };

    const applyFilters = () => {
        let filtered = [...issues];

        if (filterStatus === 'open') {
            filtered = filtered.filter(i => i.status === 'Open');
        } else if (filterStatus === 'progress') {
            filtered = filtered.filter(i => i.status === 'InProgress');
        } else if (filterStatus === 'resolved') {
            filtered = filtered.filter(i => i.status === 'Resolved');
        } else if (filterStatus === 'urgent') {
            filtered = filtered.filter(i => i.priority === 'High');
        }

        setFilteredIssues(filtered);
    };

    const handleStatusChange = async (issueId, newStatus, comment = '') => {
        try {
            await OwnerService.updateIssueStatus(issueId, {
                status: newStatus,
                comment: comment
            });
            fetchIssues(); // Refresh
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };

    const openCount = issues.filter(i => i.status === 'Open').length;
    const progressCount = issues.filter(i => i.status === 'InProgress').length;
    const resolvedCount = issues.filter(i => i.status === 'Resolved').length;
    const urgentCount = issues.filter(i => i.priority === 'High').length;

    const getPriorityColor = (priority) => {
        if (priority === 'High') return 'text-red-600';
        if (priority === 'Medium') return 'text-yellow-600';
        return 'text-green-600';
    };

    const getPriorityBg = (priority) => {
        if (priority === 'High') return 'bg-red-100';
        if (priority === 'Medium') return 'bg-yellow-100';
        return 'bg-green-100';
    };

    const getStatusColor = (status) => {
        if (status === 'Open') return 'bg-red-100 text-red-800';
        if (status === 'InProgress') return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    if (loading) {
        return <div className="text-center py-12">Loading issues...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">Open</p>
                    <h3 className="text-3xl font-bold text-red-600 mt-2">{openCount}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <h3 className="text-3xl font-bold text-yellow-600 mt-2">{progressCount}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">{resolvedCount}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <h3 className="text-3xl font-bold text-orange-600 mt-2">{urgentCount}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All Issues
                    </button>
                    <button
                        onClick={() => setFilterStatus('open')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'open'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Open Only
                    </button>
                    <button
                        onClick={() => setFilterStatus('progress')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'progress'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => setFilterStatus('resolved')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'resolved'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Resolved
                    </button>
                    <button
                        onClick={() => setFilterStatus('urgent')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'urgent'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Urgent
                    </button>
                </div>
            </div>

            {/* Issues List */}
            <div className="space-y-4">
                {filteredIssues.map(issue => (
                    <div key={issue.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityBg(issue.priority)} ${getPriorityColor(issue.priority)}`}>
                                        {issue.priority} Priority
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                                        {issue.status === 'InProgress' ? 'In Progress' : issue.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-3">{issue.description}</p>

                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <span>Category: <span className="font-medium text-gray-700">{issue.category}</span></span>
                                    <span>Reported by: <span className="font-medium text-gray-700">{issue.reportedBy}</span></span>
                                    <span>Date: <span className="font-medium text-gray-700">{issue.reportedAt}</span></span>
                                </div>

                                {issue.ownerComment && (
                                    <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                        <div className="flex items-start">
                                            <MessageSquare size={16} className="text-indigo-600 mt-0.5 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-indigo-900">Owner Comment:</p>
                                                <p className="text-sm text-indigo-700">{issue.ownerComment}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                                {issue.status === 'Open' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(issue.id, 'InProgress', 'Working on it')}
                                            className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                                        >
                                            <Clock size={16} className="mr-2" />
                                            Mark In Progress
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(issue.id, 'Resolved', 'Fixed')}
                                            className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                        >
                                            <CheckCircle size={16} className="mr-2" />
                                            Mark Resolved
                                        </button>
                                    </>
                                )}
                                {issue.status === 'InProgress' && (
                                    <button
                                        onClick={() => handleStatusChange(issue.id, 'Resolved', 'Completed')}
                                        className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                    >
                                        <CheckCircle size={16} className="mr-2" />
                                        Mark Resolved
                                    </button>
                                )}
                                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                    <MessageSquare size={16} className="mr-2" />
                                    Add Comment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredIssues.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No issues found</p>
                </div>
            )}

            {/* Issue Categories Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Issue Categories Breakdown</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Maintenance</span>
                        <span className="font-semibold text-gray-900">2 issues</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Food Quality</span>
                        <span className="font-semibold text-gray-900">1 issue</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Connectivity</span>
                        <span className="font-semibold text-gray-900">1 issue</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssuesTab;
