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
  mockCourses,
} from '@/data/mockData';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle,
  PlayCircle,
  Video,
  FileText,
  BookOpen,
  Mic,
  HelpCircle,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOffline } from '@/hooks/useOffline';
import { Download } from 'lucide-react-native';

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
  const { isDownloaded } = useOffline();

  const enrolledCourses = mockCourses.filter((c) => student.enrolledCourses.includes(c.id));

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

  const getLessonIconComponent = (type: string, color: string, size: number) => {
    switch (type) {
      case 'video':
        return <Video size={size} color={color} />;
      case 'quiz':
        return <HelpCircle size={size} color={color} />;
      case 'resource':
        return <FileText size={size} color={color} />;
      case 'homework':
        return <BookOpen size={size} color={color} />;
      case 'audio':
        return <Mic size={size} color={color} />;
      default:
        return <PlayCircle size={size} color={color} />;
    }
  };

  const getLessonLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'audio':
        return 'Audio';
      case 'quiz':
        return 'Cuestionario';
      case 'resource':
        return 'Recurso';
      case 'homework':
        return 'Tarea';
      default:
        return 'Lección';
    }
  };

  const renderModules = () => {
    let globalLessonIndex = 0;

    return (
      <ScrollView
        contentContainerStyle={styles.modulesScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {course.modules.map((module, moduleIndex) => (
          <ThemedView key={module.id} style={styles.moduleSection}>
            <ThemedView style={styles.moduleHeaderContainer}>
              <ThemedText style={styles.moduleHeaderTitle}>UNIDAD {moduleIndex + 1}</ThemedText>
              <ThemedText style={styles.moduleHeaderSubtitle}>{module.title}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.lessonsPathContainer}>
              {module.lessons.map((lesson) => {
                const currentIndex = globalLessonIndex++;
                const isCompleted = progress?.completedLessons.includes(lesson.id);
                const isLocked =
                  course.sequential &&
                  (() => {
                    const { prev } = getAdjacentLessons(lesson.id);
                    if (prev && !progress?.completedLessons.includes(prev.id)) {
                      return true;
                    }
                    return false;
                  })();
                const isCurrent = !isCompleted && !isLocked;
                const xOffset = Math.sin(currentIndex) * 70;

                return (
                  <ThemedView
                    key={lesson.id}
                    style={[
                      styles.lessonNodeRow,
                      {
                        transform: [{ translateX: xOffset }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.circleButton,
                        isCompleted && styles.circleButtonCompleted,
                        isCurrent && styles.circleButtonCurrent,
                        isLocked && styles.circleButtonLocked,
                      ]}
                      onPress={() => !isLocked && router.push(`/lesson/${lesson.id}`)}
                      disabled={isLocked}
                      activeOpacity={0.7}
                    >
                      {isCompleted ? (
                        <CheckCircle size={32} color="#FFFFFF" strokeWidth={4} />
                      ) : (
                        getLessonIconComponent(lesson.type, isLocked ? '#9CA3AF' : '#FFFFFF', 32)
                      )}
                      {(() => {
                        const url = lesson.videoUrl || lesson.audioUrl || lesson.resourceUrl;
                        if (url && isDownloaded(url)) {
                          return (
                            <View style={styles.downloadIndicator}>
                              <Download size={12} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          );
                        }
                        return null;
                      })()}
                    </TouchableOpacity>
                    <ThemedView style={styles.lessonLabelContainer}>
                      <ThemedText
                        style={[styles.lessonLabelText, isLocked && styles.lessonLabelLocked]}
                      >
                        {lesson.title}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                );
              })}
            </ThemedView>
          </ThemedView>
        ))}
        <ThemedView style={{ height: 100 }} />
      </ScrollView>
    );
  };

  const renderHeader = () => (
    <ThemedView>
      <ThemedView style={styles.header}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={courseId}
            onValueChange={(itemValue) => {
              if (itemValue !== courseId) {
                router.replace({
                  pathname: '/learning-view',
                  params: { courseId: itemValue },
                });
              }
            }}
            style={styles.coursePicker}
            mode="dropdown"
            dropdownIconColor={COLORS.primary}
          >
            {enrolledCourses.map((c) => (
              <Picker.Item key={c.id} label={c.title} value={c.id} style={styles.pickerItem} />
            ))}
          </Picker>
        </View>
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
        {activeTab === 'modules' ? renderModules() : renderGrades()}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  pickerWrapper: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  coursePicker: {
    width: '100%',
    height: 48,
    color: COLORS.text,
  },
  pickerItem: {
    fontSize: 14,
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
  modulesScrollContent: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  moduleSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  moduleHeaderContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  moduleHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moduleHeaderSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 4,
  },
  lessonsPathContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  lessonNodeRow: {
    width: 120, // Width to accommodate label
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'visible',
  },
  circleButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 6,
    borderBottomColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  circleButtonCompleted: {
    backgroundColor: '#FFC107', // Gold/Amber
    borderColor: '#FFC107',
    borderBottomColor: '#FFA000',
  },
  circleButtonCurrent: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderBottomColor: '#C2185B',
  },
  circleButtonLocked: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
    borderBottomColor: '#9CA3AF',
  },
  lessonLabelContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: 120,
  },
  lessonLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  lessonLabelLocked: {
    color: COLORS.textLight,
  },
  downloadIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981', // Success green
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
