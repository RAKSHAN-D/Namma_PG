import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Award, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OwnerService from '../../services/owner.service';

const Analytics = () => {
    const [pgs, setPGs] = useState([]);
    const [insights, setInsights] = useState(null);
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [pgsData, insightsData] = await Promise.all([
                OwnerService.getPGComparison(period),
                OwnerService.getInsights()
            ]);
            setPGs(pgsData);
            setInsights(insightsData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        setPGs([
            {
                pgId: 1,
                pgName: 'Sunshine PG',
                occupancy: 93,
                occupancyChange: 5,
                rating: 4.5,
                issuesCount: 3,
                revenue: 84000,
                growth: 5
            },
            {
                pgId: 2,
                pgName: 'Moonlight PG',
                occupancy: 75,
                occupancyChange: -5,
                rating: 4.0,
                issuesCount: 0,
                revenue: 60000,
                growth: 2
            },
            {
                pgId: 3,
                pgName: 'StarLight PG',
                occupancy: 88,
                occupancyChange: 3,
                rating: 4.3,
                issuesCount: 1,
                revenue: 66000,
                growth: 3
            }
        ]);

        setInsights({
            bestPerformer: {
                pgName: 'Sunshine PG',
                occupancy: 93,
                rating: 4.5
            },
            needsAttention: {
                pgName: 'Moonlight PG',
                occupancy: 75,
                change: -5
            },
            highComplaints: {
                pgName: 'Sunshine PG',
                issuesCount: 3,
                details: 'water and Wi-Fi issues'
            },
            highestGrowth: {
                pgName: 'Sunshine PG',
                newResidents: 5
            },
            ratingDrop: {
                pgName: 'StarLight PG',
                oldRating: 4.5,
                newRating: 4.3,
                change: -0.2
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
                    <p className="text-gray-500 mt-1">Compare PG performance and get insights</p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                </select>
            </div>

            {/* PG Comparison Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">PG Comparison</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    PG Name
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
                                    Revenue
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Growth (30d)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pgs.map(pg => (
                                <tr
                                    key={pg.pgId}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/owner/pgs/${pg.pgId}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{pg.pgName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-900">{pg.occupancy}%</span>
                                            <span className={`ml-2 flex items-center text-sm ${pg.occupancyChange > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {pg.occupancyChange > 0 ? (
                                                    <TrendingUp size={14} className="mr-1" />
                                                ) : (
                                                    <TrendingDown size={14} className="mr-1" />
                                                )}
                                                {Math.abs(pg.occupancyChange)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">⭐</span>
                                            <span className="font-semibold text-gray-900">{pg.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${pg.issuesCount === 0
                                            ? 'bg-green-100 text-green-800'
                                            : pg.issuesCount <= 2
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {pg.issuesCount} Issues
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-gray-900">₹{(pg.revenue / 1000).toFixed(0)}K</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-green-600">+{pg.growth}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Key Insights</h2>
                <div className="space-y-4">
                    {/* Best Performer */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start">
                            <div className="p-2 bg-green-500 rounded-lg mr-4">
                                <Award className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 mb-1">🏆 Best Performer</h3>
                                <p className="text-green-700">
                                    <span className="font-semibold">{insights.bestPerformer.pgName}</span> ({insights.bestPerformer.occupancy}% occupancy, {insights.bestPerformer.rating} rating)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Needs Attention */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                            <div className="p-2 bg-yellow-500 rounded-lg mr-4">
                                <AlertCircle className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-900 mb-1">⚠️ Needs Attention</h3>
                                <p className="text-yellow-700">
                                    <span className="font-semibold">{insights.needsAttention.pgName}</span> (Low occupancy: {insights.needsAttention.occupancy}%, {insights.needsAttention.change}% from last month)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* High Complaints */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                            <div className="p-2 bg-red-500 rounded-lg mr-4">
                                <AlertCircle className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-900 mb-1">🚨 High Complaints</h3>
                                <p className="text-red-700">
                                    <span className="font-semibold">{insights.highComplaints.pgName}</span> ({insights.highComplaints.issuesCount} open issues - {insights.highComplaints.details})
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Highest Growth */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                            <div className="p-2 bg-blue-500 rounded-lg mr-4">
                                <TrendingUp className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 mb-1">📈 Highest Growth</h3>
                                <p className="text-blue-700">
                                    <span className="font-semibold">{insights.highestGrowth.pgName}</span> (+{insights.highestGrowth.newResidents} new residents this month)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rating Drop */}
                    {insights.ratingDrop && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start">
                                <div className="p-2 bg-orange-500 rounded-lg mr-4">
                                    <TrendingDown className="text-white" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-orange-900 mb-1">📉 Rating Drop</h3>
                                    <p className="text-orange-700">
                                        <span className="font-semibold">{insights.ratingDrop.pgName}</span> ({insights.ratingDrop.oldRating} → {insights.ratingDrop.newRating}, {insights.ratingDrop.change} from last month)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
