import axios from 'axios';
import { User, AuthResponse, Course, LoginForm, RegisterForm, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Mock data for demo purposes (will be replaced with real API)
const DEMO_MODE = !process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Mock API functions for demo
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

const mockLogin = async (credentials: LoginForm): Promise<AuthResponse> => {
  await mockDelay(1000);
  
  if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
    return {
      user: {
        id: '1',
        email: credentials.email,
        name: '데모 사용자',
        phoneNumber: '010-1234-5678',
        userType: 'student',
        status: 'active',
        companyId: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'demo-jwt-token',
      refreshToken: 'demo-refresh-token',
    };
  }
  
  throw new Error('로그인에 실패했습니다. (데모: demo@example.com / demo123)');
};

const mockRegister = async (userData: RegisterForm): Promise<User> => {
  await mockDelay(1500);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    email: userData.email,
    name: userData.name,
    phoneNumber: userData.phoneNumber,
    userType: userData.userType,
    status: 'pending_approval',
    companyId: userData.companyId || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const authApi = {
  login: async (credentials: LoginForm): Promise<AuthResponse> => {
    if (DEMO_MODE) {
      return mockLogin(credentials);
    }
    const response = await api.post<ApiResponse<AuthResponse>>('/users/login', credentials);
    return response.data.data;
  },

  register: async (userData: RegisterForm): Promise<User> => {
    if (DEMO_MODE) {
      return mockRegister(userData);
    }
    const response = await api.post<ApiResponse<User>>('/users/register', userData);
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    if (DEMO_MODE) {
      throw new Error('데모 모드에서는 지원되지 않습니다.');
    }
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data.data;
  },
};

// Mock course data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React 웹 개발 기초',
    description: 'React를 사용한 현대적인 웹 애플리케이션 개발을 배우는 과정입니다. JSX, 컴포넌트, 상태 관리 등의 핵심 개념을 다룹니다.',
    objectives: ['React 기본 개념 이해', 'JSX 문법 숙달', '컴포넌트 기반 개발', '상태 관리'],
    targetAudience: '웹 개발 입문자, JavaScript 기초 지식 보유자',
    prerequisites: ['JavaScript ES6+ 기초', 'HTML/CSS 기본 지식'],
    duration: 40,
    maxStudents: 20,
    minStudents: 5,
    courseType: 'employee_training',
    status: 'published',
    category: '웹 개발',
    tags: ['React', 'JavaScript', '프론트엔드'],
    createdBy: 'instructor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Node.js 백엔드 개발',
    description: 'Node.js와 Express를 활용한 서버 사이드 개발을 학습합니다. RESTful API 설계 및 데이터베이스 연동을 다룹니다.',
    objectives: ['Node.js 기본 개념', 'Express 프레임워크', 'RESTful API 개발', '데이터베이스 연동'],
    targetAudience: '백엔드 개발 희망자',
    prerequisites: ['JavaScript 기초', '웹 개발 기본 지식'],
    duration: 60,
    maxStudents: 15,
    minStudents: 8,
    courseType: 'job_seeker_training',
    status: 'published',
    category: '백엔드 개발',
    tags: ['Node.js', 'Express', '백엔드', 'API'],
    createdBy: 'instructor-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '데이터베이스 설계와 SQL',
    description: '관계형 데이터베이스 설계 원칙과 SQL 쿼리 작성법을 배웁니다. PostgreSQL을 사용한 실습을 포함합니다.',
    objectives: ['데이터베이스 설계 원칙', 'SQL 쿼리 작성', '정규화', '성능 최적화'],
    targetAudience: '데이터베이스 개발자 희망자',
    prerequisites: ['기본적인 컴퓨터 활용 능력'],
    duration: 32,
    maxStudents: 25,
    minStudents: 10,
    courseType: 'general',
    status: 'published',
    category: '데이터베이스',
    tags: ['SQL', 'PostgreSQL', '데이터베이스'],
    createdBy: 'instructor-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockGetCourses = async (page = 1, limit = 10): Promise<{ courses: Course[]; total: number }> => {
  await mockDelay(500);
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCourses = mockCourses.slice(startIndex, endIndex);
  
  return {
    courses: paginatedCourses,
    total: mockCourses.length,
  };
};

const mockGetCourse = async (id: string): Promise<Course> => {
  await mockDelay(300);
  
  const course = mockCourses.find(c => c.id === id);
  if (!course) {
    throw new Error('강좌를 찾을 수 없습니다.');
  }
  
  return course;
};

export const courseApi = {
  getCourses: async (page = 1, limit = 10): Promise<{ courses: Course[]; total: number }> => {
    if (DEMO_MODE) {
      return mockGetCourses(page, limit);
    }
    const response = await api.get<ApiResponse<Course[]>>(`/courses?page=${page}&limit=${limit}`);
    return {
      courses: response.data.data,
      total: response.data.pagination?.total || 0,
    };
  },

  getCourse: async (id: string): Promise<Course> => {
    if (DEMO_MODE) {
      return mockGetCourse(id);
    }
    const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return response.data.data;
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    if (DEMO_MODE) {
      throw new Error('데모 모드에서는 강좌 생성이 지원되지 않습니다.');
    }
    const response = await api.post<ApiResponse<Course>>('/courses', courseData);
    return response.data.data;
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    if (DEMO_MODE) {
      throw new Error('데모 모드에서는 강좌 수정이 지원되지 않습니다.');
    }
    const response = await api.put<ApiResponse<Course>>(`/courses/${id}`, courseData);
    return response.data.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    if (DEMO_MODE) {
      throw new Error('데모 모드에서는 강좌 삭제가 지원되지 않습니다.');
    }
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