import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { getQuizByCourseId } from '@/data/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  error: '#DC2626',
};

type QuizState = 'intro' | 'questions' | 'results';

export default function QuizScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const quiz = getQuizByCourseId(courseId || '');

  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Quiz not found</ThemedText>
      </ThemedView>
    );
  }

  const handleStartQuiz = () => {
    setState('questions');
    setAnswers(Array(quiz.questions.length).fill(null));
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctCount++;
        }
      });
      const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
      setScore(finalScore);
      setState('results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetake = () => {
    setState('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
  };

  if (state === 'intro') {
    return <IntroScreen quiz={quiz} onStart={handleStartQuiz} onBack={() => router.back()} />;
  }

  if (state === 'questions') {
    const question = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const isAnswered = answers[currentQuestionIndex] !== null;

    return (
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{quiz.title}</ThemedText>
          <ThemedView />
        </ThemedView>

        {/* Progress Bar */}
        <ThemedView style={styles.progressContainer}>
          <ThemedView style={[styles.progressBar, { width: `${progress}%` }]} />
        </ThemedView>
        <ThemedText style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </ThemedText>

        {/* Question */}
        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.questionContainer}>
            <ThemedText style={styles.questionText}>{question.question}</ThemedText>

            {/* Options */}
            <ThemedView style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    answers[currentQuestionIndex] === index && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleSelectAnswer(index)}
                  activeOpacity={0.7}
                >
                  <ThemedView style={styles.optionCircle}>
                    {answers[currentQuestionIndex] === index && (
                      <ThemedText style={styles.optionCheck}>✓</ThemedText>
                    )}
                  </ThemedView>
                  <ThemedText
                    style={[
                      styles.optionText,
                      answers[currentQuestionIndex] === index && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Navigation Buttons */}
        <ThemedView style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.navButtonText}>← Previous</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !isAnswered && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isAnswered}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.nextButtonText}>
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit' : 'Next →'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  if (state === 'results') {
    const passed = score >= quiz.passingScore;
    const totalCorrect = Math.round((score / 100) * quiz.questions.length);

    return (
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Results</ThemedText>
          <ThemedView />
        </ThemedView>

        <ScrollView style={styles.resultsContent} showsVerticalScrollIndicator={false}>
          {/* Status Badge */}
          <ThemedView style={styles.statusContainer}>
            <ThemedView
              style={[
                styles.statusBadge,
                passed ? styles.statusBadgeSuccess : styles.statusBadgeFailure,
              ]}
            >
              <ThemedText style={styles.statusIcon}>{passed ? '✓' : '✗'}</ThemedText>
            </ThemedView>
            <ThemedText
              style={[styles.statusText, passed ? styles.statusSuccess : styles.statusFailure]}
            >
              {passed ? 'Quiz Passed!' : 'Keep Trying!'}
            </ThemedText>
            <ThemedText style={styles.statusSubtext}>
              {passed
                ? `Great job! You've mastered this course.`
                : `You need ${quiz.passingScore}% to pass.`}
            </ThemedText>
          </ThemedView>

          {/* Score Display */}
          <ThemedView style={styles.scoreContainer}>
            <ThemedText style={styles.scoreValue}>{score}%</ThemedText>
            <ThemedText style={styles.scoreLabel}>Your Score</ThemedText>
          </ThemedView>

          {/* Stats */}
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statBox}>
              <ThemedText style={styles.statBoxValue}>{totalCorrect}</ThemedText>
              <ThemedText style={styles.statBoxLabel}>Correct</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statBox}>
              <ThemedText style={styles.statBoxValue}>
                {quiz.questions.length - totalCorrect}
              </ThemedText>
              <ThemedText style={styles.statBoxLabel}>Incorrect</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statBox}>
              <ThemedText style={styles.statBoxValue}>{quiz.duration}</ThemedText>
              <ThemedText style={styles.statBoxLabel}>Minutes</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Review Section */}
          <ThemedView style={styles.reviewSection}>
            <ThemedText style={styles.reviewTitle}>Answer Review</ThemedText>
            {quiz.questions.map((question, index) => {
              const isCorrect = answers[index] === question.correctAnswer;
              return (
                <ThemedView key={index} style={styles.reviewItem}>
                  <ThemedView style={styles.reviewHeader}>
                    <ThemedText style={styles.reviewQuestionNum}>Question {index + 1}</ThemedText>
                    <ThemedText
                      style={[
                        styles.reviewStatus,
                        isCorrect ? styles.reviewStatusCorrect : styles.reviewStatusIncorrect,
                      ]}
                    >
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.reviewQuestion}>{question.question}</ThemedText>
                  <ThemedText style={styles.reviewAnswer}>
                    Your answer: {question.options[answers[index] ?? 0]}
                  </ThemedText>
                  {!isCorrect && (
                    <ThemedText style={styles.correctAnswer}>
                      Correct answer: {question.options[question.correctAnswer]}
                    </ThemedText>
                  )}
                  {question.explanation && (
                    <ThemedText style={styles.explanation}>{question.explanation}</ThemedText>
                  )}
                </ThemedView>
              );
            })}
          </ThemedView>
        </ScrollView>

        {/* Action Buttons */}
        <ThemedView style={styles.resultsButtons}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake} activeOpacity={0.7}>
            <ThemedText style={styles.retakeButtonText}>Retake Quiz</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.backHomeButtonText}>← Back to Course</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return null;
}

// Intro Screen Component
const IntroScreen = ({
  quiz,
  onStart,
  onBack,
}: {
  quiz: any;
  onStart: () => void;
  onBack: () => void;
}) => (
  <ThemedView style={styles.container}>
    <ThemedView style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <ThemedText style={styles.backButton}>← Back</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.headerTitle}>Quiz</ThemedText>
      <ThemedView />
    </ThemedView>

    <ScrollView style={styles.introContent} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.introContainer}>
        <ThemedText style={styles.introIcon}>🧠</ThemedText>
        <ThemedText style={styles.introTitle}>{quiz.title}</ThemedText>
        <ThemedText style={styles.introDescription}>
          Test your knowledge with this interactive quiz. Answer all questions to see your results.
        </ThemedText>

        <ThemedView style={styles.quizInfo}>
          <ThemedView style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Questions</ThemedText>
            <ThemedText style={styles.infoValue}>{quiz.questions.length}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Duration</ThemedText>
            <ThemedText style={styles.infoValue}>{quiz.duration} min</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Passing Score</ThemedText>
            <ThemedText style={styles.infoValue}>{quiz.passingScore}%</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.instructions}>
          <ThemedText style={styles.instructionsTitle}>Instructions:</ThemedText>
          <ThemedText style={styles.instructionItem}>
            • Answer all questions to complete the quiz
          </ThemedText>
          <ThemedText style={styles.instructionItem}>
            • You can review your answers before submitting
          </ThemedText>
          <ThemedText style={styles.instructionItem}>
            • Your score will be shown immediately after submission
          </ThemedText>
          <ThemedText style={styles.instructionItem}>
            • You need {quiz.passingScore}% to pass
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>

    <ThemedView style={styles.introButtons}>
      <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.7}>
        <ThemedText style={styles.startButtonText}>Start Quiz</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textLight,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  questionContent: {
    flex: 1,
  },
  questionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: COLORS.border,
    minHeight: 56,
  },
  optionButtonSelected: {
    backgroundColor: '#F3E8FF',
    borderColor: COLORS.primary,
  },
  optionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheck: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultsContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  statusBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadgeSuccess: {
    backgroundColor: '#DBEAFE',
  },
  statusBadgeFailure: {
    backgroundColor: '#FEE2E2',
  },
  statusIcon: {
    fontSize: 40,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusSuccess: {
    color: COLORS.success,
  },
  statusFailure: {
    color: COLORS.error,
  },
  statusSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 24,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBoxValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  reviewSection: {
    marginBottom: 30,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  reviewItem: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewQuestionNum: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewStatusCorrect: {
    color: COLORS.success,
  },
  reviewStatusIncorrect: {
    color: COLORS.error,
  },
  reviewQuestion: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  reviewAnswer: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 12,
    color: COLORS.success,
    marginBottom: 8,
  },
  explanation: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  resultsButtons: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  retakeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backHomeButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
  },
  backHomeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  introContent: {
    flex: 1,
  },
  introContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  introIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  quizInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(250, 224, 240, 0.5)',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  introButtons: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
