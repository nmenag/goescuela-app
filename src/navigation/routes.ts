import { Href } from 'expo-router';

export type RootStackParamList = {
  '(tabs)': undefined;
  login: undefined;
  'learning-view': { courseId: string };
  'lesson/[lessonId]': { lessonId: string };
  quiz: { courseId: string };
};

// Helper for typed routing
export const routes = {
  home: '/(tabs)' as Href,
  login: '/login' as Href,
  learningView: (courseId: string) =>
    ({
      pathname: '/learning-view',
      params: { courseId },
    }) as Href,
  quiz: (courseId: string) =>
    ({
      pathname: '/quiz',
      params: { courseId },
    }) as Href,
};
