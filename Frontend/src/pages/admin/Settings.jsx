import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Building, Bell, Shield, Wrench } from 'lucide-react';
import AdminService from '../../services/admin.service';

const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await AdminService.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await AdminService.updateSettings(settings);
            setSuccessMessage('Settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl text-gray-500 font-semibold animate-pulse">Loading Settings...</div>
            </div>
        );
    }

    if (!settings) {
        return <div className="p-10 text-center text-red-500">Failed to load settings</div>;
    }

    const Tab = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${activeTab === id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Platform Settings</h1>
                        <p className="text-gray-500 mt-1">Manage platform configuration and preferences</p>
                    </div>
                    {successMessage && (
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200">
                            {successMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 flex-wrap">
                <Tab id="general" label="General" icon={Building} />
                <Tab id="approvals" label="Approvals" icon={Shield} />
                <Tab id="notifications" label="Notifications" icon={Bell} />
                <Tab id="maintenance" label="Maintenance" icon={Wrench} />
            </div>

            {/* Settings Content */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Platform Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                                <input
                                    type="text"
                                    value={settings.platformName || ''}
                                    onChange={(e) => handleChange('platformName', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Email</label>
                                <input
                                    type="email"
                                    value={settings.platformEmail || ''}
                                    onChange={(e) => handleChange('platformEmail', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.supportEmail || ''}
                                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Phone</label>
                                <input
                                    type="tel"
                                    value={settings.platformPhone || ''}
                                    onChange={(e) => handleChange('platformPhone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Approvals Tab */}
                {activeTab === 'approvals' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Auto-Approval Settings</h2>
                        <p className="text-sm text-gray-600 mb-6">Control which entities are automatically approved upon registration/submission</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">Auto-Approve PG Listings</div>
                                    <div className="text-sm text-gray-500">New PG submissions will be approved automatically</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoApprovePgs || false}
                                        onChange={(e) => handleChange('autoApprovePgs', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">Auto-Approve Owners</div>
                                    <div className="text-sm text-gray-500">New owner accounts will be approved automatically</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoApproveOwners || false}
                                        onChange={(e) => handleChange('autoApproveOwners', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">Auto-Approve Users</div>
                                    <div className="text-sm text-gray-500">New user accounts will be approved automatically</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoApproveUsers || false}
                                        onChange={(e) => handleChange('autoApproveUsers', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h2>
                        <p className="text-sm text-gray-600 mb-6">Choose which email notifications you want to receive</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">New PG Listing Submitted</div>
                                    <div className="text-sm text-gray-500">Get notified when a new PG is listed</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifyNewPg || false}
                                        onChange={(e) => handleChange('notifyNewPg', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">New Owner Registration</div>
                                    <div className="text-sm text-gray-500">Get notified when a new owner signs up</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifyNewOwner || false}
                                        onChange={(e) => handleChange('notifyNewOwner', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">High Priority Issues</div>
                                    <div className="text-sm text-gray-500">Get notified when a high priority issue is reported</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifyHighPriorityIssue || false}
                                        onChange={(e) => handleChange('notifyHighPriorityIssue', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">Daily Summary Report</div>
                                    <div className="text-sm text-gray-500">Receive a daily summary of platform activity</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifyDailySummary || false}
                                        onChange={(e) => handleChange('notifyDailySummary', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Maintenance Tab */}
                {activeTab === 'maintenance' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Mode</h2>
                        <p className="text-sm text-gray-600 mb-6">Put the platform into maintenance mode to prevent user access</p>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-gray-800">Enable Maintenance Mode</div>
                                    <div className="text-sm text-gray-500">Users will see the maintenance message below</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenanceMode || false}
                                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                                <textarea
                                    value={settings.maintenanceMessage || ''}
                                    onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter the message users will see when maintenance mode is enabled..."
                                />
                            </div>

                            {settings.maintenanceMode && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Wrench className="text-orange-600 mt-1" size={20} />
                                        <div>
                                            <div className="font-semibold text-orange-800">⚠️ Maintenance Mode is Active</div>
                                            <div className="text-sm text-orange-700 mt-1">
                                                Users are currently unable to access the platform. Remember to disable maintenance mode when work is complete.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
