import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Building, Users, UserCheck } from 'lucide-react';
import AdminService from '../../services/admin.service';

const Approvals = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        approvedPgs: 0,
        pendingPgs: 0,
        approvedUsers: 0,
        pendingUsers: 0,
        approvedOwners: 0,
        pendingOwners: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovalStats();
    }, []);

    const fetchApprovalStats = async () => {
        try {
            const data = await AdminService.getApprovalStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching approval stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const ApprovalCard = ({ title, count, subtitle, icon: Icon, colorClass, clickable, onClick }) => (
        <div
            className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all duration-200 ${clickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''
                } ${colorClass}`}
            onClick={onClick}
            style={{ minHeight: '160px' }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClass.includes('green') ? 'bg-green-50' : 'bg-orange-50'}`}>
                    <Icon className={colorClass.includes('green') ? 'text-green-600' : 'text-orange-600'} size={24} />
                </div>
            </div>
            <div className="mt-4">
                <div className={`text-4xl font-bold ${colorClass.includes('green') ? 'text-green-600' : 'text-orange-600'}`}>
                    {count}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl text-gray-500 font-semibold animate-pulse">Loading Approval Stats...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Approvals Dashboard</h1>
                <p className="text-gray-500 mt-1">Monitor and manage pending approvals across PGs, Users, and Owners</p>
            </div>

            {/* Summary Stats - Top */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Total Pending Approvals</div>
                        <div className="text-3xl font-bold text-orange-600">
                            {stats.pendingPgs + stats.pendingUsers + stats.pendingOwners}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Total Approved</div>
                        <div className="text-3xl font-bold text-green-600">
                            {stats.approvedPgs + stats.approvedUsers + stats.approvedOwners}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Total Entities</div>
                        <div className="text-3xl font-bold text-indigo-600">
                            {stats.approvedPgs + stats.pendingPgs + stats.approvedUsers + stats.pendingUsers + stats.approvedOwners + stats.pendingOwners}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Cards Grid - 2 columns on desktop, 1 on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Row 1: PGs */}
                <ApprovalCard
                    title="Approved PGs"
                    count={stats.approvedPgs}
                    subtitle="Active and verified"
                    icon={CheckCircle}
                    colorClass="border-green-200 hover:border-green-300"
                    clickable={true}
                    onClick={() => navigate('/admin/pgs?status=approved')}
                />
                <ApprovalCard
                    title="Pending PG Approvals"
                    count={stats.pendingPgs}
                    subtitle="Requires review"
                    icon={Clock}
                    colorClass="border-orange-200 hover:border-orange-300"
                    clickable={true}
                    onClick={() => navigate('/admin/pgs?status=pending')}
                />

                {/* Row 2: Users */}
                <ApprovalCard
                    title="Approved Users"
                    count={stats.approvedUsers}
                    subtitle="Active user accounts"
                    icon={CheckCircle}
                    colorClass="border-green-200 hover:border-green-300"
                    clickable={true}
                    onClick={() => navigate('/admin/users?status=approved')}
                />
                <ApprovalCard
                    title="Pending User Approvals"
                    count={stats.pendingUsers}
                    subtitle="Requires review"
                    icon={Clock}
                    colorClass="border-orange-200 hover:border-orange-300"
                    clickable={true}
                    onClick={() => navigate('/admin/users?status=pending')}
                />

                {/* Row 3: Owners */}
                <ApprovalCard
                    title="Approved Owners"
                    count={stats.approvedOwners}
                    subtitle="Verified PG owners"
                    icon={CheckCircle}
                    colorClass="border-green-200 hover:border-green-300"
                    clickable={true}
                    onClick={() => navigate('/admin/owners?status=approved')}
                />
                <ApprovalCard
                    title="Pending Owner Approvals"
                    count={stats.pendingOwners}
                    subtitle="Requires review"
                    icon={Clock}
                    colorClass="border-orange-200 hover:border-orange-300"
                    clickable={true}
                    onClick={() => navigate('/admin/owners?status=pending')}
                />
            </div>
        </div>
    );
};

export default Approvals;
