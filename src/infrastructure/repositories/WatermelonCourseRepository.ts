import { Q } from '@nozbe/watermelondb';
import { database } from '../storage/watermelon';
import {
  Course as CourseModel,
  Module as ModuleModel,
  Lesson as LessonModel,
} from '../storage/watermelon/models';
import { ICourseRepository } from '../../domain/repositories/interfaces';
import { Course, Module, Lesson } from '../../domain/entities';

export class WatermelonCourseRepository implements ICourseRepository {
  private coursesCollection = database.get<CourseModel>('courses');
  private modulesCollection = database.get<ModuleModel>('modules');
  private lessonsCollection = database.get<LessonModel>('lessons');

  async getAll(): Promise<Course[]> {
    const models = await this.coursesCollection.query().fetch();
    return models.map(this.mapCourse);
  }

  async getById(id: string): Promise<Course | null> {
    try {
      const model = await this.coursesCollection.find(id);
      return this.mapCourse(model);
    } catch {
      return null;
    }
  }

  async getModulesByCourseId(courseId: string): Promise<Module[]> {
    const models = await this.modulesCollection
      .query(Q.where('course_id', courseId), Q.sortBy('order', Q.asc))
      .fetch();
    return models.map(this.mapModule);
  }

  async getLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    const models = await this.lessonsCollection
      .query(Q.where('module_id', moduleId), Q.sortBy('order', Q.asc))
      .fetch();
    return models.map(this.mapLesson);
  }

  async saveCourses(courses: Course[]): Promise<void> {
    await database.write(async () => {
      for (const course of courses) {
        await this.coursesCollection.create((model) => {
          model._raw.id = course.id;
          model.title = course.title;
          model.description = course.description;
          model.thumbnail = course.thumbnail;
          model.category = course.category;
          model.duration = course.duration;
          model.studentsCount = course.studentsCount;
          model.instructorName = course.instructorName;
          model.instructorAvatar = course.instructorAvatar;
          model.isSequential = course.isSequential;
        });
      }
    });
  }

  private mapCourse(model: CourseModel): Course {
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      thumbnail: model.thumbnail,
      category: model.category,
      duration: model.duration,
      studentsCount: model.studentsCount,
      instructorName: model.instructorName,
      instructorAvatar: model.instructorAvatar,
      isSequential: model.isSequential,
    };
  }

  private mapModule(model: ModuleModel): Module {
    return {
      id: model.id,
      courseId: model.courseId,
      title: model.title,
      duration: model.duration,
      order: model.order,
    };
  }

  private mapLesson(model: LessonModel): Lesson {
    return {
      id: model.id,
      moduleId: model.moduleId,
      title: model.title,
      type: model.type,
      duration: model.duration,
      description: model.description,
      videoUrl: model.videoUrl,
      audioUrl: model.audioUrl,
      resourceUrl: model.resourceUrl,
      order: model.order,
    };
  }
}
