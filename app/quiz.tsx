import React from 'react';
import { TouchableOpacity, ScrollView, View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
      <View
        className="flex-1 justify-center items-center bg-brand-lightPink "
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-gray-500 ">Quiz no encontrado</Text>
      </View>
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
    <View className="flex-1 bg-brand-lightPink " style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200 ">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text className="text-sm font-semibold text-gray-500 ">Cancelar</Text>
        </TouchableOpacity>
        <Text className="text-base font-bold text-gray-900 ">{quiz.title}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Progress Bar */}
      <View className="h-1.5 bg-gray-200 w-full overflow-hidden">
        <View className="h-full bg-brand-hotPink" style={{ width: `${progress}%` }} />
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        <View className="mb-3">
          <Text className="text-xs font-bold text-brand-hotPink uppercase tracking-wider">
            Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </Text>
        </View>

        <Text className="text-2xl font-extrabold text-gray-900 mb-8 leading-[30px]">
          {currentQuestion.title}
        </Text>

        <QuizQuestion
          question={currentQuestion}
          userAnswer={answers[currentQuestionIndex]}
          onSelect={selectAnswer}
        />
        <View className="h-10" />
      </ScrollView>

      {/* Navigation Footer */}
      <View
        className="flex-row px-5 pt-4 bg-white border-t border-gray-200 gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <TouchableOpacity
          className={`flex-1 py-3.5 rounded-xl border-2 items-center justify-center ${
            currentQuestionIndex === 0 ? 'opacity-30 border-gray-200 ' : 'border-gray-200 '
          }`}
          onPress={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text className="text-base font-bold text-gray-600 ">Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-[2] py-3.5 rounded-xl items-center justify-center ${
            !isAnswered ? 'bg-gray-200 ' : 'bg-brand-hotPink'
          }`}
          onPress={nextQuestion}
          disabled={!isAnswered}
        >
          <Text className={`text-base font-bold ${!isAnswered ? 'text-gray-400 ' : 'text-white'}`}>
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Revisar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
