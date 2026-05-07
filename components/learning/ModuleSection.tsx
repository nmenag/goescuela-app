import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Module, StudentProgress } from '@/data/mockData';
import { LessonNode } from './LessonNode';
import { BrandingColors } from '@/constants/theme';

interface ModuleSectionProps {
  module: Module;
  moduleIndex: number;
  progress: StudentProgress | undefined;
  sequential: boolean;
  isDownloaded: (url: string) => boolean;
  onLessonPress: (lessonId: string) => void;
  startIndex: number;
}

export const ModuleSection = ({
  module,
  moduleIndex,
  progress,
  sequential,
  isDownloaded,
  onLessonPress,
  startIndex,
}: ModuleSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.moduleNumber}>UNIDAD {moduleIndex + 1}</ThemedText>
        <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
      </View>

      <View style={styles.path}>
        {module.lessons.map((lesson, idx) => {
          const globalIndex = startIndex + idx;

          // Check if previous lesson was completed for sequential locking
          let prevLessonCompleted = true;
          if (sequential && idx > 0) {
            const prevLessonId = module.lessons[idx - 1].id;
            prevLessonCompleted = progress?.completedLessons.includes(prevLessonId) || false;
          } else if (sequential && moduleIndex > 0) {
            // This logic could be more complex to check previous module's last lesson
            // But for now let's keep it simple or assume first lesson of module is unlocked if previous module finished
            prevLessonCompleted = true;
          }

          return (
            <LessonNode
              key={lesson.id}
              lesson={lesson}
              index={globalIndex}
              progress={progress}
              sequential={sequential}
              isDownloaded={isDownloaded}
              onPress={onLessonPress}
              prevLessonCompleted={prevLessonCompleted}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 40,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  moduleNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: BrandingColors.hotPink,
    letterSpacing: 2,
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  path: {
    alignItems: 'center',
  },
});
