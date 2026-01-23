import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import {
  getCourseById,
  getCurrentStudent,
  getStudentCourseProgress,
  getStudentCourseQuizScores,
} from '@/data/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Accordion } from '../components/accordion';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
};

export default function LearningViewScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const course = getCourseById(courseId || '');
  const student = getCurrentStudent();
  const progress = getStudentCourseProgress(student.id, courseId || '');
  const quizScores = getStudentCourseQuizScores(student.id, courseId || '');

  if (!course) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Curso no encontrado</ThemedText>
      </ThemedView>
    );
  }

  const accordionItems = course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    duration: module.duration,
    content: (
      <ThemedView style={styles.lessonsContainer}>
        {module.lessons.map((lesson) => (
          <TouchableOpacity key={lesson.id} style={styles.lessonItem} activeOpacity={0.7}>
            <ThemedView style={styles.lessonInfo}>
              <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
              <ThemedText style={styles.lessonDuration}>⏱ {lesson.duration} min</ThemedText>
            </ThemedView>
            <ThemedText style={styles.lessonIcon}>▶</ThemedText>
          </TouchableOpacity>
        ))}
        <ThemedView style={styles.quizButton}>
          <TouchableOpacity style={styles.quizButtonContent}>
            <ThemedText style={styles.quizButtonText}>Quiz del Módulo</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    ),
  }));

  const getQuizScoreForModule = (moduleId: string) => {
    return quizScores.find((qs) => qs.moduleId === moduleId);
  };

  const renderHeader = () => (
    <ThemedView>
      {/* Header with Back Button */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ThemedText style={styles.backButton}>← Atrás</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </ThemedText>
      </ThemedView>

      {/* Grade Section */}
      <ThemedView style={styles.gradeSection}>
        <ThemedView style={styles.gradeCard}>
          <ThemedText style={styles.gradeLabel}>Tu Progreso</ThemedText>
          <ThemedText style={styles.gradeValue}>
            {progress ? Math.round(progress.progress) : 0}%
          </ThemedText>
          <ThemedView style={styles.gradeBar}>
            <ThemedView
              style={[styles.gradeProgress, { width: `${progress ? progress.progress : 0}%` }]}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Modules and Grades Container */}
      <ThemedView style={styles.modulesAndGradesContainer}>
        {/* Modules Section */}
        <ThemedView style={styles.modulesColumn}>
          <ThemedText style={styles.modulesTitle}>Módulos</ThemedText>
        </ThemedView>

        {/* Quiz Grades Section */}
        {quizScores.length > 0 && (
          <ThemedView style={styles.gradesColumn}>
            <ThemedText style={styles.gradesTitle}>Calificaciones de Quiz</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={accordionItems}
        renderItem={({ item, index }) => (
          <ThemedView style={styles.moduleRowContainer}>
            {/* Module */}
            <ThemedView style={styles.moduleColumn}>
              <ThemedView style={styles.accordionWrapper}>
                <Accordion items={[item]} />
              </ThemedView>
            </ThemedView>

            {/* Quiz Grade for this Module */}
            {quizScores.length > 0 && (
              <ThemedView style={styles.quizGradeColumn}>
                {(() => {
                  const moduleQuizScore = getQuizScoreForModule(item.id);
                  return moduleQuizScore ? (
                    <ThemedView style={styles.quizGradeCard}>
                      <ThemedText style={styles.quizGradeValue}>{moduleQuizScore.score}</ThemedText>
                      <ThemedText style={styles.quizGradeLabel}>/ 100</ThemedText>
                    </ThemedView>
                  ) : (
                    <ThemedView style={styles.quizGradeCardEmpty}>
                      <ThemedText style={styles.quizGradeValueEmpty}>-</ThemedText>
                    </ThemedView>
                  );
                })()}
              </ThemedView>
            )}
          </ThemedView>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  gradeSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  gradeCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  gradeValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  gradeBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gradeProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  modulesSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modulesAndGradesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modulesColumn: {
    flex: 1,
  },
  modulesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  gradesColumn: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  gradesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  moduleRowContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  moduleColumn: {
    flex: 1,
  },
  quizGradeColumn: {
    width: 80,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizGradeCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  quizGradeCardEmpty: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quizGradeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quizGradeValueEmpty: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  quizGradeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  accordionWrapper: {
    marginBottom: 12,
  },
  lessonsContainer: {
    gap: 8,
    paddingTop: 8,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  lessonIcon: {
    fontSize: 16,
    color: COLORS.primary,
  },
  quizButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  quizButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  quizButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
