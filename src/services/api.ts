import axios from 'axios';
import { LoginRequest, SignupRequest, AuthResponse, User, UserType, Authority, Course, Enrollment, CourseListRequest, EnrollmentRequest, Post, PostRequest, PostListRequest, PostListResponse, FileAttachment, BoardType, PostDetailResponse, PostResponse, PostCreateRequest, PostUpdateRequest, CommentCreateRequest, CommentUpdateRequest, CommentResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const USE_MOCK_API = true; // Mock API 사용 (개발/테스트용)

// Mock users for testing
const MOCK_USERS = {
  'admin@lms.com': {
    id: 1,
    email: 'admin@lms.com',
    name: '관리자',
    userType: UserType.ADMIN,
    authorities: [Authority.ADMIN, Authority.USER],
    status: 'ACTIVE'
  },
  'employee@test.com': {
    id: 2,
    email: 'employee@test.com',
    name: '재직자',
    userType: UserType.EMPLOYEE,
    authorities: [Authority.USER],
    status: 'ACTIVE'
  },
  'jobseeker@test.com': {
    id: 3,
    email: 'jobseeker@test.com',
    name: '구직자',
    userType: UserType.JOB_SEEKER,
    authorities: [Authority.USER],
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

// Mock courses data
const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'React 기초부터 실전까지',
    description: 'React의 기본 개념부터 실무에서 사용하는 고급 기능까지 단계별로 학습합니다. Hook, Context API, 상태 관리 등 모던 React 개발에 필요한 모든 것을 다룹니다.',
    instructor: '김개발',
    category: '프론트엔드',
    capacity: 30,
    currentEnrollment: 12,
    startDate: '2025-08-01',
    endDate: '2025-09-30',
    duration: '8주',
    price: 350000,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop&crop=center',
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'Spring Boot 마스터 클래스',
    description: 'Spring Boot를 활용한 REST API 개발, JPA를 이용한 데이터베이스 연동, 보안 구현 등 백엔드 개발의 핵심 기술들을 익힙니다.',
    instructor: '박백엔드',
    category: '백엔드',
    capacity: 25,
    currentEnrollment: 8,
    startDate: '2025-08-15',
    endDate: '2025-10-15',
    duration: '10주',
    price: 420000,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=200&fit=crop&crop=center',
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z'
  },
  {
    id: 3,
    title: 'Python 데이터 분석 완전 정복',
    description: 'Python을 이용한 데이터 분석의 모든 과정을 학습합니다. Pandas, NumPy, Matplotlib을 활용한 데이터 처리와 시각화를 다룹니다.',
    instructor: '이데이터',
    category: '데이터분석',
    capacity: 20,
    currentEnrollment: 20,
    startDate: '2025-07-20',
    endDate: '2025-09-20',
    duration: '12주',
    price: 480000,
    status: 'FULL',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center',
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z'
  },
  {
    id: 4,
    title: 'UI/UX 디자인 실무',
    description: 'Figma를 활용한 실무 UI/UX 디자인 과정입니다. 사용자 경험 설계부터 프로토타이핑까지 전 과정을 다룹니다.',
    instructor: '최디자인',
    category: '디자인',
    capacity: 15,
    currentEnrollment: 5,
    startDate: '2025-09-01',
    endDate: '2025-11-01',
    duration: '8주',
    price: 320000,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=200&fit=crop&crop=center',
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z'
  },
  {
    id: 5,
    title: 'DevOps 엔지니어 양성 과정',
    description: 'Docker, Kubernetes, Jenkins를 활용한 CI/CD 파이프라인 구축과 클라우드 인프라 관리를 학습합니다.',
    instructor: '한데브옵스',
    category: '인프라',
    capacity: 12,
    currentEnrollment: 3,
    startDate: '2025-08-10',
    endDate: '2025-11-10',
    duration: '14주',
    price: 550000,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=300&h=200&fit=crop&crop=center',
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z'
  }
];

// Mock enrollments data
let MOCK_ENROLLMENTS: Enrollment[] = [];

// Mock course API functions
const mockCourseApi = {
  getCourses: async (params: CourseListRequest = {}): Promise<{ courses: Course[]; total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredCourses = [...MOCK_COURSES];
    
    // Filter by category
    if (params.category) {
      filteredCourses = filteredCourses.filter(course => course.category === params.category);
    }
    
    // Filter by search
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by status
    if (params.status) {
      filteredCourses = filteredCourses.filter(course => course.status === params.status);
    }
    
    // Pagination
    const page = params.page || 1;
    const size = params.size || 10;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
    
    return {
      courses: paginatedCourses,
      total: filteredCourses.length
    };
  },

  getCourse: async (id: number): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const course = MOCK_COURSES.find(c => c.id === id);
    if (!course) {
      throw {
        response: {
          status: 404,
          data: { message: '과정을 찾을 수 없습니다.' }
        }
      };
    }
    
    return course;
  },

  createCourse: async (courseData: any): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCourse: Course = {
      ...courseData,
      id: Date.now(),
      currentEnrollment: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    MOCK_COURSES.push(newCourse);
    return newCourse;
  },

  updateCourse: async (id: number, courseData: any): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === id);
    if (courseIndex === -1) {
      throw {
        response: {
          status: 404,
          data: { message: '과정을 찾을 수 없습니다.' }
        }
      };
    }
    
    const updatedCourse = {
      ...MOCK_COURSES[courseIndex],
      ...courseData,
      updatedAt: new Date().toISOString()
    };
    
    MOCK_COURSES[courseIndex] = updatedCourse;
    return updatedCourse;
  },

  deleteCourse: async (id: number): Promise<{ message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === id);
    if (courseIndex === -1) {
      throw {
        response: {
          status: 404,
          data: { message: '과정을 찾을 수 없습니다.' }
        }
      };
    }
    
    MOCK_COURSES.splice(courseIndex, 1);
    return { message: '과정이 삭제되었습니다.' };
  },

  enrollCourse: async (request: EnrollmentRequest): Promise<Enrollment> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const course = MOCK_COURSES.find(c => c.id === request.courseId);
    const user = Object.values(MOCK_USERS).find(u => u.id === request.userId);
    
    if (!course || !user) {
      throw {
        response: {
          status: 404,
          data: { message: '과정 또는 사용자를 찾을 수 없습니다.' }
        }
      };
    }
    
    // Check if already enrolled
    const existingEnrollment = MOCK_ENROLLMENTS.find(e => 
      e.courseId === request.courseId && e.userId === request.userId
    );
    
    if (existingEnrollment) {
      throw {
        response: {
          status: 400,
          data: { message: '이미 수강 신청한 과정입니다.' }
        }
      };
    }
    
    // Check capacity
    if (course.currentEnrollment >= course.capacity) {
      throw {
        response: {
          status: 400,
          data: { message: '정원이 초과되었습니다.' }
        }
      };
    }
    
    const enrollment: Enrollment = {
      id: Date.now(),
      userId: request.userId,
      courseId: request.courseId,
      status: 'PENDING',
      enrolledAt: new Date().toISOString(),
      course,
      user
    };
    
    MOCK_ENROLLMENTS.push(enrollment);
    
    // Update current enrollment count
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === request.courseId);
    if (courseIndex !== -1) {
      MOCK_COURSES[courseIndex].currentEnrollment += 1;
      if (MOCK_COURSES[courseIndex].currentEnrollment >= MOCK_COURSES[courseIndex].capacity) {
        MOCK_COURSES[courseIndex].status = 'FULL';
      }
    }
    
    return enrollment;
  },

  cancelEnrollment: async (enrollmentId: number): Promise<{ message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const enrollmentIndex = MOCK_ENROLLMENTS.findIndex(e => e.id === enrollmentId);
    if (enrollmentIndex === -1) {
      throw {
        response: {
          status: 404,
          data: { message: '수강 신청 내역을 찾을 수 없습니다.' }
        }
      };
    }
    
    const enrollment = MOCK_ENROLLMENTS[enrollmentIndex];
    MOCK_ENROLLMENTS.splice(enrollmentIndex, 1);
    
    // Update current enrollment count
    const courseIndex = MOCK_COURSES.findIndex(c => c.id === enrollment.courseId);
    if (courseIndex !== -1) {
      MOCK_COURSES[courseIndex].currentEnrollment -= 1;
      if (MOCK_COURSES[courseIndex].status === 'FULL') {
        MOCK_COURSES[courseIndex].status = 'ACTIVE';
      }
    }
    
    return { message: '수강 신청이 취소되었습니다.' };
  },

  getMyEnrollments: async (userId: number): Promise<Enrollment[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_ENROLLMENTS.filter(e => e.userId === userId);
  },

  getCategories: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categoriesSet = new Set(MOCK_COURSES.map(course => course.category));
    const categories = Array.from(categoriesSet);
    return categories;
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

// Course API
export const courseApi = USE_MOCK_API ? mockCourseApi : {
  getCourses: async (params: CourseListRequest = {}): Promise<{ courses: Course[]; total: number }> => {
    const response = await api.get<{ courses: Course[]; total: number }>('/courses', { params });
    return response.data;
  },

  getCourse: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: any): Promise<Course> => {
    const response = await api.post<Course>('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: number, courseData: any): Promise<Course> => {
    const response = await api.put<Course>(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/courses/${id}`);
    return response.data;
  },

  enrollCourse: async (request: EnrollmentRequest): Promise<Enrollment> => {
    const response = await api.post<Enrollment>('/enrollments', request);
    return response.data;
  },

  cancelEnrollment: async (enrollmentId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  getMyEnrollments: async (userId: number): Promise<Enrollment[]> => {
    const response = await api.get<Enrollment[]>(`/users/${userId}/enrollments`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/courses/categories');
    return response.data;
  }
};

// Admin API functions 
export const adminApi = {
  getDashboardStats: async (): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    pendingEnrollments: number;
  }> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Fallback to mock data if API fails
      return {
        totalUsers: 45,
        totalCourses: 12,
        totalEnrollments: 128,
        pendingEnrollments: 8
      };
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  approveUser: async (userId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '사용자 승인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Approve user error:', error);
      throw error;
    }
  },

  rejectUser: async (userId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '사용자 거절에 실패했습니다.');
      }
    } catch (error) {
      console.error('Reject user error:', error);
      throw error;
    }
  },

  suspendUser: async (userId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '사용자 정지에 실패했습니다.');
      }
    } catch (error) {
      console.error('Suspend user error:', error);
      throw error;
    }
  },

  deleteUser: async (userId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '사용자 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  approveEnrollment: async (enrollmentId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '수강신청 승인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Approve enrollment error:', error);
      throw error;
    }
  },

  rejectEnrollment: async (enrollmentId: number): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '수강신청 거절에 실패했습니다.');
      }
    } catch (error) {
      console.error('Reject enrollment error:', error);
      throw error;
    }
  }
};

// Board API
export const boardApi = {
  getPosts: async (boardType: string, params: PostListRequest = {}): Promise<PostListResponse> => {
    const response = await api.get<PostListResponse>(`/board/${boardType}`, { params });
    return response.data;
  },

  getPost: async (boardType: string, id: number): Promise<Post> => {
    const response = await api.get<Post>(`/board/${boardType}/${id}`);
    return response.data;
  },

  createPost: async (boardType: string, postData: PostRequest): Promise<Post> => {
    const response = await api.post<Post>(`/board/${boardType}`, postData);
    return response.data;
  },

  updatePost: async (boardType: string, id: number, postData: PostRequest): Promise<Post> => {
    const response = await api.put<Post>(`/board/${boardType}/${id}`, postData);
    return response.data;
  },

  deletePost: async (boardType: string, id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/board/${boardType}/${id}`);
    return response.data;
  },

  getNotices: async (boardType: string): Promise<Post[]> => {
    const response = await api.get<Post[]>(`/board/${boardType}/notices`);
    return response.data;
  },

  getBoardStats: async (boardType: string): Promise<{ totalPosts: number; boardType: string; boardTypeName: string }> => {
    const response = await api.get(`/board/${boardType}/stats`);
    return response.data;
  },

  // Notice Board specific APIs
  getNoticePosts: async (params: { page?: number; size?: number; keyword?: string } = {}): Promise<PostListResponse> => {
    const response = await api.get<PostListResponse>('/board/notice', { params });
    return response.data;
  },

  getNoticePost: async (id: number): Promise<PostDetailResponse> => {
    const response = await api.get<PostDetailResponse>(`/board/notice/${id}`);
    return response.data;
  },

  createNoticePost: async (postData: PostCreateRequest): Promise<PostResponse> => {
    const response = await api.post<PostResponse>('/board/notice', postData);
    return response.data;
  },

  updateNoticePost: async (id: number, postData: PostUpdateRequest): Promise<PostResponse> => {
    const response = await api.put<PostResponse>(`/board/notice/${id}`, postData);
    return response.data;
  },

  deleteNoticePost: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/board/notice/${id}`);
    return response.data;
  }
};

// File Upload API
export const fileApi = {
  uploadFile: async (file: File, postId: number): Promise<FileAttachment> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('postId', postId.toString());
    
    const response = await api.post<FileAttachment>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadFiles: async (files: File[], postId: number): Promise<FileAttachment[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('postId', postId.toString());
    
    const response = await api.post<FileAttachment[]>('/files/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadFile: async (fileId: number): Promise<Blob> => {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteFile: async (fileId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/files/${fileId}`);
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