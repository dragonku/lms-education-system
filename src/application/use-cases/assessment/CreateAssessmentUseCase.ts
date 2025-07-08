import { AssessmentRepository } from '../../../domain/repositories/AssessmentRepository';
import { Assessment, AssessmentType } from '../../../domain/entities/Assessment';
import { v4 as uuidv4 } from 'uuid';

export interface CreateAssessmentDTO {
  courseId: string;
  title: string;
  description: string;
  assessmentType: AssessmentType;
  maxScore: number;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
  showResults: boolean;
  showCorrectAnswers: boolean;
  availableFrom: Date;
  availableUntil: Date;
  questionIds: string[];
}

export class CreateAssessmentUseCase {
  constructor(private assessmentRepository: AssessmentRepository) {}

  async execute(assessmentData: CreateAssessmentDTO, createdBy: string): Promise<Assessment> {
    if (assessmentData.passingScore > assessmentData.maxScore) {
      throw new Error('Passing score cannot be greater than maximum score');
    }

    if (assessmentData.availableFrom >= assessmentData.availableUntil) {
      throw new Error('Available from date must be before available until date');
    }

    if (assessmentData.questionIds.length === 0) {
      throw new Error('Assessment must have at least one question');
    }

    const assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'> = {
      courseId: assessmentData.courseId,
      title: assessmentData.title,
      description: assessmentData.description,
      assessmentType: assessmentData.assessmentType,
      maxScore: assessmentData.maxScore,
      passingScore: assessmentData.passingScore,
      timeLimit: assessmentData.timeLimit,
      maxAttempts: assessmentData.maxAttempts,
      showResults: assessmentData.showResults,
      showCorrectAnswers: assessmentData.showCorrectAnswers,
      availableFrom: assessmentData.availableFrom,
      availableUntil: assessmentData.availableUntil,
      questionIds: assessmentData.questionIds,
      createdBy,
    };

    const createdAssessment = await this.assessmentRepository.create(assessment);
    return createdAssessment;
  }
}