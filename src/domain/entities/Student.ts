export interface StudentProgress {
  studentId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  currentLessonId?: string;
  lastAccessed: string;
}

export interface QuizScore {
  quizId: string;
  moduleId: string;
  score: number;
  completedAt: string;
  attemptNumber: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: string[];
  school: string;
  grade: string;
}
