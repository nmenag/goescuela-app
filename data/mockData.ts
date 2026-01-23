// Mock Data for Educational LMS

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  videoUrl?: string;
  description: string;
  resources?: {
    id: string;
    title: string;
    type: "pdf" | "link" | "document";
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
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  students: number;
  modules: Module[];
  duration: number; // total hours
  price?: number;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessons: string[];
  currentLessonId?: string;
  lastAccessed: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
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

// MOCK STUDENTS
export const mockStudents: Student[] = [
  {
    id: "student-1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    enrolledCourses: ["course-1", "course-2", "course-3"],
    progress: [
      {
        studentId: "student-1",
        courseId: "course-1",
        progress: 65,
        completedLessons: ["lesson-1", "lesson-2", "lesson-3"],
        currentLessonId: "lesson-4",
        lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        studentId: "student-1",
        courseId: "course-2",
        progress: 30,
        completedLessons: ["lesson-5", "lesson-6"],
        currentLessonId: "lesson-7",
        lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        studentId: "student-1",
        courseId: "course-3",
        progress: 90,
        completedLessons: ["lesson-9", "lesson-10", "lesson-11", "lesson-12"],
        currentLessonId: "lesson-13",
        lastAccessed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
    quizScores: [
      {
        quizId: "quiz-module-1-1",
        moduleId: "module-1",
        score: 85,
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        quizId: "quiz-module-1-2",
        moduleId: "module-2",
        score: 92,
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        quizId: "quiz-module-2-1",
        moduleId: "module-3",
        score: 78,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        quizId: "quiz-module-3-1",
        moduleId: "module-5",
        score: 88,
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

// MOCK COURSES
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Ciencias Naturales",
    description:
      "Aprende los conceptos fundamentales de ciencias naturales incluyendo biología, química y física.",
    instructor: {
      id: "instructor-1",
      name: "Dr. James Wilson",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    category: "Ciencias",
    level: "Beginner",
    rating: 4.8,
    students: 12500,
    duration: 20,
    price: 49.99,
    modules: [
      {
        id: "module-1",
        title: "Introducción a las Ciencias Naturales",
        duration: 4,
        lessons: [
          {
            id: "lesson-1",
            title: "Conceptos Básicos",
            duration: 45,
            description:
              "Aprende los conceptos básicos de las ciencias naturales.",
            resources: [
              {
                id: "res-1",
                title: "Guía de Introducción",
                type: "pdf",
                url: "https://example.com/intro.pdf",
              },
            ],
          },
          {
            id: "lesson-2",
            title: "El Método Científico",
            duration: 60,
            description:
              "Explora el método científico y cómo se usa en la investigación.",
            resources: [
              {
                id: "res-3",
                title: "Guía del Método Científico",
                type: "pdf",
                url: "https://example.com/scientific-method.pdf",
              },
            ],
          },
          {
            id: "lesson-3",
            title: "Mediciones y Unidades",
            duration: 55,
            description: "Domina las mediciones y unidades en ciencias.",
          },
        ],
      },
      {
        id: "module-2",
        title: "Biología Básica",
        duration: 6,
        lessons: [
          {
            id: "lesson-4",
            title: "Células y Organismos",
            duration: 70,
            description: "Aprende sobre las células y los organismos vivos.",
          },
          {
            id: "lesson-5",
            title: "Ecosistemas",
            duration: 65,
            description: "Entiende cómo funcionan los ecosistemas.",
          },
        ],
      },
      {
        id: "module-3",
        title: "Física Fundamental",
        duration: 10,
        lessons: [
          {
            id: "lesson-6",
            title: "Movimiento y Fuerzas",
            duration: 80,
            description: "Estudia el movimiento y las fuerzas en la física.",
          },
          {
            id: "lesson-7",
            title: "Energía y Trabajo",
            duration: 75,
            description: "Comprende la energía y el trabajo en sistemas físicos.",
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "Inglés",
    description:
      "Aprende inglés desde lo básico hasta nivel intermedio con lecciones prácticas y conversaciones reales.",
    instructor: {
      id: "instructor-2",
      name: "Emma Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    category: "Idiomas",
    level: "Beginner",
    rating: 4.7,
    students: 8200,
    duration: 16,
    price: 39.99,
    modules: [
      {
        id: "module-4",
        title: "Fundamentos del Inglés",
        duration: 5,
        lessons: [
          {
            id: "lesson-8",
            title: "Alfabeto y Pronunciación",
            duration: 60,
            description: "Aprende el alfabeto inglés y la pronunciación correcta.",
          },
          {
            id: "lesson-9",
            title: "Vocabulario Básico",
            duration: 55,
            description: "Construye tu vocabulario básico en inglés.",
          },
        ],
      },
      {
        id: "module-5",
        title: "Gramática Esencial",
        duration: 11,
        lessons: [
          {
            id: "lesson-10",
            title: "Tiempos Verbales",
            duration: 90,
            description: "Domina los tiempos verbales en inglés.",
          },
          {
            id: "lesson-11",
            title: "Construcción de Oraciones",
            duration: 75,
            description: "Aprende a construir oraciones correctamente en inglés.",
          },
        ],
      },
    ],
  },
  {
    id: "course-3",
    title: "Prueba",
    description:
      "Un curso de prueba con contenido introductorio para familiarizarse con la plataforma.",
    instructor: {
      id: "instructor-3",
      name: "Prof. Michael Zhang",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    category: "General",
    level: "Beginner",
    rating: 4.9,
    students: 5400,
    duration: 24,
    price: 59.99,
    modules: [
      {
        id: "module-6",
        title: "Módulo 1: Introducción",
        duration: 8,
        lessons: [
          {
            id: "lesson-12",
            title: "Bienvenida al Curso",
            duration: 65,
            description: "Introducción y descripción general del curso.",
          },
          {
            id: "lesson-13",
            title: "Cómo Usar la Plataforma",
            duration: 85,
            description: "Aprende a navegar y usar la plataforma de manera efectiva.",
          },
        ],
      },
      {
        id: "module-7",
        title: "Módulo 2: Contenido Principal",
        duration: 16,
        lessons: [
          {
            id: "lesson-14",
            title: "Lección 1",
            duration: 75,
            description: "Primer contenido del módulo principal.",
          },
          {
            id: "lesson-15",
            title: "Lección 2",
            duration: 90,
            description: "Segundo contenido del módulo principal.",
          },
        ],
      },
    ],
  },
];

// MOCK FEATURED CATEGORIES
export const mockCategories = [
  { id: "cat-1", name: "Mobile Development", icon: "phone" },
  { id: "cat-2", name: "Web Development", icon: "globe" },
  { id: "cat-3", name: "Design", icon: "palette" },
  { id: "cat-4", name: "Data Science", icon: "bar-chart-2" },
  { id: "cat-5", name: "Programming", icon: "code" },
  { id: "cat-6", name: "Business", icon: "briefcase" },
];

// MOCK QUIZZES
export const mockQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Quiz de Fundamentos de React Native",
    courseId: "course-1",
    duration: 15,
    passingScore: 70,
    questions: [
      {
        id: "q-1",
        question: "¿Cuál es el propósito principal de React Native?",
        options: [
          "Construir aplicaciones de escritorio",
          "Crear aplicaciones móviles multiplataforma",
          "Gestionar renderizado en el lado del servidor",
          "Manejar operaciones de base de datos",
        ],
        correctAnswer: 1,
        explanation:
          "React Native permite a los desarrolladores construir aplicaciones móviles multiplataforma usando JavaScript.",
      },
      {
        id: "q-2",
        question: "¿Qué empresa creó React Native?",
        options: ["Google", "Facebook (Meta)", "Netflix", "Twitter"],
        correctAnswer: 1,
        explanation: "React Native fue creado por Facebook (ahora Meta) en 2015.",
      },
      {
        id: "q-3",
        question: "¿Cuál es la diferencia entre los componentes View y Text?",
        options: [
          "View muestra texto, Text muestra imágenes",
          "View es para maquetación, Text es para mostrar contenido de texto",
          "Son lo mismo",
          "Text se usa para estilos",
        ],
        correctAnswer: 1,
        explanation:
          "View es un componente contenedor usado para maquetación, mientras que Text es específicamente para mostrar contenido de texto.",
      },
      {
        id: "q-4",
        question: "¿Cómo aplicas estilos en React Native?",
        options: [
          "Usando archivos CSS",
          "Usando estilos en línea con StyleSheet.create()",
          "Usando Tailwind CSS",
          "Usando solo librerías CSS-in-JS",
        ],
        correctAnswer: 1,
        explanation:
          "React Native usa StyleSheet.create() para definir estilos, similar a CSS pero sin clases.",
      },
      {
        id: "q-5",
        question: "¿Cuál es el propósito del componente FlatList?",
        options: [
          "Crear maquetaciones de diseño plano",
          "Renderizar listas grandes eficientemente",
          "Crear animaciones",
          "Gestionar estado",
        ],
        correctAnswer: 1,
        explanation:
          "FlatList es un componente optimizado para renderizar listas grandes con uso mínimo de memoria.",
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
export const getStudentCourseQuizScores = (
  studentId: string,
  courseId: string,
): QuizScore[] => {
  const course = getCourseById(courseId);
  if (!course) return [];

  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return [];

  const moduleIds = course.modules.map((m) => m.id);
  return student.quizScores.filter((qs) => moduleIds.includes(qs.moduleId));
};

// Helper function to get all enrolled courses for a student
export const getStudentEnrolledCourses = (studentId: string): Course[] => {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return [];
  return mockCourses.filter((course) =>
    student.enrolledCourses.includes(course.id),
  );
};
