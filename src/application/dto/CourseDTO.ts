import { CourseType, CourseStatus } from '../../domain/entities/Course';

export interface CreateCourseDTO {
  title: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  prerequisites?: string[];
  duration: number;
  maxStudents: number;
  minStudents: number;
  courseType: CourseType;
  category: string;
  tags: string[];
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string;
  objectives?: string[];
  targetAudience?: string;
  prerequisites?: string[];
  duration?: number;
  maxStudents?: number;
  minStudents?: number;
  category?: string;
  tags?: string[];
}

export interface CourseResponseDTO {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  prerequisites?: string[];
  duration: number;
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

export interface CreateCourseSessionDTO {
  courseId: string;
  sessionNumber: number;
  startDate: Date;
  endDate: Date;
  instructorId: string;
  maxStudents: number;
  location?: string;
  notes?: string;
}

export interface CourseSessionResponseDTO {
  id: string;
  courseId: string;
  sessionNumber: number;
  startDate: Date;
  endDate: Date;
  instructorId: string;
  maxStudents: number;
  currentStudents: number;
  status: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}