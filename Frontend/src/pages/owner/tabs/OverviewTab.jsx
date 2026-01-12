import React from 'react';
import { Bed, Home, DollarSign, Users, Check, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OverviewTab = ({ pg }) => {
    const occupancyData = [
        { month: 'Aug', occupancy: 75 },
        { month: 'Sep', occupancy: 78 },
        { month: 'Oct', occupancy: 82 },
        { month: 'Nov', occupancy: 85 },
        { month: 'Dec', occupancy: 90 },
        { month: 'Jan', occupancy: 93 }
    ];

    const vacantBeds = pg.totalBeds - pg.occupiedBeds;
    const occupancyRate = Math.round((pg.occupiedBeds / pg.totalBeds) * 100);

    return (
        <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Beds</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{pg.totalBeds}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-full">
                            <Bed className="text-indigo-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Occupied</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-2">{pg.occupiedBeds}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Vacant</p>
                            <h3 className="text-3xl font-bold text-amber-600 mt-2">{vacantBeds}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-full">
                            <Bed className="text-amber-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Revenue</p>
                            <h3 className="text-3xl font-bold text-blue-600 mt-2">₹{(pg.revenue / 1000).toFixed(0)}K</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New (30d)</p>
                            <h3 className="text-3xl font-bold text-purple-600 mt-2">{pg.newResidents30d}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <Users className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Single Sharing</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{pg.singleRooms} rooms</p>
                                <p className="text-sm text-gray-500">{pg.singleRooms * 1} beds</p>
                            </div>
                            <Home className="text-gray-400" size={32} />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Double Sharing</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{pg.doubleRooms} rooms</p>
                                <p className="text-sm text-gray-500">{pg.doubleRooms * 2} beds</p>
                            </div>
                            <Home className="text-gray-400" size={32} />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Triple Sharing</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{pg.tripleRooms} rooms</p>
                                <p className="text-sm text-gray-500">{pg.tripleRooms * 3} beds</p>
                            </div>
                            <Home className="text-gray-400" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Facilities */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Facilities</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['Food', 'Wi-Fi', 'Laundry', 'Parking', 'AC', 'Gym'].map(facility => {
                            const isAvailable = pg.facilities.includes(facility);
                            return (
                                <div
                                    key={facility}
                                    className={`flex items-center p-3 rounded-lg ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                                        }`}
                                >
                                    {isAvailable ? (
                                        <Check size={18} className="mr-2" />
                                    ) : (
                                        <X size={18} className="mr-2" />
                                    )}
                                    <span className="font-medium">{facility}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Occupancy Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Occupancy Trend (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={occupancyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="occupancy"
                                stroke="#4F46E5"
                                fill="#C7D2FE"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
