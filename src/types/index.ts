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
export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FULL = 'FULL'
}

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
  status: CourseStatus | string;
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

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  status: EnrollmentStatus | string;
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

// Board Types
export enum BoardType {
  NOTICE = 'NOTICE',
  QNA = 'QNA',
  FAQ = 'FAQ'
}

export interface Post {
  id: number;
  title: string;
  content: string;
  boardType: BoardType;
  isNotice: boolean;
  isSecret: boolean;
  viewCount: number;
  authorName: string;
  authorId: number;
  attachments: FileAttachment[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: number;
  originalFileName: string;
  downloadUrl: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
  boardType: BoardType;
  isNotice?: boolean;
  isSecret?: boolean;
}

export interface PostListRequest {
  page?: number;
  size?: number;
  keyword?: string;
}

export interface PostListResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Response Type
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}