import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'courses',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'thumbnail', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'instructor_name', type: 'string' },
        { name: 'instructor_avatar', type: 'string' },
        { name: 'students_count', type: 'number' },
        { name: 'duration', type: 'number' },
        { name: 'is_sequential', type: 'boolean' },
        { name: 'sync_status', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'modules',
      columns: [
        { name: 'course_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'order', type: 'number' },
        { name: 'duration', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'lessons',
      columns: [
        { name: 'module_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'duration', type: 'number' },
        { name: 'content_url', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'order', type: 'number' },
        { name: 'is_completed', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'quiz_scores',
      columns: [
        { name: 'quiz_id', type: 'string', isIndexed: true },
        { name: 'student_id', type: 'string', isIndexed: true },
        { name: 'score', type: 'number' },
        { name: 'completed_at', type: 'number' },
        { name: 'sync_status', type: 'string' },
      ],
    }),
  ],
});
