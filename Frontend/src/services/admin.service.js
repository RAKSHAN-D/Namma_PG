import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/";

// Helper to get JWT Token
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
        return { Authorization: "Bearer " + user.accessToken };
    } else {
        return {};
    }
};

// --- API METHODS ---

const getDashboardStats = async () => {
    try {
        const response = await axios.get(API_URL + "stats", { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch stats", error);
        return { totalPGs: 0, activeOwners: 0, activeUsers: 0, pendingApprovals: 0 };
    }
};

const getAllPGs = async () => {
    const response = await axios.get(API_URL + "pgs", { headers: authHeader() });
    return response.data;
};

const getAllUsers = async () => {
    const response = await axios.get(API_URL + "users", { headers: authHeader() });
    return response.data;
};

const getAllOwners = async () => {
    const response = await axios.get(API_URL + "owners", { headers: authHeader() });
    return response.data;
};

// --- CHART DATA AGGREGATION (Frontend Side Calculation) ---

const getPgGrowthData = async () => {
    try {
        const pgs = await getAllPGs();
        // Mocking growth logic based on random distribution for demo purposes
        // Since we bulk created them "now", real growth chart would be flat. 
        // We will return mock growth data for visual appeal until we have meaningful history.
        return [
            { month: "Jan", pgs: 12 },
            { month: "Feb", pgs: 19 },
            { month: "Mar", pgs: 25 },
            { month: "Apr", pgs: 32 },
            { month: "May", pgs: 45 },
            { month: "Jun", pgs: pgs.length > 50 ? pgs.length : 60 },
        ];
    } catch (e) { return []; }
};

const getUserSignupTrend = async () => {
    // Returning mock trend for visual appeal
    return [
        { date: "1st", users: 5 },
        { date: "5th", users: 15 },
        { date: "10th", users: 25 },
        { date: "15th", users: 40 },
        { date: "20th", users: 55 },
        { date: "25th", users: 80 },
        { date: "30th", users: 100 },
    ];
};

const getOnboardingTrend = async () => {
    // Returning mock trend
    return [
        { month: "Jan", users: 10, owners: 2 },
        { month: "Feb", users: 25, owners: 4 },
        { month: "Mar", users: 45, owners: 5 },
        { month: "Apr", users: 70, owners: 8 },
        { month: "May", users: 110, owners: 15 },
        { month: "Jun", users: 168, owners: 34 },
    ];
};

const getPgStatusDistribution = async () => {
    try {
        const pgs = await getAllPGs();
        const approved = pgs.filter(pg => pg.active).length;
        const pending = pgs.filter(pg => !pg.active).length;
        const blocked = 0; // Logic for blocked to be added later

        return [
            { name: "Approved", value: approved, color: "#10B981" },
            { name: "Pending", value: pending, color: "#F59E0B" },
            { name: "Blocked", value: blocked, color: "#EF4444" },
        ];
    } catch (e) {
        return [
            { name: "Approved", value: 0, color: "#10B981" },
            { name: "Pending", value: 0, color: "#F59E0B" },
            { name: "Blocked", value: 0, color: "#EF4444" },
        ];
    }
};

const getAccountStatusOverview = async () => {
    try {
        const users = await getAllUsers();
        const owners = await getAllOwners();

        return [
            { name: "Active Users", value: users.length, fill: "#3B82F6" },
            { name: "Blocked Users", value: 0, fill: "#9CA3AF" },
            { name: "Active Owners", value: owners.length, fill: "#8B5CF6" },
            { name: "Blocked Owners", value: 0, fill: "#D1D5DB" },
        ];
    } catch (e) { return []; }
};

const AdminService = {
    getDashboardStats,
    getPgGrowthData,
    getUserSignupTrend,
    getOnboardingTrend,
    getPgStatusDistribution,
    getAccountStatusOverview,
    getAllPGs,
    getAllUsers,
    getAllOwners
};

export default AdminService;
