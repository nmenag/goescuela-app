import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentProgress, QuizScore, mockStudents } from '@/data/mockData';

interface CourseState {
  progress: StudentProgress[];
  quizScores: QuizScore[];
  completeLesson: (courseId: string, lessonId: string) => void;
  addQuizScore: (score: QuizScore) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      // Initialize with mock data but allow updates
      progress: mockStudents[0].progress,
      quizScores: mockStudents[0].quizScores,

      completeLesson: (courseId, lessonId) =>
        set((state) => {
          const newProgress = [...state.progress];
          const courseIdx = newProgress.findIndex((p) => p.courseId === courseId);

          if (courseIdx !== -1) {
            if (!newProgress[courseIdx].completedLessons.includes(lessonId)) {
              newProgress[courseIdx].completedLessons.push(lessonId);
              // Update progress percentage (rough estimate)
              newProgress[courseIdx].progress = Math.min(100, newProgress[courseIdx].progress + 5);
            }
          }

          return { progress: newProgress };
        }),

      addQuizScore: (score) =>
        set((state) => ({
          quizScores: [...state.quizScores, score],
        })),
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
