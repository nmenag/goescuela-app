import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { getLessonById, Lesson } from '@/data/mockData';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  secondaryBackground: '#F3F4F6',
};

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const lesson = getLessonById(lessonId || '');

  if (!lesson) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Lección no encontrada</ThemedText>
      </ThemedView>
    );
  }

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return renderVideoContent(lesson);
      case 'audio':
        return renderAudioContent(lesson);
      case 'quiz':
        return renderQuizContent(lesson);
      case 'resource':
        return renderResourceContent(lesson);
      case 'homework':
        return renderHomeworkContent(lesson);
      default:
        return (
          <ThemedView>
            <ThemedText>Tipo de contenido no soportado.</ThemedText>
          </ThemedView>
        );
    }
  };

  const renderVideoContent = (lesson: Lesson) => (
    <View style={styles.contentWrapper}>
      <View style={styles.mediaPlaceholder}>
        <ThemedText style={styles.mediaPlaceholderText}>▶ Reproductor de Video</ThemedText>
        <ThemedText style={styles.mediaUrlText}>{lesson.videoUrl}</ThemedText>
      </View>
      <ThemedText style={styles.description}>{lesson.description}</ThemedText>
    </View>
  );

  const renderAudioContent = (lesson: Lesson) => (
    <View style={styles.contentWrapper}>
      <View style={[styles.mediaPlaceholder, styles.audioPlaceholder]}>
        <ThemedText style={styles.mediaPlaceholderIcon}>🎧</ThemedText>
        <ThemedText style={styles.mediaPlaceholderText}>Reproductor de Audio</ThemedText>
        <ThemedText style={styles.mediaUrlText}>{lesson.audioUrl}</ThemedText>
      </View>
      <ThemedText style={styles.description}>{lesson.description}</ThemedText>
    </View>
  );

  const renderResourceContent = (lesson: Lesson) => (
    <View style={styles.contentWrapper}>
      <View style={styles.resourceCard}>
        <ThemedText style={styles.resourceIcon}>📄</ThemedText>
        <View style={styles.resourceInfo}>
          <ThemedText style={styles.resourceTitle}>Recurso PDF</ThemedText>
          <ThemedText style={styles.resourceLink}>{lesson.resourceUrl}</ThemedText>
        </View>
        <TouchableOpacity style={styles.openButton}>
          <ThemedText style={styles.openButtonText}>Abrir</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.description}>{lesson.description}</ThemedText>
    </View>
  );

  const renderHomeworkContent = (lesson: Lesson) => (
    <View style={styles.contentWrapper}>
      <View style={styles.homeworkCard}>
        <ThemedText style={styles.homeworkLabel}>Instrucciones de la Tarea:</ThemedText>
        <ThemedText style={styles.homeworkText}>{lesson.homeworkContent}</ThemedText>
      </View>
      <ThemedText style={styles.description}>{lesson.description}</ThemedText>
      <TouchableOpacity style={styles.uploadButton}>
        <ThemedText style={styles.uploadButtonText}>Subir Tarea</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderQuizContent = (lesson: Lesson) => (
    <View style={styles.contentWrapper}>
      <View style={styles.quizCard}>
        <ThemedText style={styles.quizTitle}>Evaluación Disponible</ThemedText>
        <ThemedText style={styles.quizInfo}>
          Esta lección incluye un cuestionario para evaluar tu aprendizaje.
        </ThemedText>
        <TouchableOpacity style={styles.startButton}>
          <ThemedText style={styles.startButtonText}>Comenzar Quiz</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: lesson.title, headerBackTitle: 'Atrás' }} />

      {/* Custom Header if needed, otherwise Stack.Screen handles it mostly */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonTouch}>
          <ThemedText style={styles.backButton}>← Volver</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.typeLabel}>{lesson.type.toUpperCase()}</ThemedText>
          <ThemedText style={styles.title}>{lesson.title}</ThemedText>
          <ThemedText style={styles.duration}>⏱ {lesson.duration} min</ThemedText>
        </ThemedView>

        {renderContent()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButtonTouch: {
    alignSelf: 'flex-start',
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 24,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  contentWrapper: {
    gap: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  mediaPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  audioPlaceholder: {
    height: 150,
    backgroundColor: COLORS.secondaryBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mediaPlaceholderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  mediaPlaceholderIcon: {
    fontSize: 40,
  },
  mediaUrlText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.secondaryBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resourceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  resourceLink: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  openButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  openButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  homeworkCard: {
    padding: 20,
    backgroundColor: '#FFFBEB', // Light yellow for homework
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  homeworkLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  homeworkText: {
    fontSize: 16,
    color: '#92400E',
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quizCard: {
    padding: 24,
    backgroundColor: COLORS.secondaryBackground,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: COLORS.text,
  },
  quizInfo: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
