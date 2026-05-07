export type QuestionType = 'multiple-choice' | 'true-false' | 'text' | 'sequence' | 'fill-in-blank';

export interface Answer {
  type?: 'text' | 'image';
  content: string;
  is_correct?: boolean;
  order?: number;
  blank_position?: number;
  feedback?: string;
  options?: string[];
}

export interface QuizQuestion {
  id?: string;
  title: string;
  type: QuestionType;
  timer?: number;
  allowMultipleAnswers?: boolean;
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  moduleId: string;
  questions: QuizQuestion[];
  duration: number;
  passingScore: number;
}
