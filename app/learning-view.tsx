import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import {
  getCourseById,
  getCurrentStudent,
  getStudentCourseProgress,
  getStudentCourseQuizScores,
  mockQuizzes,
} from '@/data/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Accordion } from '../components/accordion';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  tabActive: BrandingColors.hotPink,
  tabInactive: '#9CA3AF',
};

export default function LearningViewScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState<'modules' | 'grades'>('modules');

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

  const getQuizTitle = (quizId: string) => {
    const quiz = mockQuizzes.find((q) => q.id === quizId);
    return quiz ? quiz.title : `Evaluación ${quizId.split('-').pop()}`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '▶';
      case 'quiz':
        return '❓';
      case 'resource':
        return '📄';
      case 'homework':
        return '📝';
      default:
        return '▶';
    }
  };

  const getLessonLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'audio':
        return 'Audio';
      case 'quiz':
        return 'Quiz';
      case 'resource':
        return 'Recurso';
      case 'homework':
        return 'Tarea';
      default:
        return 'Lección';
    }
  };

  const accordionItems = course.modules.map((module) => {
    return {
      id: module.id,
      title: module.title,
      duration: module.duration,
      content: (
        <ThemedView style={styles.lessonsContainer}>
          {module.lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonItem}
              activeOpacity={0.7}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
              <ThemedView style={styles.lessonIconContainer}>
                <ThemedText style={styles.lessonTypeIcon}>{getLessonIcon(lesson.type)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.lessonInfo}>
                <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
                <ThemedView style={styles.lessonMetaContainer}>
                  <ThemedText style={styles.lessonTypeLabel}>
                    {getLessonLabel(lesson.type)}
                  </ThemedText>
                  <ThemedText style={styles.lessonDuration}>• {lesson.duration} min</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText style={styles.chevronIcon}>›</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      ),
    };
  });

  const renderHeader = () => (
    <ThemedView>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ThemedText style={styles.backButton}>← Atrás</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </ThemedText>
      </ThemedView>
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
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'modules' && styles.tabButtonActive]}
          onPress={() => setActiveTab('modules')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'modules' && styles.tabTextActive]}>
            Módulos
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'grades' && styles.tabButtonActive]}
          onPress={() => setActiveTab('grades')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'grades' && styles.tabTextActive]}>
            Calificaciones
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  const renderGrades = () => (
    <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.gradesList}>
        {course.modules.map((module) => {
          const moduleScores = quizScores.filter((qs) => qs.moduleId === module.id);
          if (moduleScores.length === 0) return null;

          return (
            <ThemedView key={module.id} style={styles.moduleGradeGroup}>
              <ThemedText style={styles.moduleGradeTitle}>{module.title}</ThemedText>
              {moduleScores.map((qs, index) => (
                <ThemedView key={`${qs.quizId}-${index}`} style={styles.scoreRow}>
                  <ThemedText style={styles.scoreQuizTitle}>{getQuizTitle(qs.quizId)}</ThemedText>
                  <ThemedView style={styles.scoreBadge}>
                    <ThemedText style={styles.scoreValue}>{qs.score}</ThemedText>
                    <ThemedText style={styles.scoreTotal}>/ 100</ThemedText>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
        {quizScores.length === 0 && (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No hay calificaciones disponibles.
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      <ThemedView style={styles.contentContainer}>
        {activeTab === 'modules' ? (
          <FlatList
            data={accordionItems}
            renderItem={({ item }) => (
              <ThemedView style={styles.moduleRowContainer}>
                <ThemedView style={styles.moduleColumn}>
                  <ThemedView style={styles.accordionWrapper}>
                    <Accordion items={[item]} />
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderGrades()
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 12,
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.tabActive,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.tabInactive,
  },
  tabTextActive: {
    color: COLORS.tabActive,
  },
  moduleRowContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  moduleColumn: {
    flex: 1,
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
  lessonMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 6,
  },
  lessonDuration: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  lessonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonTypeIcon: {
    fontSize: 14,
    color: COLORS.text,
  },
  chevronIcon: {
    fontSize: 20,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  gradeSection: {
    marginBottom: 24,
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
  gradesContainer: {
    flex: 1,
  },
  gradesList: {
    paddingBottom: 20,
  },
  moduleGradeGroup: {
    marginBottom: 20,
  },
  moduleGradeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  scoreQuizTitle: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginRight: 12,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scoreTotal: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 2,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyStateText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
});
