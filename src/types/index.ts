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

// API Response Type
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}