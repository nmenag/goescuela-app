import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Quiz } from '@/data/mockData';
import { BrandingColors } from '@/constants/theme';

interface QuizReviewProps {
  quiz: Quiz;
  answers: any[];
  onGoToQuestion: (index: number) => void;
  onSubmit: () => void;
}

export const QuizReview = ({ quiz, answers, onGoToQuestion, onSubmit }: QuizReviewProps) => {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Revisar Respuestas</ThemedText>
        <ThemedText style={styles.subtitle}>
          Asegúrate de haber respondido todas las preguntas antes de enviar.
        </ThemedText>

        <ThemedView style={styles.reviewList}>
          {quiz.questions.map((q, i) => (
            <TouchableOpacity key={i} style={styles.reviewItem} onPress={() => onGoToQuestion(i)}>
              <ThemedView style={styles.numBadge}>
                <ThemedText style={styles.numText}>{i + 1}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.itemContent}>
                <ThemedText style={styles.itemTitle} numberOfLines={1}>
                  {q.title}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.itemStatus,
                    answers[i] ? styles.statusAnswered : styles.statusSkipped,
                  ]}
                >
                  {answers[i] ? '✓ Respondida' : '⚠ Omitida'}
                </ThemedText>
              </ThemedView>
              <ThemedText style={styles.arrow}>›</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit} activeOpacity={0.8}>
          <ThemedText style={styles.submitButtonText}>Enviar Quiz</ThemedText>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  reviewList: {
    gap: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  numBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusAnswered: {
    color: '#10B981',
  },
  statusSkipped: {
    color: '#EF4444',
  },
  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: BrandingColors.hotPink,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
