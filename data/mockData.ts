export type LessonType = 'video' | 'quiz' | 'resource' | 'homework' | 'audio';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  description?: string;

  videoUrl?: string;
  audioUrl?: string;
  quizId?: string;
  resourceType?: 'pdf' | 'audio' | 'link';
  resourceUrl?: string;
  homeworkContent?: string;

  resources?: {
    id: string;
    title: string;
    type: 'pdf' | 'link' | 'document';
    url: string;
  }[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  thumbnail: string;
  category: string;
  students: number;
  modules: Module[];
  duration: number;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  currentLessonId?: string;
  lastAccessed: string;
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'text' | 'sequence' | 'fill-in-blank';

export interface Answer {
  type?: 'text' | 'image';
  content: string;
  is_correct?: boolean;
  order?: number;
  blank_position?: number;
  feedback?: string;
}

export interface QuestionFeedback {
  correct?: string;
  partial?: string;
  incorrect?: string;
}

export interface QuizQuestion {
  id?: string;
  title: string;
  type: QuestionType;
  timer?: number; // seconds
  pointMultiplier?: 'none' | 'double';
  b64_image?: string | null;
  question_template?: string;
  feedback?: QuestionFeedback;
  feedback_on_correct?: string;
  feedback_on_incorrect?: string;
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  moduleId: string;
  questions: QuizQuestion[];
  duration: number; // in minutes
  passingScore: number; // percentage
}

export interface QuizScore {
  quizId: string;
  moduleId: string;
  score: number; // 0-100
  completedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: string[];
  progress: StudentProgress[];
  quizScores: QuizScore[];
}

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    enrolledCourses: ['course-1', 'course-2', 'course-3'],
    progress: [
      {
        studentId: 'student-1',
        courseId: 'course-1',
        progress: 65,
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
        currentLessonId: 'lesson-4',
        lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        studentId: 'student-1',
        courseId: 'course-2',
        progress: 30,
        completedLessons: ['lesson-5', 'lesson-6'],
        currentLessonId: 'lesson-7',
        lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        studentId: 'student-1',
        courseId: 'course-3',
        progress: 90,
        completedLessons: ['lesson-9', 'lesson-10', 'lesson-11', 'lesson-12'],
        currentLessonId: 'lesson-13',
        lastAccessed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
    quizScores: [
      {
        quizId: 'quiz-module-1-1',
        moduleId: 'module-1',
        score: 85,
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        quizId: 'quiz-module-1-2',
        moduleId: 'module-2',
        score: 92,
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        quizId: 'quiz-module-2-1',
        moduleId: 'module-3',
        score: 78,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        quizId: 'quiz-module-3-1',
        moduleId: 'module-5',
        score: 88,
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Ciencias Naturales',
    description:
      'Aprende los conceptos fundamentales de ciencias naturales incluyendo biología, química y física.',
    instructor: {
      id: 'instructor-1',
      name: 'Dr. James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    category: 'Ciencias',
    students: 12500,
    duration: 20,
    modules: [
      {
        id: 'module-1',
        title: 'Seres Vivos y su clasificación',
        duration: 4,
        lessons: [
          {
            id: 'lesson-1',
            title: 'Conceptos Básicos',
            type: 'video',
            duration: 45,
            description: 'Seres Vivos y su clasificación',
            videoUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            resources: [
              {
                id: 'res-1',
                title: 'Guía de Introducción',
                type: 'pdf',
                url: 'https://example.com/intro.pdf',
              },
            ],
          },
          {
            id: 'lesson-2',
            title: 'Quiz de Fundamentos',
            type: 'quiz',
            duration: 15,
            quizId: 'quiz-1',
          },
          {
            id: 'lesson-3',
            title: 'Lectura: El Método Científico',
            type: 'resource',
            resourceType: 'pdf',
            resourceUrl: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf',
            duration: 20,
            description: 'Lee el documento sobre el método científico.',
          },
          {
            id: 'lesson-home-1',
            title: 'Tarea: Observación',
            type: 'homework',
            duration: 30,
            homeworkContent:
              'Realiza una observación de un fenómeno natural en tu entorno y descríbelo.',
            description: 'Tarea práctica de observación.',
          },
          {
            id: 'lesson-audio-1',
            title: 'Podcast: Historias de la Ciencia',
            type: 'audio',
            duration: 25,
            audioUrl: 'http://thepodcastexchange.ca/s/Porsche-Macan-July-5-2018-1.mp3',
            description: 'Escucha este podcast sobre grandes descubrimientos.',
          },
        ],
      },
      {
        id: 'module-2',
        title: 'Biología Básica',
        duration: 6,
        lessons: [
          {
            id: 'lesson-4',
            title: 'Células y Organismos',
            type: 'video',
            duration: 70,
            description: 'Aprende sobre las células y los organismos vivos.',
          },
          {
            id: 'lesson-quiz-2',
            title: 'Evaluación de Biología',
            type: 'quiz',
            duration: 10,
            quizId: 'quiz-3',
          },
          {
            id: 'lesson-5',
            title: 'Ecosistemas',
            type: 'resource',
            resourceType: 'pdf',
            duration: 65,
            description: 'Entiende cómo funcionan los ecosistemas.',
          },
        ],
      },
      {
        id: 'module-3',
        title: 'Física Fundamental',
        duration: 10,
        lessons: [
          {
            id: 'lesson-6',
            title: 'Movimiento y Fuerzas',
            type: 'video',
            duration: 80,
            description: 'Estudia el movimiento y las fuerzas en la física.',
          },
          {
            id: 'lesson-7',
            title: 'Energía y Trabajo',
            type: 'video',
            duration: 75,
            description: 'Comprende la energía y el trabajo en sistemas físicos.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Inglés',
    description:
      'Aprende inglés desde lo básico hasta nivel intermedio con lecciones prácticas y conversaciones reales.',
    instructor: {
      id: 'instructor-2',
      name: 'Emma Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    category: 'Idiomas',
    students: 8200,
    duration: 16,
    modules: [
      {
        id: 'module-4',
        title: 'Fundamentos del Inglés',
        duration: 5,
        lessons: [
          {
            id: 'lesson-8',
            title: 'Alfabeto y Pronunciación',
            type: 'video',
            duration: 60,
            description: 'Aprende el alfabeto inglés y la pronunciación correcta.',
          },
          {
            id: 'lesson-9',
            title: 'Vocabulario Básico',
            type: 'video',
            duration: 55,
            description: 'Construye tu vocabulario básico en inglés.',
          },
        ],
      },
      {
        id: 'module-5',
        title: 'Gramática Esencial',
        duration: 11,
        lessons: [
          {
            id: 'lesson-10',
            title: 'Tiempos Verbales',
            type: 'video',
            duration: 90,
            description: 'Domina los tiempos verbales en inglés.',
          },
          {
            id: 'lesson-11',
            title: 'Construcción de Oraciones',
            type: 'video',
            duration: 75,
            description: 'Aprende a construir oraciones correctamente en inglés.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Prueba',
    description:
      'Un curso de prueba con contenido introductorio para familiarizarse con la plataforma.',
    instructor: {
      id: 'instructor-3',
      name: 'Prof. Michael Zhang',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    category: 'General',
    students: 5400,
    duration: 24,
    modules: [
      {
        id: 'module-6',
        title: 'Módulo 1: Introducción',
        duration: 8,
        lessons: [
          {
            id: 'lesson-12',
            title: 'Bienvenida al Curso',
            type: 'video',
            duration: 65,
            description: 'Introducción y descripción general del curso.',
          },
          {
            id: 'lesson-13',
            title: 'Cómo Usar la Plataforma',
            type: 'video',
            duration: 85,
            description: 'Aprende a navegar y usar la plataforma de manera efectiva.',
          },
        ],
      },
      {
        id: 'module-7',
        title: 'Módulo 2: Contenido Principal',
        duration: 16,
        lessons: [
          {
            id: 'lesson-14',
            title: 'Lección 1',
            type: 'video',
            duration: 75,
            description: 'Primer contenido del módulo principal.',
          },
          {
            id: 'lesson-15',
            title: 'Lección 2',
            type: 'video',
            duration: 90,
            description: 'Segundo contenido del módulo principal.',
          },
        ],
      },
    ],
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Quiz Avanzado de Muestra',
    courseId: 'course-1',
    moduleId: 'module-1',
    duration: 15,
    passingScore: 70,
    questions: [
      {
        title: 'Question text here',
        type: 'multiple-choice',
        timer: 30,
        pointMultiplier: 'none',
        b64_image: null,
        answers: [
          {
            type: 'text',
            content: 'Option 1',
            is_correct: true,
          },
          {
            type: 'text',
            content: 'Option 2',
            is_correct: false,
          },
        ],
      },
      {
        title: 'True or False question?',
        type: 'true-false',
        timer: 20,
        pointMultiplier: 'double',
        b64_image: null,
        answers: [
          {
            type: 'text',
            content: 'Verdadero',
            is_correct: true,
          },
          {
            type: 'text',
            content: 'Falso',
            is_correct: false,
          },
        ],
      },
      {
        title: 'Type your answer',
        type: 'text',
        timer: 45,
        pointMultiplier: 'none',
        b64_image: null,
        answers: [
          {
            content: 'Answer 1',
          },
          {
            content: 'Answer 2',
          },
        ],
      },
      {
        title: 'Sort in correct order',
        type: 'sequence',
        timer: 60,
        pointMultiplier: 'none',
        b64_image: null,
        answers: [
          {
            content: 'First item',
            order: 1,
          },
          {
            content: 'Second item',
            order: 2,
          },
          {
            content: 'Third item',
            order: 3,
          },
        ],
      },
      {
        title: 'Fill in blanks',
        type: 'fill-in-blank',
        timer: 45,
        pointMultiplier: 'none',
        question_template: 'The ___ brown ___ jumps over the lazy ___',
        feedback: {
          correct: 'Perfect! You completed the sentence correctly.',
          partial: 'You got some blanks right, but check position 2.',
          incorrect: 'Try again. Hint: The first blank is an adjective describing speed.',
        },
        answers: [
          {
            blank_position: 1,
            content: 'quick',
          },
          {
            blank_position: 2,
            content: 'fox',
          },
          {
            blank_position: 3,
            content: 'dog',
          },
        ],
      },
      {
        title: 'Question',
        type: 'multiple-choice',
        feedback_on_correct: 'Well done!',
        feedback_on_incorrect: "Not quite. Here's the explanation...",
        answers: [
          {
            content: 'Option  1',
            is_correct: true,
            feedback: 'This specific choice is right because...',
          },
          {
            content: 'Option  2',
            is_correct: true,
            feedback: 'This specific choice is right because...',
          },
          {
            content: 'Option 3',
            is_correct: false,
            feedback: 'This choice is incorrect because...',
          },
        ],
      },
    ],
  },
  // Retaining other quizzes for structure but simplifying content or could remove them if they conflict too much.
  // Converting old quizzes to new format minimally to avoid type errors.
  {
    id: 'quiz-2',
    title: 'Quiz Avanzado de Componentes',
    courseId: 'course-1',
    moduleId: 'module-1',
    duration: 20,
    passingScore: 75,
    questions: [
      {
        title: '¿Cuál es la diferencia entre los componentes View y Text?',
        type: 'multiple-choice',
        answers: [
          { content: 'View muestra texto, Text muestra imágenes', is_correct: false },
          {
            content: 'View es para maquetación, Text es para mostrar contenido de texto',
            is_correct: true,
          },
          { content: 'Son lo mismo', is_correct: false },
          { content: 'Text se usa para estilos', is_correct: false },
        ],
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'Quiz de Estilos y Diseño',
    courseId: 'course-1',
    moduleId: 'module-2',
    duration: 10,
    passingScore: 60,
    questions: [
      {
        title: '¿Cómo aplicas estilos en React Native?',
        type: 'multiple-choice',
        answers: [
          { content: 'Usando archivos CSS', is_correct: false },
          { content: 'Usando estilos en línea con StyleSheet.create()', is_correct: true },
          { content: 'Usando Tailwind CSS', is_correct: false },
          { content: 'Usando solo librerías CSS-in-JS', is_correct: false },
        ],
      },
    ],
  },
];

// Helper function to get current student
export const getCurrentStudent = (): Student => {
  return mockStudents[0]; // Returns the first student by default
};

// Helper function to get course by ID
export const getCourseById = (courseId: string): Course | undefined => {
  return mockCourses.find((course) => course.id === courseId);
};

// Helper function to get student progress for a course
export const getStudentCourseProgress = (
  studentId: string,
  courseId: string,
): StudentProgress | undefined => {
  const student = mockStudents.find((s) => s.id === studentId);
  return student?.progress.find((p) => p.courseId === courseId);
};

// Helper function to get quiz by course ID
export const getQuizByCourseId = (courseId: string): Quiz | undefined => {
  return mockQuizzes.find((quiz) => quiz.courseId === courseId);
};

// Helper function to get quiz scores for a student by module ID
export const getStudentModuleQuizScore = (
  studentId: string,
  moduleId: string,
): QuizScore | undefined => {
  const student = mockStudents.find((s) => s.id === studentId);
  return student?.quizScores.find((qs) => qs.moduleId === moduleId);
};

// Helper function to get all quiz scores for a student by course modules
export const getStudentCourseQuizScores = (studentId: string, courseId: string): QuizScore[] => {
  const course = getCourseById(courseId);
  if (!course) return [];

  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return [];

  const moduleIds = course.modules.map((m) => m.id);
  return student.quizScores.filter((qs) => moduleIds.includes(qs.moduleId));
};

// Helper function to get a lesson by ID
export const getLessonById = (lessonId: string): Lesson | undefined => {
  for (const course of mockCourses) {
    for (const module of course.modules) {
      const lesson = module.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
};

// Helper function to get all enrolled courses for a student
export const getStudentEnrolledCourses = (studentId: string): Course[] => {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return [];
  return mockCourses.filter((course) => student.enrolledCourses.includes(course.id));
};

// Helper function to get course ID by lesson ID
export const getCourseIdByLessonId = (lessonId: string): string | undefined => {
  for (const course of mockCourses) {
    for (const module of course.modules) {
      if (module.lessons.some((l) => l.id === lessonId)) {
        return course.id;
      }
    }
  }
  return undefined;
};
