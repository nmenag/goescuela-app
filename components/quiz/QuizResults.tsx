import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Quiz } from '@/data/mockData';
import { BrandingColors } from '@/constants/theme';

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  answers: any[];
  onRetake: () => void;
  onBack: () => void;
}

export const QuizResults = ({ quiz, score, answers, onRetake, onBack }: QuizResultsProps) => {
  const passed = score >= quiz.passingScore;
  const totalCorrect = Math.round((score / 100) * quiz.questions.length);

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.statusSection}>
          <ThemedView
            style={[
              styles.statusCircle,
              passed ? styles.statusCircleSuccess : styles.statusCircleFailure,
            ]}
          >
            <ThemedText style={styles.statusIcon}>{passed ? '🎉' : '💪'}</ThemedText>
          </ThemedView>
          <ThemedText
            style={[
              styles.statusTitle,
              passed ? styles.statusTitleSuccess : styles.statusTitleFailure,
            ]}
          >
            {passed ? '¡Aprobaste!' : 'Sigue practicando'}
          </ThemedText>
          <ThemedText style={styles.statusSubtitle}>
            {passed
              ? 'Has demostrado un gran dominio del tema.'
              : `Necesitas ${quiz.passingScore}% para aprobar.`}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.scoreCard}>
          <ThemedText style={styles.scoreValue}>{score}%</ThemedText>
          <ThemedText style={styles.scoreLabel}>Puntaje Final</ThemedText>

          <ThemedView style={styles.statsRow}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>{totalCorrect}</ThemedText>
              <ThemedText style={styles.statLabel}>Correctas</ThemedText>
            </ThemedView>
            <View style={styles.divider} />
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {quiz.questions.length - totalCorrect}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Incorrectas</ThemedText>
            </ThemedView>
            <View style={styles.divider} />
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>{quiz.duration}</ThemedText>
              <ThemedText style={styles.statLabel}>Minutos</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.reviewSection}>
          <ThemedText style={styles.reviewTitle}>Resumen de Respuestas</ThemedText>
          {quiz.questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect =
              q.type === 'sequence'
                ? userAnswer?.every((ans: any, idx: number) => ans.order === idx + 1)
                : q.allowMultipleAnswers
                  ? (() => {
                      const correct = q.answers
                        .map((a, idx) => (a.is_correct ? idx : -1))
                        .filter((idx) => idx !== -1);
                      return (
                        Array.isArray(userAnswer) &&
                        userAnswer.length === correct.length &&
                        userAnswer.every((val) => correct.includes(val))
                      );
                    })()
                  : userAnswer !== null && q.answers[userAnswer]?.is_correct;

            return (
              <ThemedView key={i} style={styles.reviewItem}>
                <ThemedView style={styles.reviewHeader}>
                  <ThemedText style={styles.reviewNum}>Pregunta {i + 1}</ThemedText>
                  <ThemedView
                    style={[
                      styles.resultBadge,
                      isCorrect ? styles.badgeSuccess : styles.badgeError,
                    ]}
                  >
                    <ThemedText style={styles.badgeText}>
                      {isCorrect ? 'Correcta' : 'Incorrecta'}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedText style={styles.reviewQuestionText}>{q.title}</ThemedText>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <ThemedText style={styles.retakeButtonText}>Intentar de nuevo</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ThemedText style={styles.backButtonText}>Finalizar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandingColors.lightPink,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  statusCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusCircleSuccess: {
    backgroundColor: '#DCFCE7',
  },
  statusCircleFailure: {
    backgroundColor: '#FEE2E2',
  },
  statusIcon: {
    fontSize: 48,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  statusTitleSuccess: {
    color: '#16A34A',
  },
  statusTitleFailure: {
    color: '#DC2626',
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    color: BrandingColors.hotPink,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  reviewSection: {
    marginBottom: 40,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  reviewItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  badgeError: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reviewQuestionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  retakeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: BrandingColors.hotPink,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
