import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user || !user.roles.includes("ROLE_PG_USER")) {
            navigate("/login");
        } else {
            setCurrentUser(user);
        }
    }, [navigate]);

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Namma PG - User Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                        Welcome, <span className="font-semibold text-gray-900">{currentUser?.username}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors border border-indigo-200"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Stay</h2>
                    <p className="text-gray-600 mb-8">
                        Browse through our verified PG listings and find a place that feels like home.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder for PG listings */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">PG Image</div>
                            <h3 className="font-bold text-lg text-gray-900">Sunrise PG</h3>
                            <p className="text-sm text-gray-500 mb-2">Indiranagar, Bangalore</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-indigo-600 font-bold">₹8,000/mo</span>
                                <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">View Details</button>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">PG Image</div>
                            <h3 className="font-bold text-lg text-gray-900">Green View Luxury PG</h3>
                            <p className="text-sm text-gray-500 mb-2">Koramangala, Bangalore</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-indigo-600 font-bold">₹12,000/mo</span>
                                <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
