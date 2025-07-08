import { Request, Response } from 'express';
import { EnrollStudentUseCase } from '../../application/use-cases/enrollment/EnrollStudentUseCase';
import { ApproveEnrollmentUseCase } from '../../application/use-cases/enrollment/ApproveEnrollmentUseCase';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { EnrollmentRepository } from '../../domain/repositories/EnrollmentRepository';

export class EnrollmentController {
  constructor(
    private enrollStudentUseCase: EnrollStudentUseCase,
    private approveEnrollmentUseCase: ApproveEnrollmentUseCase,
    private enrollmentRepository: EnrollmentRepository
  ) {}

  async enrollStudent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseSessionId, notes } = req.body;
      
      if (!courseSessionId) {
        res.status(400).json({ error: 'Course session ID is required' });
        return;
      }

      const enrollment = await this.enrollStudentUseCase.execute({
        studentId: req.user!.userId,
        courseSessionId,
        notes
      });

      res.status(201).json({
        message: 'Enrollment request submitted successfully',
        data: enrollment
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async approveEnrollment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { enrollmentId } = req.params;
      const { notes } = req.body;
      
      const enrollment = await this.approveEnrollmentUseCase.execute({
        enrollmentId,
        approvedBy: req.user!.userId,
        notes
      });

      res.json({
        message: 'Enrollment approved successfully',
        data: enrollment
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyEnrollments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const enrollments = await this.enrollmentRepository.findByStudentId(req.user!.userId);
      
      res.json({
        message: 'Enrollments retrieved successfully',
        data: enrollments
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPendingEnrollments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const enrollments = await this.enrollmentRepository.findPendingApprovals();
      
      res.json({
        message: 'Pending enrollments retrieved successfully',
        data: enrollments
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEnrollmentsBySession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const enrollments = await this.enrollmentRepository.findByCourseSessionId(sessionId);
      
      res.json({
        message: 'Session enrollments retrieved successfully',
        data: enrollments
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}