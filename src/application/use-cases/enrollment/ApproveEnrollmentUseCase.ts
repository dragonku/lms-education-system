import { EnrollmentRepository } from '../../../domain/repositories/EnrollmentRepository';
import { CourseSessionRepository } from '../../../domain/repositories/CourseRepository';
import { Enrollment, EnrollmentStatus } from '../../../domain/entities/Enrollment';

export interface ApproveEnrollmentDTO {
  enrollmentId: string;
  approvedBy: string;
  notes?: string;
}

export class ApproveEnrollmentUseCase {
  constructor(
    private enrollmentRepository: EnrollmentRepository,
    private courseSessionRepository: CourseSessionRepository
  ) {}

  async execute(approvalData: ApproveEnrollmentDTO): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(approvalData.enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.PENDING) {
      throw new Error('Enrollment is not in pending status');
    }

    const courseSession = await this.courseSessionRepository.findById(enrollment.courseSessionId);
    if (!courseSession) {
      throw new Error('Course session not found');
    }

    if (courseSession.currentStudents >= courseSession.maxStudents) {
      throw new Error('Course session is full');
    }

    const updatedEnrollment = await this.enrollmentRepository.update(
      approvalData.enrollmentId,
      {
        status: EnrollmentStatus.APPROVED,
        approvedAt: new Date(),
        approvedBy: approvalData.approvedBy,
        notes: approvalData.notes,
      }
    );

    await this.courseSessionRepository.update(enrollment.courseSessionId, {
      currentStudents: courseSession.currentStudents + 1,
    });

    return updatedEnrollment;
  }
}