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

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: string[];
  progress: StudentProgress[];
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
  },
];

// MOCK COURSES
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "React Native Fundamentals",
    description:
      "Learn the basics of building mobile applications with React Native. Perfect for beginners.",
    instructor: {
      id: "instructor-1",
      name: "Dr. James Wilson",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    category: "Mobile Development",
    level: "Beginner",
    rating: 4.8,
    students: 12500,
    duration: 20,
    price: 49.99,
    modules: [
      {
        id: "module-1",
        title: "Getting Started with React Native",
        duration: 4,
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction & Setup",
            duration: 45,
            description:
              "Learn what React Native is and set up your development environment.",
            resources: [
              {
                id: "res-1",
                title: "Setup Guide",
                type: "pdf",
                url: "https://example.com/setup.pdf",
              },
              {
                id: "res-2",
                title: "Node.js Download",
                type: "link",
                url: "https://nodejs.org",
              },
            ],
          },
          {
            id: "lesson-2",
            title: "Core Components",
            duration: 60,
            description:
              "Explore the fundamental building blocks of React Native.",
            resources: [
              {
                id: "res-3",
                title: "Components Cheat Sheet",
                type: "pdf",
                url: "https://example.com/components.pdf",
              },
            ],
          },
          {
            id: "lesson-3",
            title: "Styling & Layout",
            duration: 55,
            description: "Master flexbox and styling in React Native.",
          },
        ],
      },
      {
        id: "module-2",
        title: "State Management & Navigation",
        duration: 6,
        lessons: [
          {
            id: "lesson-4",
            title: "React Hooks (useState, useEffect)",
            duration: 70,
            description: "Learn how to manage state using hooks.",
          },
          {
            id: "lesson-5",
            title: "Navigation Patterns",
            duration: 65,
            description: "Implement tab and stack navigation.",
          },
        ],
      },
      {
        id: "module-3",
        title: "Advanced Topics",
        duration: 10,
        lessons: [
          {
            id: "lesson-6",
            title: "Performance Optimization",
            duration: 80,
            description: "Optimize your React Native applications.",
          },
          {
            id: "lesson-7",
            title: "Testing & Debugging",
            duration: 75,
            description: "Write tests and debug your code effectively.",
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "Web Design Essentials",
    description:
      "Master modern web design principles and create stunning user interfaces.",
    instructor: {
      id: "instructor-2",
      name: "Emma Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    category: "Design",
    level: "Beginner",
    rating: 4.7,
    students: 8200,
    duration: 16,
    price: 39.99,
    modules: [
      {
        id: "module-4",
        title: "Design Fundamentals",
        duration: 5,
        lessons: [
          {
            id: "lesson-8",
            title: "Color Theory & Typography",
            duration: 60,
            description: "Understand color theory and typography in design.",
          },
          {
            id: "lesson-9",
            title: "Layout & Composition",
            duration: 55,
            description: "Create balanced and visually appealing layouts.",
          },
        ],
      },
      {
        id: "module-5",
        title: "Tools & Techniques",
        duration: 11,
        lessons: [
          {
            id: "lesson-10",
            title: "Figma Mastery",
            duration: 90,
            description: "Become proficient in using Figma for design.",
          },
          {
            id: "lesson-11",
            title: "Prototyping & Interaction Design",
            duration: 75,
            description: "Create interactive prototypes and animations.",
          },
        ],
      },
    ],
  },
  {
    id: "course-3",
    title: "Advanced JavaScript",
    description:
      "Deep dive into JavaScript ES6+, closures, async/await, and advanced patterns.",
    instructor: {
      id: "instructor-3",
      name: "Prof. Michael Zhang",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    category: "Programming",
    level: "Advanced",
    rating: 4.9,
    students: 5400,
    duration: 24,
    price: 59.99,
    modules: [
      {
        id: "module-6",
        title: "ES6+ Features",
        duration: 8,
        lessons: [
          {
            id: "lesson-12",
            title: "Arrow Functions & Destructuring",
            duration: 65,
            description: "Master modern JavaScript syntax.",
          },
          {
            id: "lesson-13",
            title: "Promises & Async/Await",
            duration: 85,
            description: "Handle asynchronous operations effectively.",
          },
        ],
      },
      {
        id: "module-7",
        title: "Advanced Patterns",
        duration: 16,
        lessons: [
          {
            id: "lesson-14",
            title: "Closures & Scope",
            duration: 75,
            description: "Understand JavaScript scope and closures.",
          },
          {
            id: "lesson-15",
            title: "Design Patterns",
            duration: 90,
            description: "Learn common JavaScript design patterns.",
          },
        ],
      },
    ],
  },
  {
    id: "course-4",
    title: "UX/UI Design Bootcamp",
    description:
      "Complete guide to UX/UI design for web and mobile applications.",
    instructor: {
      id: "instructor-4",
      name: "Sophia Klein",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    category: "Design",
    level: "Intermediate",
    rating: 4.6,
    students: 3200,
    duration: 18,
    modules: [
      {
        id: "module-8",
        title: "UX Principles",
        duration: 9,
        lessons: [
          {
            id: "lesson-16",
            title: "User Research & Personas",
            duration: 70,
            description: "Learn to conduct user research and create personas.",
          },
        ],
      },
    ],
  },
  {
    id: "course-5",
    title: "Python for Data Science",
    description:
      "Learn Python programming with focus on data science libraries and analysis.",
    instructor: {
      id: "instructor-5",
      name: "Dr. Anil Patel",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    category: "Data Science",
    level: "Intermediate",
    rating: 4.8,
    students: 6800,
    duration: 22,
    price: 49.99,
    modules: [
      {
        id: "module-9",
        title: "Python Basics",
        duration: 6,
        lessons: [
          {
            id: "lesson-17",
            title: "Python Syntax & Data Types",
            duration: 60,
            description: "Get started with Python fundamentals.",
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
    title: "React Native Basics Quiz",
    courseId: "course-1",
    duration: 15,
    passingScore: 70,
    questions: [
      {
        id: "q-1",
        question: "What is the main purpose of React Native?",
        options: [
          "To build desktop applications",
          "To create cross-platform mobile applications",
          "To manage server-side rendering",
          "To handle database operations",
        ],
        correctAnswer: 1,
        explanation:
          "React Native allows developers to build cross-platform mobile apps using JavaScript.",
      },
      {
        id: "q-2",
        question: "Which company created React Native?",
        options: ["Google", "Facebook (Meta)", "Netflix", "Twitter"],
        correctAnswer: 1,
        explanation: "React Native was created by Facebook (now Meta) in 2015.",
      },
      {
        id: "q-3",
        question: "What is the difference between View and Text components?",
        options: [
          "View displays text, Text displays images",
          "View is for layout, Text is for displaying text content",
          "They are the same",
          "Text is used for styling",
        ],
        correctAnswer: 1,
        explanation:
          "View is a container component used for layout, while Text is specifically for displaying text content.",
      },
      {
        id: "q-4",
        question: "How do you apply styles in React Native?",
        options: [
          "Using CSS files",
          "Using inline styles with StyleSheet.create()",
          "Using Tailwind CSS",
          "Using CSS-in-JS libraries only",
        ],
        correctAnswer: 1,
        explanation:
          "React Native uses StyleSheet.create() to define styles, similar to CSS but without classes.",
      },
      {
        id: "q-5",
        question: "What is the purpose of the FlatList component?",
        options: [
          "To create flat design layouts",
          "To render large lists efficiently",
          "To create animations",
          "To manage state",
        ],
        correctAnswer: 1,
        explanation:
          "FlatList is an optimized component for rendering large lists with minimal memory usage.",
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

// Helper function to get all enrolled courses for a student
export const getStudentEnrolledCourses = (studentId: string): Course[] => {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return [];
  return mockCourses.filter((course) =>
    student.enrolledCourses.includes(course.id),
  );
};
