const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

export const sessionsApi = {
  getAll: () => apiCall('/sessions'),
  getActive: () => apiCall('/sessions/active'),
  getHistory: () => apiCall('/sessions/history'),
  getActiveTicket: () => apiCall('/sessions/active-ticket'),
  create: (data) => apiCall('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStatus: (id, data) => apiCall(`/sessions/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  complete: (id, data) => apiCall(`/sessions/${id}/complete`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export const vehiclesApi = {
  getAll: () => apiCall('/vehicles'),
  getUserVehicles: (userId = 'user1') => apiCall(`/vehicles/user/${userId}`),
  create: (data) => apiCall('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/vehicles/${id}`, {
    method: 'DELETE',
  }),
};

export const locationsApi = {
  getAll: () => apiCall('/locations'),
  getById: (id) => apiCall(`/locations/${id}`),
  create: (data) => apiCall('/locations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/locations/${id}`, {
    method: 'DELETE',
  }),
};

export const driversApi = {
  getAll: () => apiCall('/drivers'),
  getPending: () => apiCall('/drivers/pending'),
  create: (data) => apiCall('/drivers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createRequest: (data) => apiCall('/drivers/request', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  approve: (id) => apiCall(`/drivers/${id}/approve`, {
    method: 'PUT',
  }),
  reject: (id) => apiCall(`/drivers/${id}/reject`, {
    method: 'PUT',
  }),
};

export const statsApi = {
  getManagerStats: () => apiCall('/stats/manager'),
  getAdminStats: () => apiCall('/stats/admin'),
};

export const healthCheck = () => apiCall('/health');
