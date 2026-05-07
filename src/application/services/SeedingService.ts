import { database } from '../../infrastructure/storage/watermelon';
import { mockCourses, mockStudents } from '@/data/mockData';
import { StorageService } from '../../infrastructure/storage/mmkv';

export const SeedingService = {
  seed: async () => {
    const isSeeded = StorageService.getItem<boolean>('is_seeded');
    if (isSeeded) return;

    await database.write(async () => {
      // 1. Seed Student
      const student = mockStudents[0];
      const studentCollection = database.get('students');
      await studentCollection.create((model: any) => {
        model._raw.id = student.id;
        model.name = student.name;
        model.email = student.email;
        model.avatar = student.avatar;
        model.school = student.school;
        model.grade = student.grade;
      });

      // 2. Seed Courses, Modules, Lessons
      const courseCollection = database.get('courses');
      const moduleCollection = database.get('modules');
      const lessonCollection = database.get('lessons');

      for (const course of mockCourses) {
        await courseCollection.create((model: any) => {
          model._raw.id = course.id;
          model.title = course.title;
          model.description = course.description;
          model.thumbnail = course.thumbnail;
          model.category = course.category;
          model.duration = course.duration;
          model.studentsCount = course.students;
          model.instructorName = course.instructor.name;
          model.instructorAvatar = course.instructor.avatar;
          model.isSequential = course.sequential || false;
        });

        for (let i = 0; i < course.modules.length; i++) {
          const mod = course.modules[i];
          await moduleCollection.create((model: any) => {
            model._raw.id = mod.id;
            model.courseId = course.id;
            model.title = mod.title;
            model.duration = mod.duration;
            model.order = i;
          });

          for (let j = 0; j < mod.lessons.length; j++) {
            const lesson = mod.lessons[j];
            await lessonCollection.create((model: any) => {
              model._raw.id = lesson.id;
              model.moduleId = mod.id;
              model.title = lesson.title;
              model.type = lesson.type;
              model.duration = lesson.duration;
              model.description = lesson.description;
              model.videoUrl = lesson.videoUrl;
              model.audioUrl = lesson.audioUrl;
              model.resourceUrl = lesson.resourceUrl;
              model.order = j;
            });
          }
        }
      }

      // 3. Seed Progress
      const progressCollection = database.get('student_progress');
      for (const progress of student.progress) {
        await progressCollection.create((model: any) => {
          model.studentId = student.id;
          model.courseId = progress.courseId;
          model.progress = progress.progress;
          model.lastAccessed = progress.lastAccessed;
          model.currentLessonId = progress.currentLessonId;
        });
      }

      // 4. Seed Completed Lessons
      const completedCollection = database.get('completed_lessons');
      for (const progress of student.progress) {
        for (const lessonId of progress.completedLessons) {
          await completedCollection.create((model: any) => {
            model.studentId = student.id;
            model.courseId = progress.courseId;
            model.lessonId = lessonId;
          });
        }
      }

      // 5. Seed Enrollments
      const enrollmentCollection = database.get('enrollments');
      for (const courseId of student.enrolledCourses) {
        await enrollmentCollection.create((model: any) => {
          model.studentId = student.id;
          model.courseId = courseId;
        });
      }
    });

    StorageService.setItem('is_seeded', true);
  },
};
