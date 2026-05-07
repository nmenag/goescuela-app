import { useQuery } from '@tanstack/react-query';
import { studentRepository } from '../../infrastructure/repositories';

export const useStudentProfile = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentRepository.getProfile(id),
    enabled: !!id,
  });
};

export const useStudentAcademicStats = (studentId: string) => {
  return useQuery({
    queryKey: ['student', studentId, 'stats'],
    queryFn: async () => {
      // In a real app, this might be a single query or a call to a stats service
      // For now, we aggregate from repository
      // This is a placeholder for more complex logic
      return {
        completedCourses: 0, // Calculate this
        averageScore: 0, // Calculate this
      };
    },
    enabled: !!studentId,
  });
};
