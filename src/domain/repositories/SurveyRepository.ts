import { Survey, SurveyStatus, SurveyQuestion, SurveyResponse } from '../entities/Survey';

export interface SurveyRepository {
  findById(id: string): Promise<Survey | null>;
  findByStatus(status: SurveyStatus): Promise<Survey[]>;
  findByCourseId(courseId: string): Promise<Survey[]>;
  findByTargetAudience(audience: string): Promise<Survey[]>;
  findActive(): Promise<Survey[]>;
  create(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey>;
  update(id: string, survey: Partial<Survey>): Promise<Survey>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ surveys: Survey[]; total: number }>;
}

export interface SurveyQuestionRepository {
  findById(id: string): Promise<SurveyQuestion | null>;
  findBySurveyId(surveyId: string): Promise<SurveyQuestion[]>;
  create(question: Omit<SurveyQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<SurveyQuestion>;
  update(id: string, question: Partial<SurveyQuestion>): Promise<SurveyQuestion>;
  delete(id: string): Promise<void>;
  reorderQuestions(surveyId: string, questionIds: string[]): Promise<void>;
  bulkCreate(questions: Omit<SurveyQuestion, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<SurveyQuestion[]>;
}

export interface SurveyResponseRepository {
  findById(id: string): Promise<SurveyResponse | null>;
  findBySurveyId(surveyId: string): Promise<SurveyResponse[]>;
  findByRespondentId(respondentId: string): Promise<SurveyResponse[]>;
  create(response: Omit<SurveyResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<SurveyResponse>;
  update(id: string, response: Partial<SurveyResponse>): Promise<SurveyResponse>;
  delete(id: string): Promise<void>;
  getResponseCount(surveyId: string): Promise<number>;
  findResponsesByDateRange(surveyId: string, startDate: Date, endDate: Date): Promise<SurveyResponse[]>;
  generateStatistics(surveyId: string): Promise<any>;
}