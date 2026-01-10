import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        // Check if user has PG_OWNER role
        if (!user || (!user.roles.includes("ROLE_PG_OWNER") && !user.roles.includes("ROLE_ADMIN"))) {
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
            <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    Namma PG - Owner Portal
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                        Owner: <span className="font-semibold text-gray-900">{currentUser?.username}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors border border-purple-200"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                        <h3 className="text-purple-900 font-semibold mb-2">Total Tenants</h3>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                        <h3 className="text-purple-900 font-semibold mb-2">Occupied Beds</h3>
                        <p className="text-3xl font-bold text-gray-900">0 / 0</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                        <h3 className="text-purple-900 font-semibold mb-2">Pending Requests</h3>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Your PG</h2>
                    <p className="text-gray-600 mb-8">
                        Add new buildings, manage rooms, and track tenant payments all in one place.
                    </p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">
                        + Add New PG Building
                    </button>
                </div>
            </main>
        </div>
    );
};

export default OwnerDashboard;
