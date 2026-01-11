import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import AdminService from "../../services/admin.service";

const AllPGs = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status'); // 'approved' or 'pending'

    const [pgs, setPgs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const data = await AdminService.getAllPGs();
                setPgs(data);
            } catch (error) {
                console.error("Error fetching PGs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPGs();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const isActive = newStatus === 'Approved';
            // Optimistic update
            setPgs(pgs.map(pg => pg.id === id ? { ...pg, active: isActive } : pg));

            // Real backend call
            await AdminService.updatePgStatus(id, isActive);
        } catch (error) {
            console.error("Error updating PG status:", error);
            // Revert on error (optional, but good practice)
            // await fetchPGs();
        }
    };

    const getStatusBadge = (active) => {
        if (active) return "bg-green-100 text-green-700 border-green-200";
        return "bg-yellow-100 text-yellow-700 border-yellow-200"; // Assuming !active means Pending/Blocked for now
    };

    const filteredPgs = pgs.filter(pg => {
        // Apply status filter if present
        if (statusFilter === 'approved' && !pg.active) return false;
        if (statusFilter === 'pending' && pg.active) return false;

        // Apply search filter
        return pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pg.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pg.area.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading PGs...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">All PG Listings</h2>

                <div className="flex space-x-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search PG by name, city..."
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
                            <th className="px-6 py-4 font-semibold">PG Details</th>
                            <th className="px-6 py-4 font-semibold">Owner</th>
                            <th className="px-6 py-4 font-semibold">Location</th>
                            <th className="px-6 py-4 font-semibold">Gender</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {filteredPgs.length > 0 ? (
                            filteredPgs.map((pg) => (
                                <tr
                                    key={pg.id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/admin/pgs/${pg.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{pg.name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{pg.totalRooms} Rooms</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {pg.ownerName || 'Unknown'}
                                        <div className="text-xs text-gray-400">{pg.ownerEmail || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {pg.area}, {pg.city}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${pg.gender === 'BOYS' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                            {pg.gender}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(pg.active)}`}>
                                            {pg.active ? "Approved" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View">
                                                <Eye size={18} />
                                            </button>

                                            {!pg.active ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(pg.id, 'Approved'); }}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(pg.id, 'Blocked'); }}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                    title="Block"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    No PGs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination (Simple) */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                <span>Showing {filteredPgs.length} entries</span>
            </div>
        </div>
    );
};

export default AllPGs;
