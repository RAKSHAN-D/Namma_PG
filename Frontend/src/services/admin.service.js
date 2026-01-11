import api from "./api";

// --- API METHODS ---

const getDashboardStats = async () => {
    try {
        const response = await api.get("/admin/stats");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch stats", error);
        return { totalPGs: 0, activeOwners: 0, activeUsers: 0, pendingApprovals: 0 };
    }
};

const getAllPGs = async () => {
    const response = await api.get("/admin/pgs");
    return response.data;
};

const getPgDetails = async (id) => {
    const response = await api.get(`/admin/pgs/${id}`);
    return response.data;
};

const getAllUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

const getAllOwners = async () => {
    const response = await api.get("/admin/owners");
    return response.data;
};

const getAllIssues = async () => {
    const response = await api.get("/admin/issues");
    return response.data;
};

const updatePgStatus = async (id, active) => {
    const response = await api.put(
        `/admin/pgs/${id}/status`,
        null,
        {
            params: { active }
        }
    );
    return response.data;
};

const updateUserStatus = async (id, active) => {
    const response = await api.put(
        `/admin/users/${id}/status`,
        null,
        {
            params: { active }
        }
    );
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
    try {
        const response = await api.get("/admin/onboarding-trend");
        return response.data;
    } catch (e) {
        // Fallback or empty if error
        return [];
    }
};

const getPgStatusDistribution = async () => {
    try {
        const pgs = await getAllPGs();
        // Fallback if pgs is not an array
        const pgList = Array.isArray(pgs) ? pgs : [];

        const approved = pgList.filter(pg => pg.active === true).length;
        const pending = pgList.filter(pg => pg.active === false).length;
        const blocked = 0; // Logic for blocked to be added later

        // Ensure we always return at least some data structure even if values are 0
        return [
            { name: "Approved", value: approved, color: "#10B981" },
            { name: "Pending", value: pending, color: "#F59E0B" },
            { name: "Blocked", value: blocked, color: "#EF4444" },
        ];
    } catch (e) {
        console.error("Error fetching PG status distribution:", e);
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
    getAllOwners,
    getAllIssues,
    updatePgStatus,
    updateUserStatus,
    getPgDetails,
    getUserDetails: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },
    getOwnerDetails: async (id) => {
        const response = await api.get(`/admin/owners/${id}`);
        return response.data;
    },
    getApprovalStats: async () => {
        const response = await api.get(`/admin/approvals/stats`);
        return response.data;
    }
};

export default AdminService;
