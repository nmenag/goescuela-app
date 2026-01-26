import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { mockQuizzes, Quiz } from '@/data/mockData';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDown, ArrowUp, Check, CheckCircle, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  correct: '#10B981',
  incorrect: '#EF4444',
  secondaryBackground: '#F3F4F6',
};

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const foundQuiz = mockQuizzes.find((q) => q.id === quizId);
    setQuiz(foundQuiz);
  }, [quizId]);

  useEffect(() => {
    if (quiz && quiz.questions[currentQuestionIndex]) {
      const question = quiz.questions[currentQuestionIndex];
      // Initialize sequence answer if needed
      if (question.type === 'sequence') {
        setUserAnswers((prev: any) => {
          // Only initialize if not already set
          if (!prev[currentQuestionIndex]) {
            const initialOrder = [...question.answers].sort(() => Math.random() - 0.5);
            return { ...prev, [currentQuestionIndex]: initialOrder };
          }
          return prev;
        });
      }
    }
  }, [currentQuestionIndex, quiz]);

  if (!quiz) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Cargando quiz...</ThemedText>
      </ThemedView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const hasAnswered = () => {
    const currentAns = userAnswers[currentQuestionIndex];

    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
      if (currentQuestion.allowMultipleAnswers) {
        // For multiple selection, check if array exists and has at least one item
        return Array.isArray(currentAns) && currentAns.length > 0;
      } else {
        // For single selection
        return currentAns !== undefined && currentAns !== null && currentAns !== '';
      }
    } else if (currentQuestion.type === 'text') {
      return currentAns !== undefined && currentAns !== null && currentAns.trim() !== '';
    } else if (currentQuestion.type === 'sequence') {
      return currentAns !== undefined && Array.isArray(currentAns) && currentAns.length > 0;
    } else if (currentQuestion.type === 'fill-in-blank') {
      const blanks = currentQuestion.answers.filter((a) => a.blank_position);
      if (!currentAns || typeof currentAns !== 'object') return false;
      // Check if at least one blank is filled
      return blanks.some((blank) => {
        const userVal = currentAns[blank.blank_position || 0];
        return userVal && userVal.trim() !== '';
      });
    }
    return false;
  };

  const handleNext = () => {
    if (showFeedback) {
      if (isLastQuestion) {
        finishQuiz();
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setShowFeedback(false);
      }
    } else {
      // Validate that user has answered before checking
      if (!hasAnswered()) {
        // You could show an alert or toast here
        alert('Por favor, selecciona una respuesta antes de continuar.');
        return;
      }
      checkAnswer();
      setShowFeedback(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowFeedback(false);
    }
  };

  const checkAnswer = () => {
    const currentAns = userAnswers[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
      if (currentQuestion.allowMultipleAnswers) {
        // For multiple selection, check if all correct answers are selected and no incorrect ones
        const correctAnswers = currentQuestion.answers
          .filter((a) => a.is_correct)
          .map((a) => a.content);
        const selectedAnswers = Array.isArray(currentAns) ? currentAns : [];

        // Check if arrays match (all correct selected, no incorrect selected)
        isCorrect =
          correctAnswers.length === selectedAnswers.length &&
          correctAnswers.every((ans) => selectedAnswers.includes(ans));
      } else {
        // Single selection
        const correctOption = currentQuestion.answers.find((a) => a.is_correct);
        if (correctOption && currentAns === correctOption.content) {
          isCorrect = true;
        }
      }
    } else if (currentQuestion.type === 'text') {
      const possibleAnswers = currentQuestion.answers.map((a) => a.content.toLowerCase());
      if (possibleAnswers.includes((currentAns || '').toLowerCase())) {
        isCorrect = true;
      }
    } else if (currentQuestion.type === 'sequence') {
      const correctOrder = [...currentQuestion.answers].sort(
        (a, b) => (a.order || 0) - (b.order || 0),
      );
      const userOrder = currentAns || [];
      if (userOrder.length === correctOrder.length) {
        isCorrect = userOrder.every(
          (item: any, index: number) => item.content === correctOrder[index].content,
        );
      }
    } else if (currentQuestion.type === 'fill-in-blank') {
      const blanks = currentQuestion.answers.filter((a) => a.blank_position);
      isCorrect = blanks.every((blank) => {
        const userVal = (currentAns || {})[blank.blank_position || 0];
        return userVal && userVal.toLowerCase() === blank.content.toLowerCase();
      });
    }

    // Store the correctness result
    setIsCurrentAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + (currentQuestion.pointMultiplier === 'double' ? 20 : 10));
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
      case 'true-false':
        return renderMultipleChoice();
      case 'text':
        return renderTextInput();
      case 'sequence':
        return renderSequence();
      case 'fill-in-blank':
        return renderFillInBlank();
      default:
        return <ThemedText>Unsupported question type</ThemedText>;
    }
  };

  const renderMultipleChoice = () => {
    const isMultiSelect = currentQuestion.allowMultipleAnswers;
    const currentAns = userAnswers[currentQuestionIndex];
    const selectedAnswers = isMultiSelect ? (Array.isArray(currentAns) ? currentAns : []) : null;

    const handleOptionPress = (content: string) => {
      if (showFeedback) return;

      if (isMultiSelect) {
        // Toggle selection for multiple choice
        const current = Array.isArray(currentAns) ? currentAns : [];
        const newSelection = current.includes(content)
          ? current.filter((item) => item !== content)
          : [...current, content];
        setUserAnswers({ ...userAnswers, [currentQuestionIndex]: newSelection });
      } else {
        // Single selection
        setUserAnswers({ ...userAnswers, [currentQuestionIndex]: content });
      }
    };

    return (
      <View style={styles.optionsContainer}>
        {isMultiSelect && (
          <ThemedText style={styles.multiSelectHint}>
            Selecciona todas las opciones correctas
          </ThemedText>
        )}
        {currentQuestion.answers.map((option, index) => {
          const isSelected = isMultiSelect
            ? selectedAnswers?.includes(option.content)
            : currentAns === option.content;
          let backgroundColor = '#F3F4F6';
          let borderColor = 'transparent';

          if (showFeedback) {
            if (option.is_correct) {
              backgroundColor = '#DCFCE7';
              borderColor = COLORS.correct;
            } else if (isSelected && !option.is_correct) {
              backgroundColor = '#FEE2E2';
              borderColor = COLORS.incorrect;
            }
          } else if (isSelected) {
            backgroundColor = '#FCE7F3';
            borderColor = COLORS.primary;
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, { backgroundColor, borderColor, borderWidth: 1 }]}
              onPress={() => handleOptionPress(option.content)}
              disabled={showFeedback}
            >
              <View style={styles.selectionIndicator}>
                {isMultiSelect ? (
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Check size={16} color="#FFFFFF" />}
                  </View>
                ) : (
                  <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]} />
                )}
              </View>
              <ThemedText style={styles.optionText}>{option.content}</ThemedText>
              {showFeedback && option.is_correct && <Check size={20} color={COLORS.correct} />}
              {showFeedback && isSelected && !option.is_correct && (
                <X size={20} color={COLORS.incorrect} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderTextInput = () => {
    const value = userAnswers[currentQuestionIndex] || '';
    let inputStyle = styles.textInput;
    if (showFeedback) {
      const possibleAnswers = currentQuestion.answers.map((a) => a.content.toLowerCase());
      const isCorrect = possibleAnswers.includes(value.toLowerCase());
      inputStyle = isCorrect ? styles.textInputCorrect : styles.textInputIncorrect;
    }

    return (
      <View style={styles.optionsContainer}>
        <TextInput
          style={inputStyle}
          placeholder="Escribe tu respuesta..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={(text) => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: text })}
          editable={!showFeedback}
        />
        {showFeedback && (
          <View style={styles.feedbackBox}>
            <ThemedText style={styles.feedbackLabel}>Respuestas correctas:</ThemedText>
            {currentQuestion.answers.map((a, i) => (
              <ThemedText key={i} style={styles.feedbackText}>
                • {a.content}
              </ThemedText>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderSequence = () => {
    const currentOrder = userAnswers[currentQuestionIndex] || currentQuestion.answers;

    const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
      if (showFeedback) return;
      const newOrder = [...currentOrder];
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

      if (toIndex >= 0 && toIndex < newOrder.length) {
        const item = newOrder[fromIndex];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, item);
        setUserAnswers({ ...userAnswers, [currentQuestionIndex]: newOrder });
      }
    };

    return (
      <View style={styles.optionsContainer}>
        <ThemedText style={styles.sequenceInstructions}>
          Usa las flechas para ordenar los elementos correctamente
        </ThemedText>
        {currentOrder.map((item: any, index: number) => (
          <View key={index} style={styles.sequenceItem}>
            <View style={styles.sequenceNumber}>
              <ThemedText style={styles.sequenceNumberText}>{index + 1}</ThemedText>
            </View>
            <ThemedText style={styles.sequenceText}>{item.content}</ThemedText>
            {!showFeedback && (
              <View style={styles.sequenceControls}>
                <TouchableOpacity
                  onPress={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  style={[styles.arrowButton, index === 0 && styles.arrowButtonDisabled]}
                >
                  <ArrowUp size={20} color={index === 0 ? '#E5E7EB' : COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => moveItem(index, 'down')}
                  disabled={index === currentOrder.length - 1}
                  style={[
                    styles.arrowButton,
                    index === currentOrder.length - 1 && styles.arrowButtonDisabled,
                  ]}
                >
                  <ArrowDown
                    size={20}
                    color={index === currentOrder.length - 1 ? '#E5E7EB' : COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {showFeedback && (
          <View style={styles.feedbackBox}>
            <ThemedText style={styles.feedbackLabel}>Orden Correcto:</ThemedText>
            {[...currentQuestion.answers]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((a, i) => (
                <ThemedText key={i} style={styles.feedbackText}>
                  {i + 1}. {a.content}
                </ThemedText>
              ))}
          </View>
        )}
      </View>
    );
  };

  const renderFillInBlank = () => {
    const template = currentQuestion.question_template || '';
    const parts = template.split('___');

    return (
      <View style={styles.fillBlankContainer}>
        <View style={styles.fillBlankRow}>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <ThemedText style={styles.fillBlankText}>{part}</ThemedText>
              {index < parts.length - 1 && (
                <TextInput
                  style={[
                    styles.fillBlankInput,
                    showFeedback &&
                      (currentQuestion.answers
                        .find((a) => a.blank_position === index + 1)
                        ?.content.toLowerCase() ===
                      (userAnswers[currentQuestionIndex]?.[index + 1] || '').toLowerCase()
                        ? styles.textInputCorrect
                        : styles.textInputIncorrect),
                  ]}
                  value={userAnswers[currentQuestionIndex]?.[index + 1] || ''}
                  onChangeText={(text) => {
                    const currentAns = userAnswers[currentQuestionIndex] || {};
                    setUserAnswers({
                      ...userAnswers,
                      [currentQuestionIndex]: { ...currentAns, [index + 1]: text },
                    });
                  }}
                  editable={!showFeedback}
                />
              )}
            </React.Fragment>
          ))}
        </View>
        {showFeedback && (
          <View style={styles.feedbackBox}>
            <ThemedText style={styles.feedbackLabel}>Respuestas:</ThemedText>
            {currentQuestion.answers
              .sort((a, b) => (a.blank_position || 0) - (b.blank_position || 0))
              .map((a, i) => (
                <ThemedText key={i} style={styles.feedbackText}>
                  Espacio {a.blank_position}: {a.content}
                </ThemedText>
              ))}
          </View>
        )}
      </View>
    );
  };

  if (isFinished) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ title: 'Resultados', headerBackVisible: false }} />
        <View style={styles.resultContainer}>
          <CheckCircle size={64} color={COLORS.correct} style={{ marginBottom: 20 }} />
          <ThemedText style={styles.resultTitle}>¡Quiz Completado!</ThemedText>
          <ThemedText style={styles.resultScore}>Puntuación: {score}</ThemedText>
          <TouchableOpacity style={styles.finishButton} onPress={() => router.back()}>
            <ThemedText style={styles.finishButtonText}>Volver a la lección</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: `Pregunta ${currentQuestionIndex + 1}/${quiz.questions.length}`,
          headerBackTitle: 'Salir',
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` },
              ]}
            />
          </View>

          <ThemedText style={styles.questionTitle}>{currentQuestion.title}</ThemedText>

          {renderQuestionContent()}

          {showFeedback && (
            <View
              style={[
                styles.feedbackContainer,
                isCurrentAnswerCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
              ]}
            >
              <ThemedText style={styles.feedbackMainText}>
                {isCurrentAnswerCorrect
                  ? currentQuestion.feedback?.correct ||
                    currentQuestion.feedback_on_correct ||
                    '¡Correcto!'
                  : currentQuestion.feedback?.incorrect ||
                    currentQuestion.feedback_on_incorrect ||
                    'Incorrecto. Inténtalo de nuevo.'}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={[styles.prevButton, currentQuestionIndex === 0 && styles.prevButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0 || showFeedback}
        >
          <ThemedText
            style={[
              styles.prevButtonText,
              currentQuestionIndex === 0 && styles.prevButtonDisabledText,
            ]}
          >
            Anterior
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <ThemedText style={styles.nextButtonText}>
            {showFeedback ? (isLastQuestion ? 'Finalizar' : 'Siguiente') : 'Comprobar'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: '#F9FAFB',
  },
  textInputCorrect: {
    borderWidth: 1,
    borderColor: COLORS.correct,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  textInputIncorrect: {
    borderWidth: 1,
    borderColor: COLORS.incorrect,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  sequenceInstructions: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  sequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 10,
  },
  sequenceNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sequenceNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sequenceText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  sequenceControls: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  fillBlankContainer: {
    marginBottom: 20,
  },
  fillBlankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  fillBlankText: {
    fontSize: 18,
    color: COLORS.text,
    marginVertical: 4,
  },
  fillBlankInput: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    minWidth: 80,
    marginHorizontal: 8,
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 2,
    color: COLORS.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    gap: 12,
  },
  prevButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  prevButtonDisabled: {
    borderColor: '#E5E7EB',
    opacity: 0.5,
  },
  prevButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  prevButtonDisabledText: {
    color: '#9CA3AF',
  },
  nextButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  finishButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  feedbackLabel: {
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 14,
  },
  feedbackText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  feedbackCorrect: {
    backgroundColor: '#ECFDF5',
    borderLeftColor: COLORS.correct,
  },
  feedbackIncorrect: {
    backgroundColor: '#FEF2F2',
    borderLeftColor: COLORS.incorrect,
  },
  feedbackMainText: {
    color: '#1E40AF',
    fontSize: 14,
  },
  multiSelectHint: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  selectionIndicator: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
});
