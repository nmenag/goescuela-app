import { getDatabase } from '../storage/sqlite';
import { ICourseRepository } from '../../domain/repositories/interfaces';
import { Course, Module, Lesson } from '../../domain/entities';

export class SQLiteCourseRepository implements ICourseRepository {
  async getAll(): Promise<Course[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<any>('SELECT * FROM courses');
    return result.map(this.mapCourse);
  }

  async getById(id: string): Promise<Course | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>('SELECT * FROM courses WHERE id = ?', [id]);
    return result ? this.mapCourse(result) : null;
  }

  async getModulesByCourseId(courseId: string): Promise<Module[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<any>(
      'SELECT * FROM modules WHERE course_id = ? ORDER BY "order" ASC',
      [courseId],
    );
    return result.map(this.mapModule);
  }

  async getLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<any>(
      'SELECT * FROM lessons WHERE module_id = ? ORDER BY "order" ASC',
      [moduleId],
    );
    return result.map(this.mapLesson);
  }

  async saveCourses(courses: Course[]): Promise<void> {
    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      for (const course of courses) {
        await db.runAsync(
          `INSERT OR REPLACE INTO courses (
            id, title, description, thumbnail, category, 
            duration, students_count, instructor_name, instructor_avatar, is_sequential
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            course.id,
            course.title,
            course.description,
            course.thumbnail,
            course.category,
            course.duration,
            course.studentsCount,
            course.instructorName,
            course.instructorAvatar,
            course.isSequential ? 1 : 0,
          ],
        );
      }
    });
  }

  private mapCourse(row: any): Course {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      thumbnail: row.thumbnail,
      category: row.category,
      duration: row.duration,
      studentsCount: row.students_count,
      instructorName: row.instructor_name,
      instructorAvatar: row.instructor_avatar,
      isSequential: Boolean(row.is_sequential),
    };
  }

  private mapModule(row: any): Module {
    return {
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      duration: row.duration,
      order: row.order,
    };
  }

  private mapLesson(row: any): Lesson {
    return {
      id: row.id,
      moduleId: row.module_id,
      title: row.title,
      type: row.type,
      duration: row.duration,
      description: row.description,
      videoUrl: row.video_url,
      audioUrl: row.audio_url,
      resourceUrl: row.resource_url,
      order: row.order,
    };
  }
}
