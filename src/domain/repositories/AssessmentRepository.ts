import { Question, QuestionType, Assessment, AssessmentType, AssessmentAttempt } from '../entities/Assessment';

export interface QuestionRepository {
  findById(id: string): Promise<Question | null>;
  findByCourseId(courseId: string): Promise<Question[]>;
  findByType(questionType: QuestionType): Promise<Question[]>;
  findByCategory(category: string): Promise<Question[]>;
  findByDifficulty(difficulty: string): Promise<Question[]>;
  create(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question>;
  update(id: string, question: Partial<Question>): Promise<Question>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ questions: Question[]; total: number }>;
  searchByText(searchText: string): Promise<Question[]>;
  findByTags(tags: string[]): Promise<Question[]>;
}

export interface AssessmentRepository {
  findById(id: string): Promise<Assessment | null>;
  findByCourseId(courseId: string): Promise<Assessment[]>;
  findByType(assessmentType: AssessmentType): Promise<Assessment[]>;
  findAvailableAssessments(studentId: string): Promise<Assessment[]>;
  create(assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Assessment>;
  update(id: string, assessment: Partial<Assessment>): Promise<Assessment>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ assessments: Assessment[]; total: number }>;
}

export interface AssessmentAttemptRepository {
  findById(id: string): Promise<AssessmentAttempt | null>;
  findByAssessmentId(assessmentId: string): Promise<AssessmentAttempt[]>;
  findByStudentId(studentId: string): Promise<AssessmentAttempt[]>;
  findByAssessmentAndStudent(assessmentId: string, studentId: string): Promise<AssessmentAttempt[]>;
  create(attempt: Omit<AssessmentAttempt, 'id' | 'createdAt' | 'updatedAt'>): Promise<AssessmentAttempt>;
  update(id: string, attempt: Partial<AssessmentAttempt>): Promise<AssessmentAttempt>;
  delete(id: string): Promise<void>;
  findBestAttempt(assessmentId: string, studentId: string): Promise<AssessmentAttempt | null>;
  getAttemptCount(assessmentId: string, studentId: string): Promise<number>;
}