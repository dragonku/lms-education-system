export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  userType: 'admin' | 'instructor' | 'student' | 'company_partner';
  status: 'active' | 'inactive' | 'pending_approval';
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  prerequisites?: string[];
  duration: number;
  maxStudents: number;
  minStudents: number;
  courseType: 'employee_training' | 'job_seeker_training' | 'general';
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  userType: User['userType'];
  companyId?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}