const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('digitway_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Public & Admin Auth
  auth: {
    requestOtp: (email) => request('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) }),
    verifyOtp: (email, otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
    getMe: () => request('/auth/me'),
  },

  // Quotes / Contact Requests
  quotes: {
    submit: (quoteData) => request('/quotes', { method: 'POST', body: JSON.stringify(quoteData) }),
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/quotes${qs ? `?${qs}` : ''}`);
    },
    updateStatus: (id, updateData) => request(`/quotes/${id}`, { method: 'PATCH', body: JSON.stringify(updateData) }),
    convertToProject: (id, projectDetails) => request(`/quotes/${id}/convert`, { method: 'POST', body: JSON.stringify(projectDetails) }),
    delete: (id) => request(`/quotes/${id}`, { method: 'DELETE' }),
  },

  // Reviews
  reviews: {
    getPublic: () => request('/reviews/public'),
    submit: (reviewData) => request('/reviews/submit', { method: 'POST', body: JSON.stringify(reviewData) }),
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/reviews${qs ? `?${qs}` : ''}`);
    },
    updateStatus: (id, statusData) => request(`/reviews/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),
    update: (id, reviewData) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(reviewData) }),
    delete: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),
  },

  // Projects CRM (Confidential)
  projects: {
    getOverview: () => request('/projects/overview'),
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/projects${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => request(`/projects/${id}`),
    create: (projectData) => request('/projects', { method: 'POST', body: JSON.stringify(projectData) }),
    update: (id, projectData) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(projectData) }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  },

  // Dynamic Site Content
  content: {
    getPublic: () => request('/content'),
    update: (content) => request('/content', { method: 'PUT', body: JSON.stringify({ content }) }),
    testTelegram: () => request('/content/test-telegram', { method: 'POST' }),
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/notifications/read-all', { method: 'POST' }),
    clear: () => request('/notifications/clear', { method: 'DELETE' }),
  },
};
