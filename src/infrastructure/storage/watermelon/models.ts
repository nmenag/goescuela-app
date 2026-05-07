import { Model } from '@nozbe/watermelondb';
import { field, relation, children, date, readonly } from '@nozbe/watermelondb/decorators';

export class Student extends Model {
  static table = 'students';
  static associations = {
    student_progress: { type: 'has_many', foreignKey: 'student_id' },
    completed_lessons: { type: 'has_many', foreignKey: 'student_id' },
    quiz_scores: { type: 'has_many', foreignKey: 'student_id' },
  } as const;

  @field('name') name!: string;
  @field('email') email!: string;
  @field('avatar') avatar?: string;
  @field('school') school?: string;
  @field('grade') grade?: string;

  @children('student_progress') progresses!: any;
  @children('completed_lessons') completedLessons!: any;
  @children('quiz_scores') quizScores!: any;
}

export class Course extends Model {
  static table = 'courses';
  static associations = {
    modules: { type: 'has_many', foreignKey: 'course_id' },
    student_progress: { type: 'has_many', foreignKey: 'course_id' },
  } as const;

  @field('title') title!: string;
  @field('description') description!: string;
  @field('thumbnail') thumbnail!: string;
  @field('category') category!: string;
  @field('duration') duration!: number;
  @field('students_count') studentsCount!: number;
  @field('instructor_name') instructorName!: string;
  @field('instructor_avatar') instructorAvatar!: string;
  @field('is_sequential') isSequential!: boolean;

  @children('modules') modules!: any;
}

export class Module extends Model {
  static table = 'modules';
  static associations = {
    courses: { type: 'belongs_to', key: 'course_id' },
    lessons: { type: 'has_many', foreignKey: 'module_id' },
  } as const;

  @field('course_id') courseId!: string;
  @field('title') title!: string;
  @field('duration') duration!: number;
  @field('order') order!: number;

  @relation('courses', 'course_id') course!: any;
  @children('lessons') lessons!: any;
}

export class Lesson extends Model {
  static table = 'lessons';
  static associations = {
    modules: { type: 'belongs_to', key: 'module_id' },
  } as const;

  @field('module_id') moduleId!: string;
  @field('title') title!: string;
  @field('type') type!: string;
  @field('duration') duration!: number;
  @field('description') description?: string;
  @field('video_url') videoUrl?: string;
  @field('audio_url') audioUrl?: string;
  @field('resource_url') resourceUrl?: string;
  @field('order') order!: number;

  @relation('modules', 'module_id') module!: any;
}

export class StudentProgress extends Model {
  static table = 'student_progress';
  static associations = {
    students: { type: 'belongs_to', key: 'student_id' },
    courses: { type: 'belongs_to', key: 'course_id' },
  } as const;

  @field('student_id') studentId!: string;
  @field('course_id') courseId!: string;
  @field('progress') progress!: number;
  @field('last_accessed') lastAccessed!: string;
  @field('current_lesson_id') currentLessonId?: string;

  @relation('students', 'student_id') student!: any;
  @relation('courses', 'course_id') course!: any;
}

export class CompletedLesson extends Model {
  static table = 'completed_lessons';
  static associations = {
    students: { type: 'belongs_to', key: 'student_id' },
    lessons: { type: 'belongs_to', key: 'lesson_id' },
  } as const;

  @field('student_id') studentId!: string;
  @field('lesson_id') lessonId!: string;
  @field('course_id') courseId!: string;

  @relation('students', 'student_id') student!: any;
  @relation('lessons', 'lesson_id') lesson!: any;
}

export class QuizScore extends Model {
  static table = 'quiz_scores';
  static associations = {
    students: { type: 'belongs_to', key: 'student_id' },
  } as const;

  @field('student_id') studentId!: string;
  @field('quiz_id') quizId!: string;
  @field('module_id') moduleId!: string;
  @field('score') score!: number;
  @field('completed_at') completedAt!: string;
  @field('attempt_number') attemptNumber!: number;

  @relation('students', 'student_id') student!: any;
}
