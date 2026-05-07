import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Quiz no encontrado</ThemedText>
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
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={20}>
          <ThemedText style={styles.backButton}>Cancelar</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{quiz.title}</ThemedText>
        <ThemedView style={{ width: 60 }} />
      </ThemedView>

      {/* Progress Bar */}
      <ThemedView style={styles.progressContainer}>
        <ThemedView style={[styles.progressBar, { width: `${progress}%` }]} />
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.questionMeta}>
          <ThemedText style={styles.questionCount}>
            Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </ThemedText>
        </ThemedView>

        <ThemedText style={styles.questionTitle}>{currentQuestion.title}</ThemedText>

        <QuizQuestion
          question={currentQuestion}
          userAnswer={answers[currentQuestionIndex]}
          onSelect={selectAnswer}
        />
      </ScrollView>

      {/* Navigation Footer */}
      <ThemedView style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ThemedText style={styles.navButtonText}>Anterior</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, !isAnswered && styles.nextButtonDisabled]}
          onPress={nextQuestion}
          disabled={!isAnswered}
        >
          <ThemedText style={styles.nextButtonText}>
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Revisar' : 'Siguiente'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandingColors.lightPink,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: BrandingColors.hotPink,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionMeta: {
    marginBottom: 12,
  },
  questionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandingColors.hotPink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 32,
    lineHeight: 30,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: BrandingColors.hotPink,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
