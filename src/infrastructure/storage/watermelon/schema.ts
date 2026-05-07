import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'students',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'avatar', type: 'string', isOptional: true },
        { name: 'school', type: 'string', isOptional: true },
        { name: 'grade', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'courses',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'thumbnail', type: 'string' },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'duration', type: 'number' },
        { name: 'students_count', type: 'number' },
        { name: 'instructor_name', type: 'string' },
        { name: 'instructor_avatar', type: 'string' },
        { name: 'is_sequential', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'modules',
      columns: [
        { name: 'course_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'duration', type: 'number' },
        { name: 'order', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'lessons',
      columns: [
        { name: 'module_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'duration', type: 'number' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'video_url', type: 'string', isOptional: true },
        { name: 'audio_url', type: 'string', isOptional: true },
        { name: 'resource_url', type: 'string', isOptional: true },
        { name: 'order', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'student_progress',
      columns: [
        { name: 'student_id', type: 'string', isIndexed: true },
        { name: 'course_id', type: 'string', isIndexed: true },
        { name: 'progress', type: 'number' },
        { name: 'last_accessed', type: 'string' },
        { name: 'current_lesson_id', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'completed_lessons',
      columns: [
        { name: 'student_id', type: 'string', isIndexed: true },
        { name: 'lesson_id', type: 'string', isIndexed: true },
        { name: 'course_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'quiz_scores',
      columns: [
        { name: 'student_id', type: 'string', isIndexed: true },
        { name: 'quiz_id', type: 'string', isIndexed: true },
        { name: 'module_id', type: 'string', isIndexed: true },
        { name: 'score', type: 'number' },
        { name: 'completed_at', type: 'string' },
        { name: 'attempt_number', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'enrollments',
      columns: [
        { name: 'student_id', type: 'string', isIndexed: true },
        { name: 'course_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});
