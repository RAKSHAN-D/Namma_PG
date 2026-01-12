import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Grid, List, Plus } from 'lucide-react';
import PGQuickCard from './components/cards/PGQuickCard';
import OwnerService from '../../services/owner.service';

const MyPGs = () => {
    const [pgs, setPgs] = useState([]);
    const [filteredPGs, setFilteredPGs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Check for status filter from URL
        const statusFilter = searchParams.get('status');
        if (statusFilter) {
            setFilterStatus(statusFilter);
        }
        fetchPGs();
    }, [searchParams]);

    useEffect(() => {
        applyFilters();
    }, [pgs, searchQuery, filterStatus]);

    const fetchPGs = async () => {
        try {
            setLoading(true);
            const data = await OwnerService.getAllPGs();
            setPgs(data);
        } catch (error) {
            console.error('Error fetching PGs:', error);
            // Use mock data
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        setPgs([
            {
                id: 1,
                name: 'Sunshine PG',
                area: 'Koramangala',
                city: 'Bangalore',
                occupiedBeds: 28,
                totalBeds: 30,
                occupancyRate: 93,
                rating: 4.5,
                issuesCount: 3,
                urgentIssuesCount: 2,
                newResidents30d: 5,
                pgType: 'Boys',
                status: 'Active'
            },
            {
                id: 2,
                name: 'Moonlight PG',
                area: 'HSR Layout',
                city: 'Bangalore',
                occupiedBeds: 15,
                totalBeds: 20,
                occupancyRate: 75,
                rating: 4.0,
                issuesCount: 0,
                urgentIssuesCount: 0,
                newResidents30d: 2,
                pgType: 'Girls',
                status: 'Active'
            },
            {
                id: 3,
                name: 'StarLight PG',
                area: 'Indiranagar',
                city: 'Bangalore',
                occupiedBeds: 22,
                totalBeds: 25,
                occupancyRate: 88,
                rating: 4.3,
                issuesCount: 1,
                urgentIssuesCount: 0,
                newResidents30d: 3,
                pgType: 'Boys',
                status: 'Active'
            },
            {
                id: 4,
                name: 'Green Valley PG',
                area: 'Whitefield',
                city: 'Bangalore',
                occupiedBeds: 12,
                totalBeds: 25,
                occupancyRate: 48,
                rating: 3.8,
                issuesCount: 5,
                urgentIssuesCount: 1,
                newResidents30d: 1,
                pgType: 'Co-living',
                status: 'Active'
            },
            {
                id: 5,
                name: 'Blue Sky PG',
                area: 'Electronic City',
                city: 'Bangalore',
                occupiedBeds: 18,
                totalBeds: 20,
                occupancyRate: 90,
                rating: 4.6,
                issuesCount: 0,
                urgentIssuesCount: 0,
                newResidents30d: 4,
                pgType: 'Girls',
                status: 'Active'
            }
        ]);
    };

    const applyFilters = () => {
        let filtered = [...pgs];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(pg =>
                pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pg.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pg.city.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus === 'high-occupancy') {
            filtered = filtered.filter(pg => pg.occupancyRate >= 80);
        } else if (filterStatus === 'low-occupancy') {
            filtered = filtered.filter(pg => pg.occupancyRate < 60);
        } else if (filterStatus === 'has-issues') {
            filtered = filtered.filter(pg => pg.issuesCount > 0);
        } else if (filterStatus === 'low-rated') {
            filtered = filtered.filter(pg => pg.rating < 4.0);
        }

        setFilteredPGs(filtered);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading PGs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My PGs</h1>
                    <p className="text-gray-500 mt-1">Manage all your properties in one place</p>
                </div>
                <button
                    onClick={() => navigate('/owner/pgs/add')}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add New PG
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All PGs</option>
                            <option value="high-occupancy">High Occupancy (&gt;80%)</option>
                            <option value="low-occupancy">Low Occupancy (&lt;60%)</option>
                            <option value="has-issues">Has Issues</option>
                            <option value="low-rated">Low Rated (&lt;4.0)</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
                Showing {filteredPGs.length} of {pgs.length} PGs
            </div>

            {/* PGs Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPGs.map(pg => (
                        <PGQuickCard
                            key={pg.id}
                            pgId={pg.id}
                            pgName={pg.name}
                            location={`${pg.area}, ${pg.city}`}
                            occupiedBeds={pg.occupiedBeds}
                            totalBeds={pg.totalBeds}
                            occupancyRate={pg.occupancyRate}
                            rating={pg.rating}
                            issuesCount={pg.issuesCount}
                            urgentIssuesCount={pg.urgentIssuesCount}
                            newResidents30d={pg.newResidents30d}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    PG Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Occupancy
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Issues
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPGs.map(pg => (
                                <tr key={pg.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{pg.name}</div>
                                        <div className="text-sm text-gray-500">{pg.pgType} PG</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {pg.area}, {pg.city}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{pg.occupiedBeds}/{pg.totalBeds}</div>
                                        <div className="text-sm text-gray-500">{pg.occupancyRate}%</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="ml-1 text-sm font-medium text-gray-900">{pg.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${pg.urgentIssuesCount > 0
                                                ? 'bg-red-100 text-red-800'
                                                : pg.issuesCount > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                            {pg.issuesCount === 0 ? 'No Issues' : `${pg.issuesCount} Issue${pg.issuesCount > 1 ? 's' : ''}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => navigate(`/owner/pgs/${pg.id}`)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium mr-3"
                                        >
                                            View
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900 font-medium">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredPGs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No PGs found matching your criteria</p>
                </div>
            )}
        </div>
    );
};

export default MyPGs;
