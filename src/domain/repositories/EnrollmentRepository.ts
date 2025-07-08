import { Enrollment, EnrollmentStatus, Attendance, Grade } from '../entities/Enrollment';

export interface EnrollmentRepository {
  findById(id: string): Promise<Enrollment | null>;
  findByStudentId(studentId: string): Promise<Enrollment[]>;
  findByCourseSessionId(courseSessionId: string): Promise<Enrollment[]>;
  findByStatus(status: EnrollmentStatus): Promise<Enrollment[]>;
  findByStudentAndSession(studentId: string, courseSessionId: string): Promise<Enrollment | null>;
  create(enrollment: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Enrollment>;
  update(id: string, enrollment: Partial<Enrollment>): Promise<Enrollment>;
  delete(id: string): Promise<void>;
  findPendingApprovals(): Promise<Enrollment[]>;
  bulkUpdateStatus(enrollmentIds: string[], status: EnrollmentStatus, updatedBy: string): Promise<void>;
}

export interface AttendanceRepository {
  findById(id: string): Promise<Attendance | null>;
  findByEnrollmentId(enrollmentId: string): Promise<Attendance[]>;
  findBySessionDate(sessionDate: Date): Promise<Attendance[]>;
  create(attendance: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendance>;
  update(id: string, attendance: Partial<Attendance>): Promise<Attendance>;
  delete(id: string): Promise<void>;
  bulkCreateAttendance(attendances: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Attendance[]>;
}

export interface GradeRepository {
  findById(id: string): Promise<Grade | null>;
  findByEnrollmentId(enrollmentId: string): Promise<Grade[]>;
  findByAssessmentId(assessmentId: string): Promise<Grade[]>;
  create(grade: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Grade>;
  update(id: string, grade: Partial<Grade>): Promise<Grade>;
  delete(id: string): Promise<void>;
  calculateFinalGrade(enrollmentId: string): Promise<number>;
}