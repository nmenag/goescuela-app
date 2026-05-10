import React from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { getQuizByCourseId } from '@/data/mockData';
import { useQuiz } from '@/hooks/useQuiz';

// New Components
import { QuizIntro } from '@/components/quiz/QuizIntro';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizReview } from '@/components/quiz/QuizReview';
import { QuizResults } from '@/components/quiz/QuizResults';

export default function QuizScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const quiz = getQuizByCourseId(courseId || '');
  const insets = useSafeAreaInsets();

  const {
    state,
    currentQuestionIndex,
    answers,
    score,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    retakeQuiz,
    goToQuestion,
    currentQuestion,
    progress,
    isAnswered,
  } = useQuiz(quiz || ({} as any));

  if (!quiz) {
    return (
      <ThemedView
        className="flex-1 justify-center items-center bg-brand-lightPink dark:bg-zinc-950"
        style={{ paddingTop: insets.top }}
      >
        <ThemedText className="text-gray-500 dark:text-gray-400">Quiz no encontrado</ThemedText>
      </ThemedView>
    );
  }

  if (state === 'intro') {
    return <QuizIntro quiz={quiz} onStart={startQuiz} onBack={() => router.back()} />;
  }

  if (state === 'results') {
    return (
      <QuizResults
        quiz={quiz}
        score={score}
        answers={answers}
        onRetake={retakeQuiz}
        onBack={() => router.back()}
      />
    );
  }

  if (state === 'review') {
    return (
      <QuizReview
        quiz={quiz}
        answers={answers}
        onGoToQuestion={goToQuestion}
        onSubmit={submitQuiz}
      />
    );
  }

  return (
    <ThemedView
      className="flex-1 bg-brand-lightPink dark:bg-zinc-950"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <ThemedView className="flex-row justify-between items-center px-4 py-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <ThemedText className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Cancelar
          </ThemedText>
        </TouchableOpacity>
        <ThemedText className="text-base font-bold text-gray-900 dark:text-gray-100">
          {quiz.title}
        </ThemedText>
        <View style={{ width: 60 }} />
      </ThemedView>

      {/* Progress Bar */}
      <ThemedView className="h-1.5 bg-gray-200 dark:bg-zinc-800 w-full overflow-hidden">
        <ThemedView className="h-full bg-brand-hotPink" style={{ width: `${progress}%` }} />
      </ThemedView>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        <View className="mb-3">
          <ThemedText className="text-xs font-bold text-brand-hotPink dark:text-pink-400 uppercase tracking-wider">
            Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </ThemedText>
        </View>

        <ThemedText className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 leading-[30px]">
          {currentQuestion.title}
        </ThemedText>

        <QuizQuestion
          question={currentQuestion}
          userAnswer={answers[currentQuestionIndex]}
          onSelect={selectAnswer}
        />
        <View className="h-10" />
      </ScrollView>

      {/* Navigation Footer */}
      <ThemedView
        className="flex-row px-5 pt-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <TouchableOpacity
          className={`flex-1 py-3.5 rounded-xl border-2 items-center justify-center ${
            currentQuestionIndex === 0
              ? 'opacity-30 border-gray-200 dark:border-zinc-800'
              : 'border-gray-200 dark:border-zinc-700'
          }`}
          onPress={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ThemedText className="text-base font-bold text-gray-600 dark:text-gray-300">
            Anterior
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-[2] py-3.5 rounded-xl items-center justify-center ${
            !isAnswered ? 'bg-gray-200 dark:bg-zinc-800' : 'bg-brand-hotPink'
          }`}
          onPress={nextQuestion}
          disabled={!isAnswered}
        >
          <ThemedText
            className={`text-base font-bold ${!isAnswered ? 'text-gray-400 dark:text-gray-500' : 'text-white'}`}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Revisar' : 'Siguiente'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
