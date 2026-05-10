import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseRepository, studentRepository } from '../../infrastructure/repositories';
import { StudentProgress } from '../../domain/entities';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseRepository.getAll(),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => courseRepository.getById(id),
    enabled: !!id,
  });
};

export const useCourseContent = (courseId: string) => {
  return useQuery({
    queryKey: ['courses', courseId, 'content'],
    queryFn: async () => {
      const modules = await courseRepository.getModulesByCourseId(courseId);
      const modulesWithLessons = await Promise.all(
        modules.map(async (m) => ({
          ...m,
          lessons: await courseRepository.getLessonsByModuleId(m.id),
        })),
      );
      return modulesWithLessons;
    },
    enabled: !!courseId,
  });
};

export const useStudentProgress = (studentId: string, courseId: string) => {
  return useQuery({
    queryKey: ['progress', studentId, courseId],
    queryFn: () => studentRepository.getProgress(studentId, courseId),
    enabled: !!studentId && !!courseId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (progress: Partial<StudentProgress> & { studentId: string; courseId: string }) =>
      studentRepository.updateProgress(progress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['progress', variables.studentId, variables.courseId],
      });
    },
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      courseId,
      lessonId,
    }: {
      studentId: string;
      courseId: string;
      lessonId: string;
    }) => studentRepository.markLessonAsCompleted(studentId, courseId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['completedLessons', variables.studentId, variables.courseId],
      });
    },
  });
};

export const useCompletedLessons = (studentId: string, courseId: string) => {
  return useQuery({
    queryKey: ['completedLessons', studentId, courseId],
    queryFn: () => studentRepository.getCompletedLessons(studentId, courseId),
    enabled: !!studentId && !!courseId,
  });
};
