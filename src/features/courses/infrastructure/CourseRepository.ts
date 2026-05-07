import { Course } from '@/domain/entities/Course';
import { ICourseRepository } from '@/domain/repositories/ICourseRepository';
import { mockCourses } from '@/data/mockData';

export class CourseRepository implements ICourseRepository {
  async getCourses(): Promise<Course[]> {
    // In production: return database.get('courses').query().fetch()
    return mockCourses;
  }

  async getCourseById(id: string): Promise<Course | null> {
    const course = mockCourses.find((c) => c.id === id);
    return course || null;
  }

  async syncCourses(): Promise<void> {
    // Fetch from API and update WatermelonDB
  }
}
