import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCheck,
    ClipboardCheck,
    FileBarChart,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    User,
    AlertCircle
} from "lucide-react";
import AuthService from "../services/auth.service";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/pgs", label: "All PGs", icon: Building2 },
        { path: "/admin/owners", label: "Owners", icon: UserCheck },
        { path: "/admin/users", label: "Users", icon: Users },
        { path: "/admin/approvals", label: "Approvals", icon: ClipboardCheck },
        { path: "/admin/issues", label: "Issues", icon: AlertCircle },
        { path: "/admin/reports", label: "Reports", icon: FileBarChart },
        { path: "/admin/settings", label: "Settings", icon: Settings },
    ];

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-indigo-900 text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-20"
                    } lg:relative lg:translate-x-0`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-indigo-800">
                    <h1 className={`font-bold text-xl transition-all ${isSidebarOpen ? "block" : "hidden"}`}>
                        Namma PG <span className="text-indigo-400">Admin</span>
                    </h1>
                    <span className={`font-bold text-xl ${!isSidebarOpen ? "block" : "hidden"}`}>NP</span>
                </div>

                {/* Menu Items */}
                <nav className="mt-6 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                                    }`}
                            >
                                <Icon className="h-5 w-5 min-w-[1.25rem]" />
                                <span className={`ml-4 font-medium transition-all ${isSidebarOpen ? "block" : "hidden"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle Sidebar Button (Mobile) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute bottom-4 right-4 p-2 bg-indigo-800 rounded-lg lg:hidden"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none lg:block hidden"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Global Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search PGs, Owners, Users..."
                                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 w-64 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                A
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-600 hover:text-red-600 flex items-center"
                            >
                                <LogOut className="h-4 w-4 mr-1" /> Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
