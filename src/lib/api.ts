import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

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

export interface JobCreateData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: string;
  job_type?: string;
}

export interface Application {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  resume: string;
  cover_letter?: string;
  job_id: number;
  job?: Job;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  created_at?: string;
}

export interface ApplicationSubmitData {
  job_id: number;
  full_name: string;
  email: string;
  phone?: string;
  resume: File;
  cover_letter?: string;
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
  create: (data: JobCreateData) => api.post<Job>('/api/jobs/', data),
  update: (id: number, data: Partial<JobCreateData>) => api.patch<Job>(`/api/jobs/${id}/`, data),
  fullUpdate: (id: number, data: JobCreateData) => api.put<Job>(`/api/jobs/${id}/`, data),
  delete: (id: number) => api.delete(`/api/jobs/${id}/`),
};

export const applicationsApi = {
  submit: (data: ApplicationSubmitData) => {
    const formData = new FormData();
    formData.append('job_id', data.job_id.toString());
    formData.append('full_name', data.full_name);
    formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('resume', data.resume);
    if (data.cover_letter) formData.append('cover_letter', data.cover_letter);
    
    return api.post('/api/applications/submit/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get<Application[]>('/api/applications/'),
  getById: (id: number) => api.get<Application>(`/api/applications/${id}/`),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/applications/${id}/update_status/`, { status }),
  delete: (id: number) => api.delete(`/api/applications/${id}/`),
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
