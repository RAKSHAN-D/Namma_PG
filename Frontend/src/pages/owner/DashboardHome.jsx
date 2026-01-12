import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, AlertCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SummaryCard from './components/cards/SummaryCard';
import PGQuickCard from './components/cards/PGQuickCard';
import OwnerService from '../../services/owner.service';

const OwnerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [pgs, setPgs] = useState([]);
    const [graphs, setGraphs] = useState(null);
    const [timePeriod, setTimePeriod] = useState('30d');

    const timePeriodOptions = [
        { value: '30d', label: 'Last 30 Days' },
        { value: '6m', label: 'Last 6 Months' },
        { value: '12m', label: 'Last 12 Months' },
        { value: 'all', label: 'All Time' }
    ];

    useEffect(() => {
        fetchDashboardData();
    }, [timePeriod]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all dashboard data in parallel
            const [summaryData, pgsData, graphsData] = await Promise.all([
                OwnerService.getDashboardSummary(timePeriod),
                OwnerService.getAllPGs(),
                OwnerService.getPerformanceGraphs(timePeriod)
            ]);

            setSummary(summaryData);
            setPgs(pgsData.slice(0, 6)); // Show max 6 PGs on dashboard
            setGraphs(graphsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Use mock data for now
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        // Mock data for development
        setSummary({
            totalPGs: 5,
            totalResidents: 145,
            overallOccupancy: 82,
            activeIssues: 12,
            averageRating: 4.2,
            newResidents30d: 8,
            changes: {
                pgs: '+2',
                residents: '+8',
                occupancy: '+5%',
                issues: '3 urgent',
                rating: '+0.3'
            }
        });

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
                newResidents30d: 5
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
                newResidents30d: 2
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
                newResidents30d: 3
            }
        ]);

        setGraphs({
            residentGrowth: [
                { month: 'Aug', residents: 120 },
                { month: 'Sep', residents: 125 },
                { month: 'Oct', residents: 132 },
                { month: 'Nov', residents: 138 },
                { month: 'Dec', residents: 142 },
                { month: 'Jan', residents: 145 }
            ],
            occupancyTrend: [
                { week: 'Week 1', occupancy: 75 },
                { week: 'Week 2', occupancy: 77 },
                { week: 'Week 3', occupancy: 79 },
                { week: 'Week 4', occupancy: 80 },
                { week: 'Week 5', occupancy: 81 },
                { week: 'Week 6', occupancy: 82 }
            ],
            issuesTrend: [
                { month: 'Aug', raised: 10, resolved: 8 },
                { month: 'Sep', raised: 12, resolved: 10 },
                { month: 'Oct', raised: 8, resolved: 9 },
                { month: 'Nov', raised: 15, resolved: 12 },
                { month: 'Dec', raised: 10, resolved: 11 },
                { month: 'Jan', raised: 12, resolved: 10 }
            ],
            ratingsTrend: [
                { month: 'Aug', rating: 4.0 },
                { month: 'Sep', rating: 4.1 },
                { month: 'Oct', rating: 4.0 },
                { month: 'Nov', rating: 4.2 },
                { month: 'Dec', rating: 4.1 },
                { month: 'Jan', rating: 4.2 }
            ]
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Home</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's your business overview</p>
                </div>
                <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                    {timePeriodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <SummaryCard
                    title="Total PGs"
                    value={summary.totalPGs}
                    change={summary.changes.pgs}
                    changeType="positive"
                    icon={Building2}
                    color="indigo"
                />
                <SummaryCard
                    title="Total Residents"
                    value={summary.totalResidents}
                    change={summary.changes.residents}
                    changeType="positive"
                    icon={Users}
                    color="blue"
                />
                <SummaryCard
                    title="Occupancy Rate"
                    value={`${summary.overallOccupancy}%`}
                    change={summary.changes.occupancy}
                    changeType="positive"
                    icon={TrendingUp}
                    color="green"
                />
                <SummaryCard
                    title="Active Issues"
                    value={summary.activeIssues}
                    change={summary.changes.issues}
                    changeType="negative"
                    icon={AlertCircle}
                    color="amber"
                />
                <SummaryCard
                    title="Avg Rating"
                    value={summary.averageRating.toFixed(1)}
                    change={summary.changes.rating}
                    changeType="positive"
                    icon={Star}
                    color="purple"
                />
            </div>

            {/* Your PGs Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Your PGs</h2>
                    <Link
                        to="/owner/pgs"
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
                    >
                        View All
                        <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pgs.map(pg => (
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
            </div>

            {/* Performance Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resident Growth */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Resident Growth</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={graphs.residentGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="residents"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={{ fill: '#4F46E5', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Occupancy Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Occupancy Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={graphs.occupancyTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="occupancy"
                                stroke="#3B82F6"
                                fill="#93C5FD"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Issues Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Issues Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={graphs.issuesTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="raised" fill="#F59E0B" />
                            <Bar dataKey="resolved" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Ratings Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ratings Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={graphs.ratingsTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="rating"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ fill: '#8B5CF6', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">New review received for Sunshine PG</span>
                        <span className="ml-auto text-gray-500">5 mins ago</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">New issue raised at Moonlight PG</span>
                        <span className="ml-auto text-gray-500">1 hour ago</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">New resident joined StarLight PG</span>
                        <span className="ml-auto text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Issue resolved at Sunshine PG</span>
                        <span className="ml-auto text-gray-500">3 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
