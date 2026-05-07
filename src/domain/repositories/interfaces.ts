import { Course, Lesson, Module, Student, StudentProgress, QuizScore } from '../entities';

export interface ICourseRepository {
  getAll(): Promise<Course[]>;
  getById(id: string): Promise<Course | null>;
  getModulesByCourseId(courseId: string): Promise<Module[]>;
  getLessonsByModuleId(moduleId: string): Promise<Lesson[]>;
  saveCourses(courses: Course[]): Promise<void>;
}

export interface IStudentRepository {
  getProfile(id: string): Promise<Student | null>;
  getProgress(studentId: string, courseId: string): Promise<StudentProgress | null>;
  updateProgress(progress: Partial<StudentProgress>): Promise<void>;
  getCompletedLessons(studentId: string, courseId: string): Promise<string[]>;
  markLessonAsCompleted(studentId: string, courseId: string, lessonId: string): Promise<void>;
  saveQuizScore(score: Omit<QuizScore, 'id'>): Promise<void>;
  getQuizScores(studentId: string, courseId: string): Promise<QuizScore[]>;
}

export interface ISettingsRepository {
  getSetting<T>(key: string): T | null;
  saveSetting(key: string, value: any): void;
  removeSetting(key: string): void;
}
