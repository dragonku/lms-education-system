export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay'
}

export enum AssessmentType {
  QUIZ = 'quiz',
  MIDTERM = 'midterm',
  FINAL = 'final',
  ASSIGNMENT = 'assignment'
}

export interface Question {
  id: string;
  courseId: string;
  questionType: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  assessmentType: AssessmentType;
  maxScore: number;
  passingScore: number;
  timeLimit: number; // in minutes
  maxAttempts: number;
  showResults: boolean;
  showCorrectAnswers: boolean;
  availableFrom: Date;
  availableUntil: Date;
  questionIds: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttemptAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  score: number;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  attemptNumber: number;
  startedAt: Date;
  submittedAt?: Date;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: AttemptAnswer[];
  timeSpent: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}