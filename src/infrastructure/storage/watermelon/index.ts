import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import {
  Student,
  Course,
  Module,
  Lesson,
  StudentProgress,
  CompletedLesson,
  QuizScore,
  Enrollment,
} from './models';

const adapter = new SQLiteAdapter({
  schema,
  // (Optional) Database name
  dbName: 'goescuela_db',
  // (Recommended) Setting this to true is required for Expo
  jsi: true,
  onSetUpError: (error) => {
    // Database failed to load -- provide the UI for the user to reload the app or code a workaround
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    Student,
    Course,
    Module,
    Lesson,
    StudentProgress,
    CompletedLesson,
    QuizScore,
    Enrollment,
  ],
});
