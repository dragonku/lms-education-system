export enum UserType {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  COMPANY_PARTNER = 'company_partner'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_APPROVAL = 'pending_approval'
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  userType: UserType;
  status: UserStatus;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile {
  userId: string;
  employmentStatus: 'employed' | 'unemployed';
  company?: string;
  jobTitle?: string;
  education?: string;
  experience?: string;
}

export interface InstructorProfile {
  userId: string;
  specialties: string[];
  certifications: string[];
  experience: string;
  bio?: string;
  averageRating?: number;
}

export interface CompanyPartnerProfile {
  userId: string;
  companyId: string;
  position: string;
  department?: string;
  isMainContact: boolean;
}