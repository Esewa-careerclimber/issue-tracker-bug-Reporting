import axios from 'axios';

// The base URL from the environment variable (http://localhost:5001)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Create an Axios instance with the correct full base URL, including '/api'
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Use an interceptor to automatically add the auth token to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Use a response interceptor to standardize error handling.
api.interceptors.response.use(
  (response) => response.data, // On success, just return the data
  (error) => {
    // On error, reject with a consistent error message.
    const message = error.response?.data?.message || error.message || 'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerUser: (userData) => api.post('/auth/register/user', userData),
  registerAdmin: (adminData) => api.post('/auth/register/admin', adminData),
  logout: () => api.post('/auth/logout'),
};

// User Tickets API
export const ticketsAPI = {
  // THIS IS THE CORRECTED FUNCTION
  createTicket: (ticketData) => {
    const formData = new FormData();
    // Append all text fields to the FormData object
    formData.append('title', ticketData.title);
    formData.append('description', ticketData.description);
    formData.append('type', ticketData.type);
    formData.append('category', ticketData.category);

    // Only append the attachment if it exists
    if (ticketData.attachment) {
      formData.append('attachment', ticketData.attachment);
    }

    // When sending FormData, axios automatically sets the 'Content-Type' to 'multipart/form-data'
    return api.post('/user/tickets', formData);
  },
  getUserTickets: () => api.get('/user/tickets'),
  getTicketById: (id) => api.get(`/user/tickets/${id}`),
};

// Admin Tickets API
export const adminTicketsAPI = {
  getAllTickets: () => api.get('/admin/tickets'),
  updateTicketStatus: (id, status) => api.patch(`/admin/tickets/${id}/status`, { status }),
  assignTicket: (id, userId) => api.patch(`/admin/tickets/${id}/assign`, { assignedTo: userId }),
};

// Dashboard API
export const dashboardAPI = {
  getUserDashboard: () => api.get('/user/dashboard'),
  getAdminDashboard: () => api.get('/admin/dashboard'),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/user/notifications'),
  markAsRead: (id) => api.patch(`/user/notifications/${id}/read`),
};

// Default export combining all APIs for easy import elsewhere
export default {
  auth: authAPI,
  tickets: ticketsAPI,
  adminTickets: adminTicketsAPI,
  dashboard: dashboardAPI,
  profile: profileAPI,
  notifications: notificationsAPI,
};