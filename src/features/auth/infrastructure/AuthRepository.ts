import { Student } from '@/domain/entities/Student';

export interface IAuthRepository {
  login(email: string, password: string): Promise<Student>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<Student | null>;
}

export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<Student> {
    // In production, this would call an API
    // For now, simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'student-1',
          name: 'Alejo',
          email: email || 'demo@example.com',
          avatar: 'https://i.pravatar.cc/150?img=1',
          school: 'Colegio San José',
          grade: '10° Grado',
          enrolledCourses: ['course-1'],
        });
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    // Clear tokens, etc.
  }

  async getCurrentUser(): Promise<Student | null> {
    // Check local storage / session
    return null;
  }
}
