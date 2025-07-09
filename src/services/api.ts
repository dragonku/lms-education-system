import axios from 'axios';
import { LoginRequest, SignupRequest, AuthResponse, User, UserType } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const USE_MOCK_API = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;

// Mock users for testing
const MOCK_USERS = {
  'admin@lms.com': {
    id: 1,
    email: 'admin@lms.com',
    name: '관리자',
    userType: UserType.ADMIN,
    authorities: ['ADMIN', 'USER'],
    status: 'ACTIVE'
  },
  'employee@test.com': {
    id: 2,
    email: 'employee@test.com',
    name: '재직자',
    userType: UserType.EMPLOYEE,
    authorities: ['USER'],
    status: 'ACTIVE'
  },
  'jobseeker@test.com': {
    id: 3,
    email: 'jobseeker@test.com',
    name: '구직자',
    userType: UserType.JOB_SEEKER,
    authorities: ['USER'],
    status: 'ACTIVE'
  },
  'company@test.com': {
    id: 4,
    email: 'company@test.com',
    name: '협약사',
    userType: UserType.COMPANY,
    authorities: ['COMPANY', 'USER'],
    status: 'ACTIVE'
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
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

// Response interceptor to handle token expiration
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

// Mock API functions
const mockAuthApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션 지연
    
    const user = MOCK_USERS[credentials.email as keyof typeof MOCK_USERS];
    
    if (user && (credentials.password === 'test123' || credentials.password === 'admin123')) {
      const token = `mock-jwt-token-${Date.now()}`;
      return {
        token,
        user: user as User
      };
    }
    
    throw {
      response: {
        data: {
          message: '이메일 또는 비밀번호가 올바르지 않습니다'
        }
      }
    };
  },

  signup: async (userData: SignupRequest): Promise<{ message: string; user: User }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션 지연
    
    // 이메일 중복 검사
    if (MOCK_USERS[userData.email as keyof typeof MOCK_USERS]) {
      throw {
        response: {
          data: {
            message: '이미 사용 중인 이메일입니다'
          }
        }
      };
    }
    
    const newUser: User = {
      id: Date.now(),
      email: userData.email,
      name: userData.name,
      userType: userData.userType,
      authorities: userData.userType === UserType.COMPANY ? ['COMPANY', 'USER'] : ['USER'],
      status: 'PENDING'
    };
    
    return {
      message: '회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다.',
      user: newUser
    };
  },

  getCurrentUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw { response: { status: 401 } };
    }
    
    // 토큰에서 사용자 정보 추출 (실제로는 JWT 파싱)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  },
};

// Auth API
export const authApi = USE_MOCK_API ? mockAuthApi : {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData: SignupRequest): Promise<{ message: string; user: User }> => {
    const response = await api.post<{ message: string; user: User }>('/auth/signup', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Health API
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;