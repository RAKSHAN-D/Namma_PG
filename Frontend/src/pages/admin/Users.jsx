import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, ShieldBan, ShieldCheck, Mail, Search, Filter, UserCircle } from 'lucide-react';
import AdminService from "../../services/admin.service";

const Users = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status'); // 'approved' or 'pending'

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await AdminService.getAllUsers();
                console.log("Fetched users data:", data); // Debug log
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error("Users data is not an array:", data);
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const isActive = newStatus === 'Active';
            // Optimistic update
            setUsers(users.map(user => user.id === id ? { ...user, active: isActive } : user));

            // Real backend call
            await AdminService.updateUserStatus(id, isActive);
        } catch (error) {
            console.error("Error updating user status:", error);
            // Revert on error
            const data = await AdminService.getAllUsers();
            if (Array.isArray(data)) setUsers(data);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getRoleDisplay = (user) => {
        if (!user.roles || user.roles.length === 0) return 'PG_USER';
        const role = user.roles[0].name;
        return role.replace('ROLE_', '');
    };

    const getRoleColor = (role) => {
        const roleUpper = role.toUpperCase();
        if (roleUpper.includes('ADMIN')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (roleUpper.includes('OWNER')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        // Apply status filter if present
        if (statusFilter === 'approved' && !user.active) return false;
        if (statusFilter === 'pending' && user.active) return false;

        return (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    }) : [];

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading Users...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Platform Users</h2>

                <div className="flex space-x-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
                            <th className="px-6 py-4 font-semibold">User Details</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Joined</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/ admin / users / ${user.id} `)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mr-3 text-sm font-bold shadow-sm">
                                                {user.username ? user.username.substring(0, 2).toUpperCase() : user.fullName ? user.fullName.substring(0, 2).toUpperCase() : '??'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.fullName || user.username || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">@{user.username || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center">
                                            <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px - 3 py - 1 rounded - full text - xs font - medium border ${getRoleColor(getRoleDisplay(user))} `}>
                                            {getRoleDisplay(user)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px - 3 py - 1 rounded - full text - xs font - medium border ${user.active
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : "bg-red-100 text-red-600 border-red-200"
                                            } `}>
                                            {user.active ? "Active" : "Blocked"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View">
                                                <Eye size={18} />
                                            </button>

                                            {user.active ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(user.id, 'Blocked'); }}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                    title="Block User"
                                                >
                                                    <ShieldBan size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(user.id, 'Active'); }}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                    title="Unblock User"
                                                >
                                                    <ShieldCheck size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                <span>Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</span>
                <div className="text-xs text-gray-400">
                    Active: {filteredUsers.filter(u => u.active).length} | Blocked: {filteredUsers.filter(u => !u.active).length}
                </div>
            </div>
        </div>
    );
};

export default Users;
