import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, ShieldBan, ShieldCheck, Mail, Search } from 'lucide-react';
import AdminService from "../../services/admin.service";

const Owners = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status'); // 'approved' or 'pending'

    const [owners, setOwners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const data = await AdminService.getAllOwners();
                setOwners(data);
            } catch (error) {
                console.error("Error fetching owners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOwners();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const isActive = newStatus === 'Active';
            // Optimistic update
            setOwners(owners.map(owner => owner.id === id ? { ...owner, active: isActive } : owner));

            // Real backend call
            await AdminService.updateUserStatus(id, isActive);
        } catch (error) {
            console.error("Error updating owner status:", error);
            // Revert on error
            const data = await AdminService.getAllOwners();
            setOwners(data);
        }
    };

    const filteredOwners = owners.filter(owner => {
        // Apply status filter if present
        if (statusFilter === 'approved' && !owner.active) return false;
        if (statusFilter === 'pending' && owner.active) return false;

        return owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading Owners...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">PG Owners Management</h2>
                {/* Search Bar */}
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
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredOwners.length > 0 ? (
                            filteredOwners.map((owner) => (
                                <tr
                                    key={owner.id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/admin/owners/${owner.id}`)}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">{owner.fullName}</td>
                                    <td className="px-6 py-4 text-gray-600 flex items-center">
                                        <Mail size={14} className="mr-2 text-gray-400" /> {owner.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${owner.active
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-600 border-red-200"
                                            }`}>
                                            {owner.active ? "Active" : "Blocked"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View Profile">
                                                <Eye size={18} />
                                            </button>

                                            {owner.active ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(owner.id, 'Blocked'); }}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                    title="Block Owner"
                                                >
                                                    <ShieldBan size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(owner.id, 'Active'); }}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                    title="Unblock Owner"
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
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    No Owners found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Owners;
