import { getDatabase } from '../storage/sqlite';
import { IStudentRepository } from '../../domain/repositories/interfaces';
import { Student, StudentProgress, QuizScore } from '../../domain/entities';

export class SQLiteStudentRepository implements IStudentRepository {
  async getProfile(id: string): Promise<Student | null> {
    const db = await getDatabase();
    const student = await db.getFirstAsync<any>('SELECT * FROM students WHERE id = ?', [id]);
    if (!student) return null;

    const enrollments = await db.getAllAsync<any>(
      'SELECT course_id FROM enrollments WHERE student_id = ?',
      [id],
    );

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      school: student.school,
      grade: student.grade,
      enrolledCourseIds: enrollments.map((e) => e.course_id),
    };
  }

  async getProgress(studentId: string, courseId: string): Promise<StudentProgress | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>(
      'SELECT * FROM student_progress WHERE student_id = ? AND course_id = ?',
      [studentId, courseId],
    );

    if (!result) return null;

    return {
      id: result.id,
      studentId: result.student_id,
      courseId: result.course_id,
      progress: result.progress,
      lastAccessed: result.last_accessed,
      currentLessonId: result.current_lesson_id,
    };
  }

  async updateProgress(
    progress: Partial<StudentProgress> & { studentId: string; courseId: string },
  ): Promise<void> {
    const db = await getDatabase();
    const existing = await this.getProgress(progress.studentId, progress.courseId);

    if (existing) {
      await db.runAsync(
        `UPDATE student_progress SET 
          progress = COALESCE(?, progress), 
          last_accessed = COALESCE(?, last_accessed), 
          current_lesson_id = COALESCE(?, current_lesson_id)
        WHERE student_id = ? AND course_id = ?`,
        [
          progress.progress ?? null,
          progress.lastAccessed ?? null,
          progress.currentLessonId ?? null,
          progress.studentId,
          progress.courseId,
        ],
      );
    } else {
      await db.runAsync(
        `INSERT INTO student_progress (id, student_id, course_id, progress, last_accessed, current_lesson_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `${progress.studentId}_${progress.courseId}`, // Simple unique ID
          progress.studentId,
          progress.courseId,
          progress.progress || 0,
          progress.lastAccessed || new Date().toISOString(),
          progress.currentLessonId || null,
        ],
      );
    }
  }

  async getCompletedLessons(studentId: string, courseId: string): Promise<string[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<any>(
      'SELECT lesson_id FROM completed_lessons WHERE student_id = ? AND course_id = ?',
      [studentId, courseId],
    );
    return result.map((r) => r.lesson_id);
  }

  async markLessonAsCompleted(
    studentId: string,
    courseId: string,
    lessonId: string,
  ): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT OR IGNORE INTO completed_lessons (id, student_id, course_id, lesson_id) VALUES (?, ?, ?, ?)',
      [`${studentId}_${lessonId}`, studentId, courseId, lessonId],
    );
  }

  async saveQuizScore(score: Omit<QuizScore, 'id'>): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO quiz_scores (id, student_id, quiz_id, module_id, score, completed_at, attempt_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `qs_${Date.now()}`,
        score.studentId,
        score.quizId,
        score.moduleId,
        score.score,
        score.completedAt,
        score.attemptNumber,
      ],
    );
  }

  async getQuizScores(studentId: string, courseId: string): Promise<QuizScore[]> {
    const db = await getDatabase();
    // Assuming we can filter by student for now as in the original
    const result = await db.getAllAsync<any>('SELECT * FROM quiz_scores WHERE student_id = ?', [
      studentId,
    ]);

    return result.map((row) => ({
      id: row.id,
      studentId: row.student_id,
      quizId: row.quiz_id,
      moduleId: row.module_id,
      score: row.score,
      completedAt: row.completed_at,
      attemptNumber: row.attempt_number,
    }));
  }
}
