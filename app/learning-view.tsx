import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import {
  getCourseById,
  getCurrentStudent,
  getStudentCourseProgress,
  getStudentCourseQuizScores,
  mockQuizzes,
  mockCourses,
} from '@/data/mockData';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOffline } from '@/hooks/useOffline';

// Components
import { ModuleSection } from '@/components/learning/ModuleSection';

export default function LearningViewScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = React.useState<'modules' | 'grades'>('modules');
  const insets = useSafeAreaInsets();
  const { isDownloaded } = useOffline();

  const course = getCourseById(courseId || '');
  const student = getCurrentStudent();
  const progress = getStudentCourseProgress(student.id, courseId || '');
  const quizScores = getStudentCourseQuizScores(student.id, courseId || '');

  const enrolledCourses = mockCourses.filter((c) => student.enrolledCourses.includes(c.id));

  if (!course) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Curso no encontrado</ThemedText>
      </ThemedView>
    );
  }

  const handleLessonPress = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const renderModules = () => {
    let globalLessonIndex = 0;
    return (
      <ScrollView contentContainerStyle={styles.modulesScroll} showsVerticalScrollIndicator={false}>
        {course.modules.map((module, idx) => {
          const currentStartIndex = globalLessonIndex;
          globalLessonIndex += module.lessons.length;
          return (
            <ModuleSection
              key={module.id}
              module={module}
              moduleIndex={idx}
              progress={progress}
              sequential={course.sequential || false}
              isDownloaded={isDownloaded}
              onLessonPress={handleLessonPress}
              startIndex={currentStartIndex}
            />
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>
    );
  };

  const renderGrades = () => (
    <ScrollView contentContainerStyle={styles.gradesScroll} showsVerticalScrollIndicator={false}>
      {course.modules.map((module) => {
        const moduleScores = quizScores.filter((qs) => qs.moduleId === module.id);
        if (moduleScores.length === 0) return null;

        return (
          <View key={module.id} style={styles.gradeGroup}>
            <ThemedText style={styles.gradeGroupTitle}>{module.title}</ThemedText>
            {moduleScores.map((qs, index) => {
              const quiz = mockQuizzes.find((q) => q.id === qs.quizId);
              return (
                <View key={index} style={styles.gradeRow}>
                  <ThemedText style={styles.gradeQuizTitle}>
                    {quiz?.title || 'Evaluación'}
                  </ThemedText>
                  <View style={styles.gradeBadge}>
                    <ThemedText style={styles.gradeValue}>{qs.score}</ThemedText>
                    <ThemedText style={styles.gradeTotal}>/ 100</ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
      {quizScores.length === 0 && (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>No hay calificaciones aún.</ThemedText>
        </View>
      )}
    </ScrollView>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with Selector */}
      <View style={styles.header}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={courseId}
            onValueChange={(val) =>
              router.replace({ pathname: '/learning-view', params: { courseId: val } })
            }
            style={styles.picker}
          >
            {enrolledCourses.map((c) => (
              <Picker.Item key={c.id} label={c.title} value={c.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Progress Card */}
      <View style={styles.progressSection}>
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <ThemedText style={styles.progressLabel}>Tu Progreso</ThemedText>
            <ThemedText style={styles.progressPercent}>
              {Math.round(progress?.progress || 0)}%
            </ThemedText>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress?.progress || 0}%` }]} />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'modules' && styles.tabActive]}
          onPress={() => setActiveTab('modules')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'modules' && styles.tabTextActive]}>
            Módulos
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'grades' && styles.tabActive]}
          onPress={() => setActiveTab('grades')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'grades' && styles.tabTextActive]}>
            Calificaciones
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'modules' ? renderModules() : renderGrades()}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandingColors.lightPink,
  },
  header: {
    padding: 16,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  progressSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '900',
    color: BrandingColors.hotPink,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BrandingColors.hotPink,
    borderRadius: 5,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: BrandingColors.hotPink,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: BrandingColors.hotPink,
  },
  content: {
    flex: 1,
  },
  modulesScroll: {
    paddingVertical: 24,
  },
  gradesScroll: {
    padding: 20,
  },
  gradeGroup: {
    marginBottom: 24,
  },
  gradeGroupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 12,
    paddingLeft: 4,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  gradeQuizTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: BrandingColors.hotPink,
  },
  gradeTotal: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 2,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
