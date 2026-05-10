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
  sequential?: boolean;
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
