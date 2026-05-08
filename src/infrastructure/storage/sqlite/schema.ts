export const SQLITE_SCHEMA = {
  version: 1,
  tables: {
    students: `
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar TEXT,
        school TEXT,
        grade TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_students_email ON students (email);
    `,
    courses: `
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        category TEXT NOT NULL,
        duration INTEGER NOT NULL,
        students_count INTEGER NOT NULL,
        instructor_name TEXT NOT NULL,
        instructor_avatar TEXT NOT NULL,
        is_sequential INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
    `,
    modules: `
      CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY NOT NULL,
        course_id TEXT NOT NULL,
        title TEXT NOT NULL,
        duration INTEGER NOT NULL,
        "order" INTEGER NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules (course_id);
    `,
    lessons: `
      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY NOT NULL,
        module_id TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        duration INTEGER NOT NULL,
        description TEXT,
        video_url TEXT,
        audio_url TEXT,
        resource_url TEXT,
        "order" INTEGER NOT NULL,
        FOREIGN KEY (module_id) REFERENCES modules (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons (module_id);
    `,
    student_progress: `
      CREATE TABLE IF NOT EXISTS student_progress (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        progress REAL NOT NULL,
        last_accessed TEXT NOT NULL,
        current_lesson_id TEXT,
        FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress (student_id);
      CREATE INDEX IF NOT EXISTS idx_student_progress_course_id ON student_progress (course_id);
    `,
    completed_lessons: `
      CREATE TABLE IF NOT EXISTS completed_lessons (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_completed_lessons_student_id ON completed_lessons (student_id);
      CREATE INDEX IF NOT EXISTS idx_completed_lessons_lesson_id ON completed_lessons (lesson_id);
      CREATE INDEX IF NOT EXISTS idx_completed_lessons_course_id ON completed_lessons (course_id);
    `,
    quiz_scores: `
      CREATE TABLE IF NOT EXISTS quiz_scores (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        quiz_id TEXT NOT NULL,
        module_id TEXT NOT NULL,
        score REAL NOT NULL,
        completed_at TEXT NOT NULL,
        attempt_number INTEGER NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_quiz_scores_student_id ON quiz_scores (student_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_scores_quiz_id ON quiz_scores (quiz_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_scores_module_id ON quiz_scores (module_id);
    `,
    enrollments: `
      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments (student_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments (course_id);
    `,
  },
};
