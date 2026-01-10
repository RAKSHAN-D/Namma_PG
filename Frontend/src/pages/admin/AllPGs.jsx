import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Search, Filter, MoreVertical } from 'lucide-react';

const MOCK_PGS = [
    { id: 1, name: "Sunrise Luxury PG", location: "Koramangala, Bangalore", owner: "Ramesh Kumar", status: "Approved", rating: 4.5 },
    { id: 2, name: "Green View Stay", location: "Indiranagar, Bangalore", owner: "Suresh Reddy", status: "Pending", rating: 0 },
    { id: 3, name: "Student Hub", location: "BTM Layout, Bangalore", owner: "Anita Roy", status: "Blocked", rating: 3.2 },
    { id: 4, name: "Elite Mens PG", location: "HSR Layout, Bangalore", owner: "Rahul Sharma", status: "Approved", rating: 4.8 },
    { id: 5, name: "Comfort Zone", location: "Whitefield, Bangalore", owner: "John Doe", status: "Pending", rating: 0 },
];

const AllPGs = () => {
    const [pgs, setPgs] = useState(MOCK_PGS);
    const [searchTerm, setSearchTerm] = useState("");

    const handleStatusChange = (id, newStatus) => {
        setPgs(pgs.map(pg => pg.id === id ? { ...pg, status: newStatus } : pg));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return "bg-green-100 text-green-700 border-green-200";
            case 'Pending': return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case 'Blocked': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">All PG Listings</h2>

                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search PG..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm">
                            <th className="px-6 py-4 font-semibold">PG Details</th>
                            <th className="px-6 py-4 font-semibold">Owner</th>
                            <th className="px-6 py-4 font-semibold">Location</th>
                            <th className="px-6 py-4 font-semibold">Rating</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {pgs.map((pg) => (
                            <tr key={pg.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{pg.name}</td>
                                <td className="px-6 py-4 text-gray-600">{pg.owner}</td>
                                <td className="px-6 py-4 text-gray-600">{pg.location}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="flex items-center">
                                        ★ {pg.rating > 0 ? pg.rating : "N/A"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(pg.status)}`}>
                                        {pg.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View">
                                            <Eye size={18} />
                                        </button>

                                        {pg.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(pg.id, 'Approved')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(pg.id, 'Blocked')}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}

                                        {pg.status === 'Approved' && (
                                            <button
                                                onClick={() => handleStatusChange(pg.id, 'Blocked')}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="Block"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}

                                        {pg.status === 'Blocked' && (
                                            <button
                                                onClick={() => handleStatusChange(pg.id, 'Approved')}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                title="Unblock"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination (Mock) */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                <span>Showing 1 to 5 of 60 entries</span>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-50 bg-indigo-50 text-indigo-600 border-indigo-200">1</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default AllPGs;
