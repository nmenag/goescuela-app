import { getDatabase } from '../../infrastructure/storage/sqlite';
import { mockCourses, mockStudents } from '@/data/mockData';

export const SeedingService = {
  seed: async () => {
    const db = await getDatabase();

    const studentCount = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM students',
    );
    if (studentCount && studentCount.count > 0) return;

    await db.withTransactionAsync(async () => {
      // 1. Seed Student
      const student = mockStudents[0];
      await db.runAsync(
        'INSERT INTO students (id, name, email, avatar, school, grade) VALUES (?, ?, ?, ?, ?, ?)',
        [
          student.id,
          student.name,
          student.email,
          student.avatar || null,
          student.school || null,
          student.grade || null,
        ],
      );

      // 2. Seed Courses, Modules, Lessons
      for (const course of mockCourses) {
        await db.runAsync(
          `INSERT INTO courses (
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
            course.students,
            course.instructor.name,
            course.instructor.avatar,
            course.sequential ? 1 : 0,
          ],
        );

        for (let i = 0; i < course.modules.length; i++) {
          const mod = course.modules[i];
          await db.runAsync(
            'INSERT INTO modules (id, course_id, title, duration, "order") VALUES (?, ?, ?, ?, ?)',
            [mod.id, course.id, mod.title, mod.duration, i],
          );

          for (let j = 0; j < mod.lessons.length; j++) {
            const lesson = mod.lessons[j];
            await db.runAsync(
              `INSERT INTO lessons (
                id, module_id, title, type, duration, description, 
                video_url, audio_url, resource_url, "order"
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                lesson.id,
                mod.id,
                lesson.title,
                lesson.type,
                lesson.duration,
                lesson.description || null,
                lesson.videoUrl || null,
                lesson.audioUrl || null,
                lesson.resourceUrl || null,
                j,
              ],
            );
          }
        }
      }

      // 3. Seed Progress
      for (const progress of student.progress) {
        await db.runAsync(
          'INSERT INTO student_progress (id, student_id, course_id, progress, last_accessed, current_lesson_id) VALUES (?, ?, ?, ?, ?, ?)',
          [
            `${student.id}_${progress.courseId}`,
            student.id,
            progress.courseId,
            progress.progress,
            progress.lastAccessed,
            progress.currentLessonId || null,
          ],
        );
      }

      // 4. Seed Completed Lessons
      for (const progress of student.progress) {
        for (const lessonId of progress.completedLessons) {
          await db.runAsync(
            'INSERT INTO completed_lessons (id, student_id, course_id, lesson_id) VALUES (?, ?, ?, ?)',
            [`${student.id}_${lessonId}`, student.id, progress.courseId, lessonId],
          );
        }
      }

      // 5. Seed Enrollments
      for (const courseId of student.enrolledCourses) {
        await db.runAsync('INSERT INTO enrollments (id, student_id, course_id) VALUES (?, ?, ?)', [
          `${student.id}_${courseId}`,
          student.id,
          courseId,
        ]);
      }
    });
  },
};
