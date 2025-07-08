export enum SurveyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SCALE_RATING = 'scale_rating',
  SHORT_ANSWER = 'short_answer',
  LONG_ANSWER = 'long_answer'
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  targetAudience: string[];
  courseId?: string;
  startDate: Date;
  endDate: Date;
  isAnonymous: boolean;
  maxResponses?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyQuestion {
  id: string;
  surveyId: string;
  questionType: QuestionType;
  questionText: string;
  options?: string[];
  isRequired: boolean;
  order: number;
  minRating?: number;
  maxRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  answers: SurveyAnswer[];
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyAnswer {
  questionId: string;
  answer: string;
  selectedOptions?: string[];
  rating?: number;
}