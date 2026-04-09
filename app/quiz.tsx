import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { getQuizByCourseId } from '@/data/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: BrandingColors.lightPink,
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  error: '#DC2626',
};

type QuizState = 'intro' | 'questions' | 'review' | 'results';

export default function QuizScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const quiz = getQuizByCourseId(courseId || '');
  const insets = useSafeAreaInsets();

  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Quiz no encontrado</ThemedText>
      </ThemedView>
    );
  }

  const handleStartQuiz = () => {
    setState('questions');
    setAnswers(Array(quiz.questions.length).fill(null));
  };

  const handleSelectAnswer = (answer: any, type: string) => {
    const newAnswers = [...answers];

    // For sequence, answer represents the current ordered indices of questions.answers
    // For multiple choice, answer represents array of selected indices
    // For single choice, answer represents selected index

    if (type === 'multiple-choice' && typeof answer === 'number') {
      // Toggle selection for multiple choice with allowMultipleAnswers
      const currentSelection = (newAnswers[currentQuestionIndex] as number[]) || [];
      if (currentSelection.includes(answer)) {
        newAnswers[currentQuestionIndex] = currentSelection.filter((i) => i !== answer);
      } else {
        newAnswers[currentQuestionIndex] = [...currentSelection, answer];
      }
    } else {
      newAnswers[currentQuestionIndex] = answer;
    }
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];

      if (question.type === 'sequence') {
        // userAnswer should be array of indices in correct order
        // Compare with questions.answers sorted by 'order'
        // But mock data logic for verification needs to be robust.
        // We'll check if the User's order matches the correct 'order' field.

        // Actually simpler:
        // The mock answer has 'order' property.
        // userAnswer is array of indices of the *current* permutation.
        // Wait, simpler approach for sequence: userAnswer is the array of Answer objects in user's order.
        if (Array.isArray(userAnswer)) {
          const isCorrect = userAnswer.every((ans, i) => ans.order === i + 1);
          if (isCorrect) correctCount++;
        }
      } else if (question.allowMultipleAnswers) {
        // userAnswer is array of indices
        if (Array.isArray(userAnswer)) {
          const correctIndices = question.answers
            .map((a, i) => (a.is_correct ? i : -1))
            .filter((i) => i !== -1);

          const sortedUser = [...userAnswer].sort();
          const sortedCorrect = [...correctIndices].sort();

          if (
            sortedUser.length === sortedCorrect.length &&
            sortedUser.every((val, index) => val === sortedCorrect[index])
          ) {
            correctCount++;
          }
        }
      } else {
        // Single choice
        if (userAnswer !== null && question.answers[userAnswer]?.is_correct) {
          correctCount++;
        }
      }
    });
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setState('review');
    }
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setState('results');
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
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>← Volver</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{quiz.title}</ThemedText>
          <ThemedView />
        </ThemedView>

        {/* Progress Bar */}
        <ThemedView style={styles.progressContainer}>
          <ThemedView style={[styles.progressBar, { width: `${progress}%` }]} />
        </ThemedView>
        <ThemedText style={styles.progressText}>
          Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
        </ThemedText>

        {/* Question */}
        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.questionContainer}>
            <ThemedText style={styles.questionText}>{question.title}</ThemedText>

            {/* Options based on type */}
            <ThemedView style={styles.optionsContainer}>
              {question.type === 'sequence'
                ? // Initializing sequence if null
                  (() => {
                    // If we haven't saved a sequence yet, save the default one (or shuffled)
                    if (!answers[currentQuestionIndex]) {
                      // We should shuffle really, but checking 'order' is easier if we start shuffled?
                      // For now let's just use default order
                      // Ideally we set this in useEffect but here is okay for now
                    }

                    const handleMove = (fromIndex: number, direction: 'up' | 'down') => {
                      const list = [...(answers[currentQuestionIndex] || question.answers)];
                      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
                      if (toIndex >= 0 && toIndex < list.length) {
                        [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];
                        handleSelectAnswer(list, 'sequence');
                      }
                    };

                    return (answers[currentQuestionIndex] || question.answers).map(
                      (item: any, index: number) => (
                        <ThemedView key={index} style={styles.sequenceItem}>
                          <ThemedText style={styles.optionText}>{item.content}</ThemedText>
                          <ThemedView style={styles.sequenceControls}>
                            <TouchableOpacity
                              onPress={() => handleMove(index, 'up')}
                              disabled={index === 0}
                            >
                              <ThemedText
                                style={[styles.arrowText, index === 0 && styles.disabledArrow]}
                              >
                                ▲
                              </ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleMove(index, 'down')}
                              disabled={
                                index ===
                                (answers[currentQuestionIndex] || question.answers).length - 1
                              }
                            >
                              <ThemedText
                                style={[
                                  styles.arrowText,
                                  index ===
                                    (answers[currentQuestionIndex] || question.answers).length -
                                      1 && styles.disabledArrow,
                                ]}
                              >
                                ▼
                              </ThemedText>
                            </TouchableOpacity>
                          </ThemedView>
                        </ThemedView>
                      ),
                    );
                  })()
                : question.answers.map((option, index) => {
                    const isSelected = question.allowMultipleAnswers
                      ? (answers[currentQuestionIndex] as number[])?.includes(index)
                      : answers[currentQuestionIndex] === index;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                        onPress={() =>
                          handleSelectAnswer(
                            question.allowMultipleAnswers ? index : index,
                            question.allowMultipleAnswers ? 'multiple-choice' : 'single-choice',
                          )
                        }
                        activeOpacity={0.7}
                      >
                        <ThemedView style={styles.optionCircle}>
                          {isSelected && <ThemedText style={styles.optionCheck}>✓</ThemedText>}
                        </ThemedView>
                        <ThemedText
                          style={[styles.optionText, isSelected && styles.optionTextSelected]}
                        >
                          {option.content}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
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
            <ThemedText style={styles.navButtonText}>← Anterior</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !isAnswered && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isAnswered}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.nextButtonText}>
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Revisar' : 'Siguiente →'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  if (state === 'review') {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => setState('questions')}>
            <ThemedText style={styles.backButton}>← Volver al Quiz</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Revisar Respuestas</ThemedText>
          <ThemedView />
        </ThemedView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.reviewList}>
            {quiz.questions.map((q, i) => (
              <TouchableOpacity
                key={i}
                style={styles.reviewSummaryItem}
                onPress={() => {
                  setCurrentQuestionIndex(i);
                  setState('questions');
                }}
              >
                <ThemedText style={styles.reviewSummaryNum}>{i + 1}</ThemedText>
                <ThemedView style={styles.reviewSummaryContent}>
                  <ThemedText style={styles.reviewSummaryTitle} numberOfLines={1}>
                    {q.title}
                  </ThemedText>
                  <ThemedText style={styles.reviewSummaryStatus}>
                    {answers[i] ? 'Respondida' : 'Omitida'}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.arrowText}>›</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ScrollView>

        <ThemedView style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>Enviar Quiz</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  if (state === 'results') {
    const passed = score >= quiz.passingScore;
    const totalCorrect = Math.round((score / 100) * quiz.questions.length);

    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>← Volver</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Resultados</ThemedText>
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
              {passed ? '¡Quiz Aprobado!' : '¡Sigue Intentando!'}
            </ThemedText>
            <ThemedText style={styles.statusSubtext}>
              {passed
                ? `¡Buen trabajo! Has dominado este curso.`
                : `Necesitas ${quiz.passingScore}% para aprobar.`}
            </ThemedText>
          </ThemedView>

          {/* Score Display */}
          <ThemedView style={styles.scoreContainer}>
            <ThemedText style={styles.scoreValue}>{score}%</ThemedText>
            <ThemedText style={styles.scoreLabel}>Tu Calificación</ThemedText>
          </ThemedView>

          {/* Stats */}
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statBox}>
              <ThemedText style={styles.statBoxValue}>{totalCorrect}</ThemedText>
              <ThemedText style={styles.statBoxLabel}>Correctas</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statBox}>
              <ThemedText style={styles.statBoxValue}>
                {quiz.questions.length - totalCorrect}
              </ThemedText>
              <ThemedText style={styles.statBoxLabel}>Incorrectas</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statBox}>
              <ThemedText style={styles.statBoxValue}>{quiz.duration}</ThemedText>
              <ThemedText style={styles.statBoxLabel}>Minutos</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Review Section */}
          <ThemedView style={styles.reviewSection}>
            <ThemedText style={styles.reviewTitle}>Revisión de Respuestas</ThemedText>
            {quiz.questions.map((question, index) => {
              const selectedAnswerIndex = answers[index];
              const isCorrect =
                selectedAnswerIndex !== null && question.answers[selectedAnswerIndex]?.is_correct;
              return (
                <ThemedView key={index} style={styles.reviewItem}>
                  <ThemedView style={styles.reviewHeader}>
                    <ThemedText style={styles.reviewQuestionNum}>Pregunta {index + 1}</ThemedText>
                    <ThemedText
                      style={[
                        styles.reviewStatus,
                        isCorrect ? styles.reviewStatusCorrect : styles.reviewStatusIncorrect,
                      ]}
                    >
                      {isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.reviewQuestion}>{question.title}</ThemedText>
                  <ThemedText style={styles.reviewAnswer}>
                    Tu respuesta:{' '}
                    {selectedAnswerIndex !== null
                      ? question.answers[selectedAnswerIndex].content
                      : 'Sin respuesta'}
                  </ThemedText>
                  {!isCorrect && (
                    <ThemedText style={styles.correctAnswer}>
                      Respuesta correcta: {question.answers.find((a) => a.is_correct)?.content}
                    </ThemedText>
                  )}
                </ThemedView>
              );
            })}
          </ThemedView>
        </ScrollView>

        {/* Action Buttons */}
        <ThemedView style={[styles.resultsButtons, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake} activeOpacity={0.7}>
            <ThemedText style={styles.retakeButtonText}>Volver a intentar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.backHomeButtonText}>← Volver al Curso</ThemedText>
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
}) => {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ThemedText style={styles.backButton}>← Volver</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Quiz</ThemedText>
        <ThemedView />
      </ThemedView>

      <ScrollView style={styles.introContent} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.introContainer}>
          <ThemedText style={styles.introIcon}>🧠</ThemedText>
          <ThemedText style={styles.introTitle}>{quiz.title}</ThemedText>
          <ThemedText style={styles.introDescription}>
            Pon a prueba tus conocimientos con este quiz interactivo. Responde todas las preguntas
            para ver tus resultados.
          </ThemedText>

          <ThemedView style={styles.quizInfo}>
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Preguntas</ThemedText>
              <ThemedText style={styles.infoValue}>{quiz.questions.length}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Duración</ThemedText>
              <ThemedText style={styles.infoValue}>{quiz.duration} min</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Puntaje de aprobación</ThemedText>
              <ThemedText style={styles.infoValue}>{quiz.passingScore}%</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.instructions}>
            <ThemedText style={styles.instructionsTitle}>Instrucciones:</ThemedText>
            <ThemedText style={styles.instructionItem}>
              • Responde todas las preguntas para completar el quiz
            </ThemedText>
            <ThemedText style={styles.instructionItem}>
              • Puedes revisar tus respuestas antes de enviar
            </ThemedText>
            <ThemedText style={styles.instructionItem}>
              • Tu calificación se mostrará inmediatamente después de enviar
            </ThemedText>
            <ThemedText style={styles.instructionItem}>
              • Necesitas {quiz.passingScore}% para aprobar
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <ThemedView style={[styles.introButtons, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.7}>
          <ThemedText style={styles.startButtonText}>Comenzar Quiz</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: BrandingColors.hotPink,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    shadowColor: BrandingColors.hotPink,
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
  sequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  sequenceControls: {
    flexDirection: 'row',
    gap: 12,
  },
  arrowText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '700',
  },
  disabledArrow: {
    color: COLORS.textLight,
    opacity: 0.3,
  },
  reviewList: {
    padding: 20,
  },
  reviewSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  reviewSummaryNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '700',
    marginRight: 12,
  },
  reviewSummaryContent: {
    flex: 1,
  },
  reviewSummaryTitle: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  reviewSummaryStatus: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
});
