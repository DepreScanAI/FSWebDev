import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// attach token otomatis di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('deprescan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      console.error('Network error atau server tidak dapat dijangkau');
      return Promise.reject(err);
    }

    if (err.response?.status === 401) {
      const isAuthEndpoint = err.config?.url?.startsWith('/auth/');
      if (!isAuthEndpoint) {
        localStorage.removeItem('deprescan_token');
        delete api.defaults.headers.common['Authorization'];

        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(err);
  },
);

// autentikasi endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (accessToken) =>
    api.post('/auth/google', { access_token: accessToken }),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetToken: (token) =>
    api.get('/auth/reset-password/verify', { params: { token } }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// semua endpoint screening yang membutuhkan autentikasi login
export const screeningAPI = {
  predict: (data) => api.post('/screening/predict', data),

  getSessions: (page = 1, limit = 20) =>
    api.get('/screening/sessions', { params: { page, limit } }),

  getSession: (id) => api.get(`/screening/sessions/${id}`),

  getSessionByCode: (session_code) =>
    api.get(`/screening/sessions/code/${session_code}`),

  requestAiInsight: (id) => api.post(`/screening/sessions/${id}/ai-insight`),

  deleteSession: (id) => api.delete(`/screening/sessions/${id}`),

  deleteAllSessions: () => api.delete('/screening/sessions'),

  mlHealth: () => api.get('/screening/health'),
};

// feedback endpoints untuk memberikan masukan dan harus ter authentikasi login
export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getAll: () => api.get('/feedback'),
};

export default api;
