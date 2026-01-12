import axios from 'axios';

const API_URL = 'http://localhost:8080/api/owner';

// Get auth token from localStorage
const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

// Create axios instance with auth
const api = axios.create({
    baseURL: API_URL,
});

// Add auth header to every request
api.interceptors.request.use(
    (config) => {
        const authHeader = getAuthHeader();
        config.headers = { ...config.headers, ...authHeader };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const OwnerService = {
    // Dashboard APIs
    getDashboardSummary: async (period = '30d') => {
        const response = await api.get(`/dashboard/summary?period=${period}`);
        return response.data;
    },

    getAllPGs: async () => {
        const response = await api.get('/pgs');
        return response.data;
    },

    getPerformanceGraphs: async (period = '30d') => {
        const response = await api.get(`/dashboard/graphs?period=${period}`);
        return response.data;
    },

    // PG Detail APIs
    getPGById: async (pgId) => {
        const response = await api.get(`/pgs/${pgId}`);
        return response.data;
    },

    getPGResidents: async (pgId) => {
        const response = await api.get(`/pgs/${pgId}/residents`);
        return response.data;
    },

    getPGIssues: async (pgId, params = {}) => {
        const response = await api.get(`/pgs/${pgId}/issues`, { params });
        return response.data;
    },

    updateIssueStatus: async (issueId, data) => {
        const response = await api.put(`/issues/${issueId}/status`, data);
        return response.data;
    },

    getPGReviews: async (pgId, params = {}) => {
        const response = await api.get(`/pgs/${pgId}/reviews`, { params });
        return response.data;
    },

    replyToReview: async (reviewId, replyText) => {
        const response = await api.post(`/reviews/${reviewId}/reply`, { replyText });
        return response.data;
    },

    // Analytics APIs
    getPGComparison: async (period = '30d') => {
        const response = await api.get('/analytics/comparison', {
            params: { period }
        });
        return response.data;
    },

    getInsights: async () => {
        const response = await api.get('/analytics/insights');
        return response.data;
    },

    // Settings APIs
    getOwnerProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    updateOwnerProfile: async (data) => {
        const response = await api.put('/profile', data);
        return response.data;
    }
};

export default OwnerService;
