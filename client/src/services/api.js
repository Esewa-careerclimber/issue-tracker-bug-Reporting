const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  registerUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  registerAdmin: async (adminData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// User Tickets API
export const ticketsAPI = {
  createTicket: async (ticketData) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    Object.keys(ticketData).forEach(key => {
      if (ticketData[key] !== null && ticketData[key] !== undefined) {
        formData.append(key, ticketData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/user/tickets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  getUserTickets: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getTicketById: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/tickets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Admin Tickets API
export const adminTicketsAPI = {
  getAllTickets: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateTicketStatus: async (id, status) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/tickets/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  assignTicket: async (id, userId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/tickets/${id}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ assignedTo: userId }),
    });
    return handleResponse(response);
  },
};

// Dashboard API
export const dashboardAPI = {
  getUserDashboard: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getAdminDashboard: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  markAsRead: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  tickets: ticketsAPI,
  adminTickets: adminTicketsAPI,
  dashboard: dashboardAPI,
  profile: profileAPI,
  notifications: notificationsAPI,
};
