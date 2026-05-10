import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Quiz } from '@/data/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandingColors } from '@/constants/theme';

interface QuizIntroProps {
  quiz: Quiz;
  onStart: () => void;
  onBack: () => void;
}

export const QuizIntro = ({ quiz, onStart, onBack }: QuizIntroProps) => {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ThemedText style={styles.backButton}>← Volver</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Quiz</ThemedText>
        <ThemedView style={{ width: 60 }} />
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
              <ThemedText style={styles.infoLabel}>Puntaje</ThemedText>
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
              • Tu calificación se mostrará inmediatamente
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
    backgroundColor: BrandingColors.lightPink,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandingColors.hotPink,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  introContent: {
    flex: 1,
  },
  introContainer: {
    padding: 24,
    alignItems: 'center',
  },
  introIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  introDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  quizInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandingColors.hotPink,
  },
  instructions: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  introButtons: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  startButton: {
    backgroundColor: BrandingColors.hotPink,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: BrandingColors.hotPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
