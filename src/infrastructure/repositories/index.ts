import { SQLiteCourseRepository } from './SQLiteCourseRepository';
import { SQLiteStudentRepository } from './SQLiteStudentRepository';

export const courseRepository = new SQLiteCourseRepository();
export const studentRepository = new SQLiteStudentRepository();
