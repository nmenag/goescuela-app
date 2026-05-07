import { Course } from '@/domain/entities/Course';

export interface ICourseRepository {
  getCourses(): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | null>;
  syncCourses(): Promise<void>;
}
