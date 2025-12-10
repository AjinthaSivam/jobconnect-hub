import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: string;
  job_type?: string;
  created_at?: string;
}

export interface Application {
  id: number;
  name: string;
  email: string;
  resume_url: string;
  job_id: number;
  job?: Job;
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected';
  created_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

// API Functions
export const jobsApi = {
  getAll: () => api.get<Job[]>('/api/jobs/'),
  getById: (id: string | number) => api.get<Job>(`/api/jobs/${id}/`),
};

export const applicationsApi = {
  submit: (data: { name: string; email: string; resume_url: string; job_id: number }) =>
    api.post('/api/applications/submit/', data),
  getAll: () => api.get<Application[]>('/api/applications/'),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/applications/${id}/update_status/`, { status }),
};

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<TokenResponse>('/api/token/', credentials),
  refresh: (refreshToken: string) =>
    api.post<{ access: string }>('/api/token/refresh/', { refresh: refreshToken }),
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
