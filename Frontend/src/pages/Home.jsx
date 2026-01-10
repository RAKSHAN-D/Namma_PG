import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate("/login");
        } else {
            setCurrentUser(user);
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Namma PG
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                        Hello, <span className="font-semibold text-gray-900">{currentUser?.username}</span>
                    </span>
                    <button
                        onClick={() => {
                            AuthService.logout();
                            navigate("/login");
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Namma PG Dashboard</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Find the best Paying Guest accommodations in your city with premium amenities and comfort.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                        <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 transform hover:-translate-y-1 transition-transform">
                            <h3 className="text-xl font-bold text-indigo-900 mb-2">Search PGs</h3>
                            <p className="text-indigo-700">Explore verified listings with detailed reviews.</p>
                        </div>
                        <div className="p-6 bg-purple-50 rounded-xl border border-purple-100 transform hover:-translate-y-1 transition-transform">
                            <h3 className="text-xl font-bold text-purple-900 mb-2">Book Online</h3>
                            <p className="text-purple-700">Seamless booking experience with secure payments.</p>
                        </div>
                        <div className="p-6 bg-pink-50 rounded-xl border border-pink-100 transform hover:-translate-y-1 transition-transform">
                            <h3 className="text-xl font-bold text-pink-900 mb-2">Manage Stay</h3>
                            <p className="text-pink-700">Pay rent, raise issues, and manage profile easily.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
