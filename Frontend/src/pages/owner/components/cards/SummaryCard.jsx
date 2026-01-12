import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    color = 'indigo'
}) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        amber: 'bg-amber-50 text-amber-600 border-amber-200'
    };

    const changeColorClasses = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-600'
    };

    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border-2 ${colorClasses[color]} hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>

                    {change && (
                        <div className={`flex items-center mt-2 text-sm font-medium ${changeColorClasses[changeType]}`}>
                            {changeType === 'positive' && <TrendingUp size={16} className="mr-1" />}
                            {changeType === 'negative' && <TrendingDown size={16} className="mr-1" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryCard;
