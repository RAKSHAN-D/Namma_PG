import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import OwnerService from '../../../services/owner.service';

const ReviewsTab = ({ pgId, rating, reviewCount }) => {
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('recent');
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [pgId, sortBy]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await OwnerService.getPGReviews(pgId, { sort: sortBy, limit: 10 });
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        setReviews([
            {
                id: 1,
                overallRating: 5,
                cleanlinessRating: 5,
                foodRating: 4,
                safetyRating: 5,
                maintenanceRating: 4,
                valueRating: 5,
                reviewText: 'Excellent PG with all facilities. Food is great and the location is perfect for working professionals.',
                reviewerName: 'Amit K.',
                createdAt: '2024-01-10',
                ownerReply: null
            },
            {
                id: 2,
                overallRating: 4,
                reviewText: 'Good place but Wi-Fi could be faster. Overall satisfied with the facilities.',
                reviewerName: 'Ravi S.',
                createdAt: '2024-01-08',
                ownerReply: "We're upgrading the Wi-Fi this week. Thank you for your feedback!"
            },
            {
                id: 3,
                overallRating: 5,
                reviewText: 'Best PG in the area! Clean rooms, good food, and friendly staff.',
                reviewerName: 'Priya M.',
                createdAt: '2024-01-05',
                ownerReply: 'Thank you so much! We appreciate your kind words.'
            },
            {
                id: 4,
                overallRating: 3,
                reviewText: 'Decent place but food variety could be improved.',
                reviewerName: 'Anonymous',
                createdAt: '2024-01-03',
                ownerReply: null
            }
        ]);
    };

    const handleReply = async (reviewId) => {
        try {
            await OwnerService.replyToReview(reviewId, replyText);
            setReplyingTo(null);
            setReplyText('');
            fetchReviews(); // Refresh
        } catch (error) {
            console.error('Error replying to review:', error);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
            />
        ));
    };

    const ratingDistribution = [
        { stars: 5, count: 75, percentage: 60 },
        { stars: 4, count: 30, percentage: 24 },
        { stars: 3, count: 12, percentage: 10 },
        { stars: 2, count: 5, percentage: 4 },
        { stars: 1, count: 3, percentage: 2 }
    ];

    if (loading) {
        return <div className="text-center py-12">Loading reviews...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Overall Rating */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Overall Rating: {rating} ⭐</h3>
                        <p className="text-gray-500 mt-1">{reviewCount} reviews</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Ratings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Ratings</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Cleanliness</span>
                                <span className="font-semibold text-gray-900">4.6 ⭐</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Food Quality</span>
                                <span className="font-semibold text-gray-900">4.3 ⭐</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '86%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Safety</span>
                                <span className="font-semibold text-gray-900">4.7 ⭐</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Maintenance</span>
                                <span className="font-semibold text-gray-900">4.2 ⭐</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Value for Money</span>
                                <span className="font-semibold text-gray-900">4.5 ⭐</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
                    <div className="space-y-2">
                        {ratingDistribution.map(item => (
                            <div key={item.stars} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-12">{item.stars} ⭐</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-yellow-500 h-4 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-20">
                                    {item.count} ({item.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Reviews</h3>

                {reviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(review.overallRating)}
                                    <span className="font-semibold text-gray-900">{review.overallRating}.0</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    by {review.reviewerName} • {review.createdAt}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.reviewText}</p>

                        {review.ownerReply && (
                            <div className="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="flex items-start">
                                    <MessageSquare size={18} className="text-indigo-600 mt-0.5 mr-2" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-indigo-900 mb-1">Owner's Reply:</p>
                                        <p className="text-sm text-indigo-700">{review.ownerReply}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!review.ownerReply && replyingTo !== review.id && (
                            <button
                                onClick={() => setReplyingTo(review.id)}
                                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mt-3"
                            >
                                <MessageSquare size={16} className="mr-2" />
                                Reply
                            </button>
                        )}

                        {replyingTo === review.id && (
                            <div className="mt-3">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your reply..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReply(review.id)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                    >
                                        Send Reply
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setReplyText('');
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Star className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No reviews yet</p>
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;
