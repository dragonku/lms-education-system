import { Course, CourseStatus, CourseType, CourseSession, CourseModule } from '../entities/Course';

export interface CourseRepository {
  findById(id: string): Promise<Course | null>;
  findByStatus(status: CourseStatus): Promise<Course[]>;
  findByType(courseType: CourseType): Promise<Course[]>;
  findByCategory(category: string): Promise<Course[]>;
  create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course>;
  update(id: string, course: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ courses: Course[]; total: number }>;
  searchByTitle(title: string): Promise<Course[]>;
  findByInstructor(instructorId: string): Promise<Course[]>;
}

export interface CourseSessionRepository {
  findById(id: string): Promise<CourseSession | null>;
  findByCourseId(courseId: string): Promise<CourseSession[]>;
  findByInstructorId(instructorId: string): Promise<CourseSession[]>;
  findByStatus(status: string): Promise<CourseSession[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<CourseSession[]>;
  create(session: Omit<CourseSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<CourseSession>;
  update(id: string, session: Partial<CourseSession>): Promise<CourseSession>;
  delete(id: string): Promise<void>;
}

export interface CourseModuleRepository {
  findById(id: string): Promise<CourseModule | null>;
  findByCourseId(courseId: string): Promise<CourseModule[]>;
  create(module: Omit<CourseModule, 'id' | 'createdAt' | 'updatedAt'>): Promise<CourseModule>;
  update(id: string, module: Partial<CourseModule>): Promise<CourseModule>;
  delete(id: string): Promise<void>;
  reorderModules(courseId: string, moduleIds: string[]): Promise<void>;
}