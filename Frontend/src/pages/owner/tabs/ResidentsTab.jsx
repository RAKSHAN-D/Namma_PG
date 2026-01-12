import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Phone, Mail } from 'lucide-react';
import OwnerService from '../../../services/owner.service';

const ResidentsTab = ({ pgId }) => {
    const [residents, setResidents] = useState([]);
    const [filteredResidents, setFilteredResidents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResidents();
    }, [pgId]);

    useEffect(() => {
        applyFilters();
    }, [residents, searchQuery, filterType]);

    const fetchResidents = async () => {
        try {
            setLoading(true);
            const data = await OwnerService.getPGResidents(pgId);
            setResidents(data);
        } catch (error) {
            console.error('Error fetching residents:', error);
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        setResidents([
            {
                id: 1,
                fullName: 'Amit Kumar',
                email: 'amit@example.com',
                phone: '9876543210',
                roomNumber: 5,
                bedNumber: 1,
                joinDate: '2024-01-01',
                status: 'Active',
                daysStayed: 15
            },
            {
                id: 2,
                fullName: 'Ravi Shah',
                email: 'ravi@example.com',
                phone: '9123456789',
                roomNumber: 5,
                bedNumber: 2,
                joinDate: '2023-12-15',
                status: 'Active',
                daysStayed: 31
            },
            {
                id: 3,
                fullName: 'Priya Sharma',
                email: 'priya@example.com',
                phone: '9876512345',
                roomNumber: 12,
                bedNumber: 1,
                joinDate: '2023-12-25',
                status: 'Active',
                daysStayed: 21
            },
            {
                id: 4,
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '9123498765',
                roomNumber: 8,
                bedNumber: 1,
                joinDate: '2023-11-01',
                status: 'Leaving',
                daysStayed: 75
            }
        ]);
    };

    const applyFilters = () => {
        let filtered = [...residents];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(r =>
                r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.roomNumber.toString().includes(searchQuery)
            );
        }

        // Type filter
        if (filterType === 'new') {
            filtered = filtered.filter(r => r.daysStayed <= 30);
        } else if (filterType === 'leaving') {
            filtered = filtered.filter(r => r.status === 'Leaving');
        }

        setFilteredResidents(filtered);
    };

    const activeResidents = residents.filter(r => r.status === 'Active').length;
    const newResidents = residents.filter(r => r.daysStayed <= 30).length;
    const leavingResidents = residents.filter(r => r.status === 'Leaving').length;

    if (loading) {
        return <div className="text-center py-12">Loading residents...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">{activeResidents}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <h3 className="text-3xl font-bold text-yellow-600 mt-2">2</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">New (30d)</p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-2">{newResidents}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">Leaving</p>
                    <h3 className="text-3xl font-bold text-red-600 mt-2">{leavingResidents}</h3>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or room number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Residents</option>
                            <option value="new">New (joined in last 30 days)</option>
                            <option value="leaving">Leaving Soon</option>
                        </select>

                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <UserPlus size={18} className="mr-2" />
                            Add Resident
                        </button>
                    </div>
                </div>
            </div>

            {/* Residents Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Room & Bed
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResidents.map(resident => (
                            <tr key={resident.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{resident.fullName}</div>
                                    <div className="text-sm text-gray-500">{resident.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">Room {resident.roomNumber}</div>
                                    <div className="text-sm text-gray-500">Bed {resident.bedNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{resident.joinDate}</div>
                                    <div className="text-sm text-gray-500">({resident.daysStayed} days ago)</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900 mb-1">
                                        <Phone size={14} className="mr-2 text-gray-400" />
                                        {resident.phone}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Mail size={14} className="mr-2 text-gray-400" />
                                        {resident.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${resident.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : resident.status === 'Leaving'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {resident.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Joinings</h3>
                    <div className="space-y-3">
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-gray-700">Amit Kumar joined Room 5</span>
                            <span className="ml-auto text-gray-500">15 days ago</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-gray-700">Priya Sharma joined Room 12</span>
                            <span className="ml-auto text-gray-500">21 days ago</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Departures</h3>
                    <div className="space-y-3">
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            <span className="text-gray-700">John Doe (Room 8)</span>
                            <span className="ml-auto text-gray-500">Checkout in 5 days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentsTab;
