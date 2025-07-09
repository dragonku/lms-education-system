// User Types
export enum UserType {
  EMPLOYEE = 'EMPLOYEE',
  JOB_SEEKER = 'JOB_SEEKER',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export enum Authority {
  USER = 'USER',
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY'
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  userType: UserType;
  status: UserStatus | string;
  companyName?: string;
  authorities: Authority[] | string[];
  createdAt?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  userType: UserType;
  companyName?: string;
}

export interface AuthResponse {
  token: string;
  tokenType?: string;
  user: User;
}

// Course Types
export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  category: string;
  capacity: number;
  currentEnrollment: number;
  startDate: string;
  endDate: string;
  duration: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE' | 'FULL';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategory {
  id: number;
  name: string;
  description: string;
  courses: Course[];
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  enrolledAt: string;
  approvedAt?: string;
  course: Course;
  user: User;
}

export interface CourseListRequest {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
  status?: string;
}

export interface EnrollmentRequest {
  courseId: number;
  userId: number;
}

// API Response Type
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}