export enum EnrollmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseSessionId: string;
  status: EnrollmentStatus;
  appliedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  completedAt?: Date;
  finalGrade?: number;
  certificateIssued?: boolean;
  certificateNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  enrollmentId: string;
  sessionDate: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: string;
  enrollmentId: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  gradedAt: Date;
  gradedBy: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}