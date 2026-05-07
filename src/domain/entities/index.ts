export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  school?: string;
  grade?: string;
  enrolledCourseIds: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: number;
  studentsCount: number;
  instructorName: string;
  instructorAvatar: string;
  isSequential: boolean;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  duration: number;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: string;
  duration: number;
  description?: string;
  videoUrl?: string;
  audioUrl?: string;
  resourceUrl?: string;
  order: number;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  lastAccessed: string;
  currentLessonId?: string;
}

export interface CompletedLesson {
  studentId: string;
  lessonId: string;
  courseId: string;
}

export interface QuizScore {
  id: string;
  studentId: string;
  quizId: string;
  moduleId: string;
  score: number;
  completedAt: string;
  attemptNumber: number;
}
