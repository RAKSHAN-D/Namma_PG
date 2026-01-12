import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Edit, Settings as SettingsIcon, Star } from 'lucide-react';
import OwnerService from '../../services/owner.service';
import OverviewTab from './tabs/OverviewTab';
import ResidentsTab from './tabs/ResidentsTab';
import IssuesTab from './tabs/IssuesTab';
import ReviewsTab from './tabs/ReviewsTab';

const PGDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pg, setPG] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPGDetails();
    }, [id]);

    const fetchPGDetails = async () => {
        try {
            setLoading(true);
            const data = await OwnerService.getPGById(id);
            setPG(data);
        } catch (error) {
            console.error('Error fetching PG details:', error);
            // Use mock data
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        setPG({
            id: parseInt(id),
            name: 'Sunshine PG',
            area: 'Koramangala',
            city: 'Bangalore',
            fullAddress: '#42, 1st Cross, Koramangala 5th Block, Bangalore - 560095',
            pgType: 'Boys',
            status: 'Active',
            totalBeds: 30,
            occupiedBeds: 28,
            rating: 4.5,
            reviewCount: 125,
            updatedAt: '2 days ago',
            singleRooms: 5,
            doubleRooms: 8,
            tripleRooms: 2,
            facilities: ['Food', 'Wi-Fi', 'Laundry', 'Parking', 'AC'],
            revenue: 84000,
            newResidents30d: 5
        });
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'residents', label: 'Residents' },
        { id: 'issues', label: 'Issues' },
        { id: 'reviews', label: 'Reviews' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading PG Details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <button
                        onClick={() => navigate('/owner/pgs')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to My PGs
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">🏢 {pg.name}</h1>
                            <div className="flex items-center text-gray-600 mt-2">
                                <MapPin size={18} className="mr-2" />
                                <span>{pg.fullAddress}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                                    {pg.pgType} PG
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                    {pg.status}
                                </span>
                                <span className="text-gray-500">
                                    Last updated: {pg.updatedAt}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-right mr-4">
                                <div className="flex items-center">
                                    <Star className="text-yellow-500 fill-yellow-500 mr-1" size={20} />
                                    <span className="text-2xl font-bold text-gray-900">{pg.rating}</span>
                                </div>
                                <p className="text-sm text-gray-500">{pg.reviewCount} reviews</p>
                            </div>
                            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Edit size={18} className="mr-2" />
                                Edit PG
                            </button>
                            <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <SettingsIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && <OverviewTab pg={pg} />}
                {activeTab === 'residents' && <ResidentsTab pgId={pg.id} />}
                {activeTab === 'issues' && <IssuesTab pgId={pg.id} />}
                {activeTab === 'reviews' && <ReviewsTab pgId={pg.id} rating={pg.rating} reviewCount={pg.reviewCount} />}
            </div>
        </div>
    );
};

export default PGDetail;
