import { Q } from '@nozbe/watermelondb';
import { database } from '../storage/watermelon';
import {
  Student as StudentModel,
  StudentProgress as ProgressModel,
  CompletedLesson as CompletedLessonModel,
  QuizScore as QuizScoreModel,
} from '../storage/watermelon/models';
import { IStudentRepository } from '../../domain/repositories/interfaces';
import { Student, StudentProgress, QuizScore } from '../../domain/entities';

export class WatermelonStudentRepository implements IStudentRepository {
  private studentsCollection = database.get<StudentModel>('students');
  private progressCollection = database.get<ProgressModel>('student_progress');
  private completedLessonsCollection = database.get<CompletedLessonModel>('completed_lessons');
  private quizScoresCollection = database.get<QuizScoreModel>('quiz_scores');
  private enrollmentsCollection = database.get<any>('enrollments');

  async getProfile(id: string): Promise<Student | null> {
    try {
      const model = await this.studentsCollection.find(id);
      const enrollments = await this.enrollmentsCollection.query(Q.where('student_id', id)).fetch();

      return {
        id: model.id,
        name: model.name,
        email: model.email,
        avatar: model.avatar,
        school: model.school,
        grade: model.grade,
        enrolledCourseIds: enrollments.map((e: any) => e.courseId),
      };
    } catch {
      return null;
    }
  }

  async getProgress(studentId: string, courseId: string): Promise<StudentProgress | null> {
    const models = await this.progressCollection
      .query(Q.where('student_id', studentId), Q.where('course_id', courseId))
      .fetch();

    if (models.length === 0) return null;
    const model = models[0];

    return {
      id: model.id,
      studentId: model.studentId,
      courseId: model.courseId,
      progress: model.progress,
      lastAccessed: model.lastAccessed,
      currentLessonId: model.currentLessonId,
    };
  }

  async updateProgress(
    progress: Partial<StudentProgress> & { studentId: string; courseId: string },
  ): Promise<void> {
    await database.write(async () => {
      const existing = await this.progressCollection
        .query(Q.where('student_id', progress.studentId), Q.where('course_id', progress.courseId))
        .fetch();

      if (existing.length > 0) {
        await existing[0].update((model) => {
          if (progress.progress !== undefined) model.progress = progress.progress;
          if (progress.lastAccessed) model.lastAccessed = progress.lastAccessed;
          if (progress.currentLessonId) model.currentLessonId = progress.currentLessonId;
        });
      } else {
        await this.progressCollection.create((model) => {
          model.studentId = progress.studentId;
          model.courseId = progress.courseId;
          model.progress = progress.progress || 0;
          model.lastAccessed = progress.lastAccessed || new Date().toISOString();
          model.currentLessonId = progress.currentLessonId;
        });
      }
    });
  }

  async getCompletedLessons(studentId: string, courseId: string): Promise<string[]> {
    const models = await this.completedLessonsCollection
      .query(Q.where('student_id', studentId), Q.where('course_id', courseId))
      .fetch();
    return models.map((m) => m.lessonId);
  }

  async markLessonAsCompleted(
    studentId: string,
    courseId: string,
    lessonId: string,
  ): Promise<void> {
    await database.write(async () => {
      const existing = await this.completedLessonsCollection
        .query(Q.where('student_id', studentId), Q.where('lesson_id', lessonId))
        .fetch();

      if (existing.length === 0) {
        await this.completedLessonsCollection.create((model) => {
          model.studentId = studentId;
          model.courseId = courseId;
          model.lessonId = lessonId;
        });
      }
    });
  }

  async saveQuizScore(score: Omit<QuizScore, 'id'>): Promise<void> {
    await database.write(async () => {
      await this.quizScoresCollection.create((model) => {
        model.studentId = score.studentId;
        model.quizId = score.quizId;
        model.moduleId = score.moduleId;
        model.score = score.score;
        model.completedAt = score.completedAt;
        model.attemptNumber = score.attemptNumber;
      });
    });
  }

  async getQuizScores(studentId: string, courseId: string): Promise<QuizScore[]> {
    // In a real app, we might need a join or a more complex query if scores aren't directly linked to courseId
    // For now, we assume we can filter by student
    const models = await this.quizScoresCollection.query(Q.where('student_id', studentId)).fetch();

    return models.map((model) => ({
      id: model.id,
      studentId: model.studentId,
      quizId: model.quizId,
      moduleId: model.moduleId,
      score: model.score,
      completedAt: model.completedAt,
      attemptNumber: model.attemptNumber,
    }));
  }
}
