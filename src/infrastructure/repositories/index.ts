import { SQLiteCourseRepository } from './SQLiteCourseRepository';
import { SQLiteStudentRepository } from './SQLiteStudentRepository';
import { MMKVSettingsRepository } from './MMKVSettingsRepository';

export const courseRepository = new SQLiteCourseRepository();
export const studentRepository = new SQLiteStudentRepository();
export const settingsRepository = new MMKVSettingsRepository();
