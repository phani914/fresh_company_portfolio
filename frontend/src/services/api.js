import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 Unauthorized and unwrap paginated DRF responses
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && Array.isArray(response.data.results) && response.data.count !== undefined) {
      response.data = response.data.results;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}auth/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_role');
          window.location.href = '/admin/login';
          return Promise.reject(refreshErr);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post('auth/token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
  },
  isAuthenticated: () => !!localStorage.getItem('access_token'),
};

export const publicService = {
  getCompanyProfile: () => api.get('public/company/'),
  getServices: () => api.get('public/services/'),
  getServiceDetail: (slug) => api.get(`public/services/${slug}/`),
  getProjects: (category = 'All') => api.get('public/projects/', { params: { category: category !== 'All' ? category : undefined } }),
  getTeam: () => api.get('public/team/'),
  getTestimonials: () => api.get('public/testimonials/'),
  getCareers: () => api.get('public/careers/'),
  getGallery: () => api.get('public/gallery/'),
  submitLead: (data) => api.post('public/leads/', data),
  applyForJob: (jobId, formData) => api.post(`public/careers/${jobId}/apply/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const adminService = {
  getKPIs: () => api.get('admin/dashboard/kpis/'),
  getCompanyProfile: () => api.get('admin/profile/'),
  updateCompanyProfile: (data) => api.patch('admin/profile/', data),
  
  getServices: () => api.get('admin/services/'),
  createService: (data) => api.post('admin/services/', data),
  updateService: (id, data) => api.patch(`admin/services/${id}/`, data),
  deleteService: (id) => api.delete(`admin/services/${id}/`),

  getProjects: () => api.get('admin/projects/'),
  createProject: (data) => api.post('admin/projects/', data),
  updateProject: (id, data) => api.patch(`admin/projects/${id}/`, data),
  deleteProject: (id) => api.delete(`admin/projects/${id}/`),

  getTeam: () => api.get('admin/team/'),
  createTeamMember: (data) => api.post('admin/team/', data),
  updateTeamMember: (id, data) => api.patch(`admin/team/${id}/`, data),
  deleteTeamMember: (id) => api.delete(`admin/team/${id}/`),

  getLeads: () => api.get('admin/leads/'),
  updateLeadStatus: (id, status_state) => api.patch(`admin/leads/${id}/`, { status_state }),
  exportLeadsCSVUrl: () => `${API_BASE_URL}admin/leads/export-csv/`,
  
  getUsers: () => api.get('admin/users/'),
  createUser: (data) => api.post('admin/users/', data),
  deleteUser: (id) => api.delete(`admin/users/${id}/`),
  
  getAuditLogs: () => api.get('admin/audit-logs/'),
  seedDemoData: () => api.post('admin/seed-demo-data/'),
};

export default api;
