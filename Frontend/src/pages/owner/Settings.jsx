import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Eye } from 'lucide-react';
import OwnerService from '../../services/owner.service';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({
        newIssue: true,
        newReview: true,
        newBooking: true,
        dailySummary: false,
        weeklyReport: false,
        urgentIssues: true,
        lowOccupancy: true,
        newResident: false,
        residentLeaving: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await OwnerService.getOwnerProfile();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        setProfile({
            fullName: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '+91 9876543210',
            altPhone: '+91 9123456789',
            companyName: 'Kumar Properties',
            gstNumber: '29ABCDE1234F1Z5',
            pan: 'ABCDE1234F'
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await OwnerService.updateOwnerProfile(profile);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'visibility', label: 'PG Visibility', icon: Eye }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and preferences</p>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 rounded-t-xl">
                <nav className="flex space-x-8 px-6">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon size={18} className="mr-2" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alternate Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.altPhone}
                                        onChange={(e) => setProfile({ ...profile, altPhone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.companyName}
                                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GST Number
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.gstNumber}
                                        onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PAN
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.pan}
                                        onChange={(e) => setProfile({ ...profile, pan: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">New Issue Raised</p>
                                        <p className="text-sm text-gray-500">Get notified when a new issue is reported</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.newIssue}
                                        onChange={(e) => setSettings({ ...settings, newIssue: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">New Review Received</p>
                                        <p className="text-sm text-gray-500">Get notified when someone reviews your PG</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.newReview}
                                        onChange={(e) => setSettings({ ...settings, newReview: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">New Booking</p>
                                        <p className="text-sm text-gray-500">Get notified about new bookings</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.newBooking}
                                        onChange={(e) => setSettings({ ...settings, newBooking: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Daily Summary</p>
                                        <p className="text-sm text-gray-500">Receive a daily summary of all activities</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.dailySummary}
                                        onChange={(e) => setSettings({ ...settings, dailySummary: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Push Notifications</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Urgent Issues</p>
                                        <p className="text-sm text-gray-500">Get instant alerts for high-priority issues</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.urgentIssues}
                                        onChange={(e) => setSettings({ ...settings, urgentIssues: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Low Occupancy Alerts</p>
                                        <p className="text-sm text-gray-500">Alert when occupancy drops below 60%</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.lowOccupancy}
                                        onChange={(e) => setSettings({ ...settings, lowOccupancy: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                </label>
                            </div>
                        </div>

                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                            Save Preferences
                        </button>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                    Update Password
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
                            <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                Enable 2FA
                            </button>
                        </div>
                    </div>
                )}

                {/* PG Visibility Tab */}
                {activeTab === 'visibility' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">PG Visibility Control</h3>
                        <p className="text-gray-600 mb-6">Control which PGs are visible to users on the platform</p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Sunshine PG</p>
                                    <p className="text-sm text-gray-500">Koramangala, Bangalore</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    ✅ Active - Visible to users
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Moonlight PG</p>
                                    <p className="text-sm text-gray-500">HSR Layout, Bangalore</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    ✅ Active - Visible to users
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">StarLight PG</p>
                                    <p className="text-sm text-gray-500">Indiranagar, Bangalore</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                    🔄 Maintenance - Hidden from search
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
