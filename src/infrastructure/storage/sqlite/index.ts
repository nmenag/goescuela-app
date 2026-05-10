import * as SQLite from 'expo-sqlite';
import { SQLITE_SCHEMA } from './schema';

const DATABASE_NAME = 'goescuela.db';

export class SQLiteDatabase {
  private static instance: SQLite.SQLiteDatabase | null = null;

  static async getInstance(): Promise<SQLite.SQLiteDatabase> {
    if (!this.instance) {
      this.instance = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.initialize();
    }
    return this.instance;
  }

  private static async initialize() {
    if (!this.instance) return;

    // Enable foreign keys
    await this.instance.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables in order
    const tableQueries = [
      SQLITE_SCHEMA.tables.students,
      SQLITE_SCHEMA.tables.courses,
      SQLITE_SCHEMA.tables.modules,
      SQLITE_SCHEMA.tables.lessons,
      SQLITE_SCHEMA.tables.student_progress,
      SQLITE_SCHEMA.tables.completed_lessons,
      SQLITE_SCHEMA.tables.quiz_scores,
      SQLITE_SCHEMA.tables.enrollments,
    ];

    for (const query of tableQueries) {
      await this.instance.execAsync(query);
    }

    console.log('SQLite Database initialized');
  }
}

export const getDatabase = () => SQLiteDatabase.getInstance();
