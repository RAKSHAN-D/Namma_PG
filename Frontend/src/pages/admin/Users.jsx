import React, { useState } from 'react';
import { Eye, ShieldBan, ShieldCheck, Mail, Search } from 'lucide-react';

const MOCK_USERS = [
    { id: 1, username: "john_doe", email: "john@example.com", role: "PG_USER", status: "Active", lastLogin: "2 hours ago" },
    { id: 2, username: "jane_smith", email: "jane@example.com", role: "PG_USER", status: "Active", lastLogin: "1 day ago" },
    { id: 3, username: "bob_wilson", email: "bob@example.com", role: "PG_USER", status: "Blocked", lastLogin: "30 days ago" },
    { id: 4, username: "alice_wonder", email: "alice@test.com", role: "PG_USER", status: "Active", lastLogin: "5 mins ago" },
];

const Users = () => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleBlock = (id) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: user.status === "Active" ? "Blocked" : "Active" }
                : user
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Platform Users</h2>
                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
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
                            <th className="px-6 py-4 font-semibold">Username</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Last Login</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 text-xs font-bold">
                                        {user.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">{user.lastLogin}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.status === 'Active'
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => toggleBlock(user.id)}
                                            className={`p-1.5 rounded hover:bg-opacity-20 ${user.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            title={user.status === 'Active' ? "Block User" : "Unblock User"}
                                        >
                                            {user.status === 'Active' ? <ShieldBan size={18} /> : <ShieldCheck size={18} />}
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

export default Users;
