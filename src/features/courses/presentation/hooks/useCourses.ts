import { useQuery } from '@tanstack/react-query';
import { CourseRepository } from '../../infrastructure/CourseRepository';

const courseRepo = new CourseRepository();

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseRepo.getCourses(),
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => courseRepo.getCourseById(courseId),
    enabled: !!courseId,
  });
};
