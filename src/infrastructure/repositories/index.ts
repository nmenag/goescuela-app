import { WatermelonCourseRepository } from './WatermelonCourseRepository';
import { WatermelonStudentRepository } from './WatermelonStudentRepository';
import { MMKVSettingsRepository } from './MMKVSettingsRepository';

export const courseRepository = new WatermelonCourseRepository();
export const studentRepository = new WatermelonStudentRepository();
export const settingsRepository = new MMKVSettingsRepository();
