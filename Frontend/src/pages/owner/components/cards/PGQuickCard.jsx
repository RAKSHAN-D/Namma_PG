import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, AlertCircle, Users, ArrowRight } from 'lucide-react';

const PGQuickCard = ({
    pgId,
    pgName,
    location,
    occupiedBeds,
    totalBeds,
    occupancyRate,
    rating,
    issuesCount,
    urgentIssuesCount = 0,
    newResidents30d
}) => {
    const navigate = useNavigate();

    const getIssueColor = () => {
        if (urgentIssuesCount > 0) return 'text-red-600';
        if (issuesCount > 0) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getOccupancyColor = () => {
        if (occupancyRate >= 90) return 'bg-green-500';
        if (occupancyRate >= 70) return 'bg-blue-500';
        if (occupancyRate >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
            onClick={() => navigate(`/owner/pgs/${pgId}`)}
        >
            {/* PG Name and Location */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{pgName}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin size={14} className="mr-1" />
                    <span>{location}</span>
                </div>
            </div>

            {/* Occupancy */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Occupancy</span>
                    <span className="font-semibold text-gray-900">
                        {occupiedBeds}/{totalBeds} ({occupancyRate}%)
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`${getOccupancyColor()} h-2 rounded-full transition-all`}
                        style={{ width: `${occupancyRate}%` }}
                    ></div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-sm mb-4">
                {/* Rating */}
                <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                </div>

                {/* Issues */}
                <div className={`flex items-center ${getIssueColor()}`}>
                    <AlertCircle size={16} className="mr-1" />
                    <span className="font-semibold">
                        {issuesCount} Issue{issuesCount !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* New Residents */}
                <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-1" />
                    <span className="font-semibold">+{newResidents30d} New</span>
                </div>
            </div>

            {/* View Details Button */}
            <button className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm">
                View Details
                <ArrowRight size={16} className="ml-2" />
            </button>
        </div>
    );
};

export default PGQuickCard;
