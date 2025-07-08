export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum CourseType {
  EMPLOYEE_TRAINING = 'employee_training',
  JOB_SEEKER_TRAINING = 'job_seeker_training',
  GENERAL = 'general'
}

export interface Course {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  prerequisites?: string[];
  duration: number; // in hours
  maxStudents: number;
  minStudents: number;
  courseType: CourseType;
  status: CourseStatus;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseSession {
  id: string;
  courseId: string;
  sessionNumber: number;
  startDate: Date;
  endDate: Date;
  instructorId: string;
  maxStudents: number;
  currentStudents: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number; // in minutes
  materials: string[];
  learningObjectives: string[];
  createdAt: Date;
  updatedAt: Date;
}