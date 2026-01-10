import React, { useState } from 'react';
import { Eye, ShieldBan, ShieldCheck, Mail, Search, Filter } from 'lucide-react';

const MOCK_OWNERS = [
    { id: 1, name: "Ramesh Kumar", email: "ramesh@example.com", pgs: 3, status: "Active" },
    { id: 2, name: "Suresh Reddy", email: "suresh@example.com", pgs: 1, status: "Active" },
    { id: 3, name: "Anita Roy", email: "anita@example.com", pgs: 0, status: "Blocked" },
    { id: 4, name: "Rahul Sharma", email: "rahul@example.com", pgs: 5, status: "Active" },
];

const Owners = () => {
    const [owners, setOwners] = useState(MOCK_OWNERS);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleBlock = (id) => {
        setOwners(owners.map(owner =>
            owner.id === id
                ? { ...owner, status: owner.status === "Active" ? "Blocked" : "Active" }
                : owner
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">PG Owners Management</h2>
                {/* Search Bar (Similar to PGs) */}
                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search owners..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm">
                            <th className="px-6 py-4 font-semibold">Name</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Total PGs</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {owners.map((owner) => (
                            <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{owner.name}</td>
                                <td className="px-6 py-4 text-gray-600 flex items-center">
                                    <Mail size={14} className="mr-2 text-gray-400" /> {owner.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium text-xs">
                                        {owner.pgs} PGs
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${owner.status === 'Active'
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                        }`}>
                                        {owner.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View Profile">
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => toggleBlock(owner.id)}
                                            className={`p-1.5 rounded hover:bg-opacity-20 ${owner.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            title={owner.status === 'Active' ? "Block User" : "Unblock User"}
                                        >
                                            {owner.status === 'Active' ? <ShieldBan size={18} /> : <ShieldCheck size={18} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Owners;
