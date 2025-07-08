import { EnrollmentRepository } from '../../../domain/repositories/EnrollmentRepository';
import { CourseSessionRepository } from '../../../domain/repositories/CourseRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { Enrollment, EnrollmentStatus } from '../../../domain/entities/Enrollment';
import { UserType } from '../../../domain/entities/User';
import { v4 as uuidv4 } from 'uuid';

export interface EnrollStudentDTO {
  studentId: string;
  courseSessionId: string;
  notes?: string;
}

export class EnrollStudentUseCase {
  constructor(
    private enrollmentRepository: EnrollmentRepository,
    private courseSessionRepository: CourseSessionRepository,
    private userRepository: UserRepository
  ) {}

  async execute(enrollmentData: EnrollStudentDTO): Promise<Enrollment> {
    const student = await this.userRepository.findById(enrollmentData.studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    if (student.userType !== UserType.STUDENT) {
      throw new Error('Only students can enroll in courses');
    }

    const courseSession = await this.courseSessionRepository.findById(enrollmentData.courseSessionId);
    if (!courseSession) {
      throw new Error('Course session not found');
    }

    const existingEnrollment = await this.enrollmentRepository.findByStudentAndSession(
      enrollmentData.studentId,
      enrollmentData.courseSessionId
    );

    if (existingEnrollment) {
      throw new Error('Student is already enrolled in this course session');
    }

    if (courseSession.currentStudents >= courseSession.maxStudents) {
      throw new Error('Course session is full');
    }

    const enrollment: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'> = {
      studentId: enrollmentData.studentId,
      courseSessionId: enrollmentData.courseSessionId,
      status: EnrollmentStatus.PENDING,
      appliedAt: new Date(),
      notes: enrollmentData.notes,
    };

    const createdEnrollment = await this.enrollmentRepository.create(enrollment);
    
    return createdEnrollment;
  }
}