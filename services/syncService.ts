import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { mockStudents } from '@/data/mockData';

const STUDENT_DATA_KEY = 'goescuela_student_data';

class SyncService {
  private static instance: SyncService;
  private isSyncing = false;
  private listeners: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Initialize student data from local storage
   */
  public async init(): Promise<void> {
    try {
      const storedData = await AsyncStorage.getItem(STUDENT_DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Update the mock student data with stored values
        const student = mockStudents.find((s) => s.id === parsedData.id);
        if (student) {
          student.progress = parsedData.progress || student.progress;
          student.quizScores = parsedData.quizScores || student.quizScores;
        }
      }
    } catch (error) {
      console.error('Error initializing student data:', error);
    }
  }

  /**
   * Sync important data (progress, scores) with "server" (local storage for now)
   * This is triggered manually or automatically when online
   */
  public async syncImportantData(): Promise<boolean> {
    if (this.isSyncing) return false;

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.log('Sync skipped: No internet connection');
      return false;
    }

    this.isSyncing = true;
    try {
      console.log('Syncing important data...');

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const student = mockStudents[0]; // For now we only have one student
      const dataToSync = {
        id: student.id,
        progress: student.progress,
        quizScores: student.quizScores,
        lastSynced: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(dataToSync));

      console.log('Sync successful');
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Set up automatic sync listener
   */
  public setupAutoSync() {
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.syncImportantData();
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }
}

export const syncService = SyncService.getInstance();
