import axios from 'axios';
import { User, AuthResponse, Course, LoginForm, RegisterForm, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginForm): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/users/login', credentials);
    return response.data.data;
  },

  register: async (userData: RegisterForm): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users/register', userData);
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data.data;
  },
};

export const courseApi = {
  getCourses: async (page = 1, limit = 10): Promise<{ courses: Course[]; total: number }> => {
    const response = await api.get<ApiResponse<Course[]>>(`/courses?page=${page}&limit=${limit}`);
    return {
      courses: response.data.data,
      total: response.data.pagination?.total || 0,
    };
  },

  getCourse: async (id: string): Promise<Course> => {
    const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return response.data.data;
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    const response = await api.post<ApiResponse<Course>>('/courses', courseData);
    return response.data.data;
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    const response = await api.put<ApiResponse<Course>>(`/courses/${id}`, courseData);
    return response.data.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};

export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;