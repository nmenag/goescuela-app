import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import {
  getCourseById,
  getCurrentStudent,
  getStudentCourseProgress,
  getStudentCourseQuizScores,
  getAdjacentLessons,
  mockQuizzes,
} from '@/data/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Accordion } from '../components/accordion';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: BrandingColors.lightPink,
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
  const insets = useSafeAreaInsets();

  const course = getCourseById(courseId || '');
  const student = getCurrentStudent();
  const progress = getStudentCourseProgress(student.id, courseId || '');
  const quizScores = getStudentCourseQuizScores(student.id, courseId || '');

  if (!course) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
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
        <ThemedView style={styles.horizontalSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lessonsHorizontalContainer}
          >
            {module.lessons.map((lesson) => {
              const isLocked =
                course.sequential &&
                (() => {
                  const { prev } = getAdjacentLessons(lesson.id);
                  if (prev && !progress?.completedLessons.includes(prev.id)) {
                    return true;
                  }
                  return false;
                })();

              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[styles.circularLessonItem, isLocked && styles.circularLessonItemLocked]}
                  activeOpacity={isLocked ? 1 : 0.7}
                  onPress={() => !isLocked && router.push(`/lesson/${lesson.id}`)}
                  disabled={isLocked}
                >
                  <ThemedView
                    style={[
                      styles.circularLessonIcon,
                      progress?.completedLessons.includes(lesson.id) &&
                        styles.circularLessonCompleted,
                      isLocked && styles.circularLessonIconLocked,
                    ]}
                  >
                    {isLocked ? (
                      <Lock size={20} color={COLORS.textLight} />
                    ) : (
                      <>
                        <ThemedText
                          style={[
                            styles.lessonTypeIcon,
                            progress?.completedLessons.includes(lesson.id) &&
                              styles.circularLessonTextCompleted,
                          ]}
                        >
                          {getLessonIcon(lesson.type)}
                        </ThemedText>
                        {progress?.completedLessons.includes(lesson.id) && (
                          <ThemedView style={styles.circularCheckBadge}>
                            <CheckCircle size={14} color="#FFFFFF" fill={BrandingColors.hotPink} />
                          </ThemedView>
                        )}
                      </>
                    )}
                  </ThemedView>
                  <ThemedText
                    style={[
                      styles.circularLessonTitle,
                      isLocked && styles.circularLessonTitleLocked,
                    ]}
                    numberOfLines={1}
                  >
                    {lesson.title}
                  </ThemedText>
                  <ThemedText style={styles.circularLessonLabel}>
                    {isLocked ? 'Bloqueado' : getLessonLabel(lesson.type)}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
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
  horizontalSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lessonsHorizontalContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 20,
    backgroundColor: 'transparent',
  },
  circularLessonItem: {
    alignItems: 'center',
    width: 80,
  },
  circularLessonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  circularLessonCompleted: {
    borderColor: BrandingColors.hotPink,
    backgroundColor: BrandingColors.lightPink,
  },
  circularLessonTextCompleted: {
    color: BrandingColors.hotPink,
  },
  circularCheckBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  circularLessonTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    width: '100%',
  },
  circularLessonLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },
  lessonTypeIcon: {
    fontSize: 18,
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
  circularLessonItemLocked: {
    opacity: 0.7,
  },
  circularLessonIconLocked: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  circularLessonTitleLocked: {
    color: COLORS.textLight,
  },
});
