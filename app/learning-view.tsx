import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
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
      <ThemedView className="flex-1 justify-center items-center bg-brand-lightPink dark:bg-zinc-950">
        <ThemedText className="text-gray-500 dark:text-gray-400">Curso no encontrado</ThemedText>
      </ThemedView>
    );
  }

  const handleLessonPress = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const renderModules = () => {
    let globalLessonIndex = 0;
    return (
      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
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
        <View className="h-32" />
      </ScrollView>
    );
  };

  const renderGrades = () => (
    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      {course.modules.map((module) => {
        const moduleScores = quizScores.filter((qs) => qs.moduleId === module.id);
        if (moduleScores.length === 0) return null;

        return (
          <View key={module.id} className="mb-6">
            <ThemedText className="text-sm font-extrabold text-gray-700 dark:text-gray-300 mb-3 pl-1">
              {module.title}
            </ThemedText>
            {moduleScores.map((qs, index) => {
              const quiz = mockQuizzes.find((q) => q.id === qs.quizId);
              return (
                <View
                  key={index}
                  className="flex-row justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 mb-2"
                >
                  <ThemedText className="text-[15px] font-bold text-gray-900 dark:text-gray-100 flex-1">
                    {quiz?.title || 'Evaluación'}
                  </ThemedText>
                  <View className="flex-row items-baseline bg-gray-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                    <ThemedText className="text-base font-black text-brand-hotPink dark:text-pink-400">
                      {qs.score}
                    </ThemedText>
                    <ThemedText className="text-xs text-gray-400 ml-0.5">/ 100</ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
      {quizScores.length === 0 && (
        <View className="items-center mt-10">
          <ThemedText className="text-sm text-gray-400 dark:text-gray-500">
            No hay calificaciones aún.
          </ThemedText>
        </View>
      )}
    </ScrollView>
  );

  return (
    <ThemedView
      className="flex-1 bg-brand-lightPink dark:bg-zinc-950"
      style={{ paddingTop: insets.top }}
    >
      {/* Header with Selector */}
      <View className="p-4">
        <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <Picker
            selectedValue={courseId}
            onValueChange={(val) =>
              router.replace({ pathname: '/learning-view', params: { courseId: val } })
            }
            style={{ height: 50, width: '100%', color: BrandingColors.black }}
            dropdownIconColor={BrandingColors.hotPink}
          >
            {enrolledCourses.map((c) => (
              <Picker.Item key={c.id} label={c.title} value={c.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Progress Card */}
      <View className="px-4 mb-4">
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-zinc-800 shadow-sm shadow-black/5">
          <View className="flex-row justify-between items-center mb-3">
            <ThemedText className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tu Progreso
            </ThemedText>
            <ThemedText className="text-2xl font-black text-brand-hotPink dark:text-pink-400">
              {Math.round(progress?.progress || 0)}%
            </ThemedText>
          </View>
          <View className="h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-brand-hotPink rounded-full"
              style={{ width: `${progress?.progress || 0}%` }}
            />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 dark:border-zinc-800 px-4">
        <TouchableOpacity
          className={`flex-1 py-3.5 items-center border-b-2 ${activeTab === 'modules' ? 'border-brand-hotPink' : 'border-transparent'}`}
          onPress={() => setActiveTab('modules')}
        >
          <ThemedText
            className={`text-[15px] font-bold ${activeTab === 'modules' ? 'text-brand-hotPink dark:text-pink-400' : 'text-gray-400 dark:text-gray-500'}`}
          >
            Módulos
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3.5 items-center border-b-2 ${activeTab === 'grades' ? 'border-brand-hotPink' : 'border-transparent'}`}
          onPress={() => setActiveTab('grades')}
        >
          <ThemedText
            className={`text-[15px] font-bold ${activeTab === 'grades' ? 'text-brand-hotPink dark:text-pink-400' : 'text-gray-400 dark:text-gray-500'}`}
          >
            Calificaciones
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">{activeTab === 'modules' ? renderModules() : renderGrades()}</View>
    </ThemedView>
  );
}
