import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
      <View className="flex-1 justify-center items-center bg-brand-lightPink ">
        <Text className="text-gray-500 ">Curso no encontrado</Text>
      </View>
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
            <Text className="text-sm font-extrabold text-gray-700 mb-3 pl-1">{module.title}</Text>
            {moduleScores.map((qs, index) => {
              const quiz = mockQuizzes.find((q) => q.id === qs.quizId);
              return (
                <View
                  key={index}
                  className="flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 mb-2"
                >
                  <Text className="text-[15px] font-bold text-gray-900 flex-1">
                    {quiz?.title || 'Evaluación'}
                  </Text>
                  <View className="flex-row items-baseline bg-gray-50 px-2.5 py-1 rounded-lg">
                    <Text className="text-base font-black text-brand-hotPink ">{qs.score}</Text>
                    <Text className="text-xs text-gray-400 ml-0.5">/ 100</Text>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
      {quizScores.length === 0 && (
        <View className="items-center mt-10">
          <Text className="text-sm text-gray-400 ">No hay calificaciones aún.</Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-brand-lightPink " style={{ paddingTop: insets.top }}>
      {/* Header with Selector */}
      <View className="p-4">
        <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
        <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm shadow-black/5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Tu Progreso
            </Text>
            <Text className="text-2xl font-black text-brand-hotPink ">
              {Math.round(progress?.progress || 0)}%
            </Text>
          </View>
          <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-brand-hotPink rounded-full"
              style={{ width: `${progress?.progress || 0}%` }}
            />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 px-4">
        <TouchableOpacity
          className={`flex-1 py-3.5 items-center border-b-2 ${activeTab === 'modules' ? 'border-brand-hotPink' : 'border-transparent'}`}
          onPress={() => setActiveTab('modules')}
        >
          <Text
            className={`text-[15px] font-bold ${activeTab === 'modules' ? 'text-brand-hotPink ' : 'text-gray-400 '}`}
          >
            Módulos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3.5 items-center border-b-2 ${activeTab === 'grades' ? 'border-brand-hotPink' : 'border-transparent'}`}
          onPress={() => setActiveTab('grades')}
        >
          <Text
            className={`text-[15px] font-bold ${activeTab === 'grades' ? 'text-brand-hotPink ' : 'text-gray-400 '}`}
          >
            Calificaciones
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">{activeTab === 'modules' ? renderModules() : renderGrades()}</View>
    </View>
  );
}
