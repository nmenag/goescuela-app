import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import {
  getAdjacentLessons,
  getCourseIdByLessonId,
  getCurrentStudent,
  getLessonById,
  getStudentCourseProgress,
  Lesson,
} from '@/data/mockData';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as WebBrowser from 'expo-web-browser';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';
import {
  CheckCircle,
  Circle,
  Pause,
  Play,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOffline } from '@/hooks/useOffline';
import { Check } from 'lucide-react-native';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: BrandingColors.lightPink,
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  secondaryBackground: '#F3F4F6',
};

function VideoLesson({ videoUrl, description }: { videoUrl: string; description?: string }) {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
  });

  return (
    <View style={styles.contentWrapper}>
      <VideoView style={styles.video} player={player} allowsPictureInPicture />
      <ThemedText style={styles.description}>{description}</ThemedText>
    </View>
  );
}

function AudioLesson({ audioUrl, description }: { audioUrl: string; description?: string }) {
  const player = useVideoPlayer(audioUrl);
  const [isPlaying, setIsPlaying] = useState(player.playing);

  useEffect(() => {
    const subscription = player.addListener('playingChange', ({ isPlaying }) => {
      setIsPlaying(isPlaying);
    });
    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={styles.contentWrapper}>
      <View style={styles.audioContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
          style={styles.iconButton}
        >
          {isPlaying ? (
            <Pause size={32} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.description}>{description}</ThemedText>
    </View>
  );
}

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lesson = getLessonById(lessonId || '');
  const { prev, next } = getAdjacentLessons(lessonId || '');
  const student = getCurrentStudent();

  const courseId = getCourseIdByLessonId(lessonId || '') || '';
  const progress = getStudentCourseProgress(student.id, courseId);
  const isLessonCompletedInitial = progress?.completedLessons.includes(lessonId || '') || false;

  const [isCompleted, setIsCompleted] = useState(isLessonCompletedInitial);
  const { download, remove, isDownloaded, isDownloading, getEffectiveUri } = useOffline();

  useEffect(() => {
    setIsCompleted(progress?.completedLessons.includes(lessonId || '') || false);
  }, [lessonId, progress]);

  const lessonResourceUrl = useMemo(() => {
    if (!lesson) return null;
    return lesson.videoUrl || lesson.audioUrl || lesson.resourceUrl || null;
  }, [lesson]);

  const isCurrentDownloaded = lessonResourceUrl ? isDownloaded(lessonResourceUrl) : false;
  const isCurrentDownloading = lessonResourceUrl ? isDownloading[lessonResourceUrl] : false;

  const handleDownload = async () => {
    if (!lessonResourceUrl || isCurrentDownloaded) return;
    await download(lessonResourceUrl);
  };

  const toggleCompletion = () => {
    if (progress) {
      if (isCompleted) {
        progress.completedLessons = progress.completedLessons.filter((id) => id !== lessonId);
      } else {
        if (lessonId && !progress.completedLessons.includes(lessonId)) {
          progress.completedLessons.push(lessonId);
        }
      }
      setIsCompleted(!isCompleted);
    }
  };

  if (!lesson) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
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
    <VideoLesson
      videoUrl={getEffectiveUri(lesson.videoUrl || '')}
      description={lesson.description}
    />
  );

  const renderAudioContent = (lesson: Lesson) => (
    <AudioLesson
      audioUrl={getEffectiveUri(lesson.audioUrl || '')}
      description={lesson.description}
    />
  );

  const renderResourceContent = (lesson: Lesson) => {
    const effectiveResourceUrl = getEffectiveUri(lesson.resourceUrl || '');
    const handleOpenResource = async () => {
      if (!effectiveResourceUrl) return;

      const isLocal = effectiveResourceUrl.startsWith('file://');

      if (isLocal && Platform.OS === 'android') {
        try {
          const contentUri = await FileSystem.getContentUriAsync(effectiveResourceUrl);
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: contentUri,
            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            type: 'application/pdf',
          });
        } catch (error) {
          console.error('Error opening local PDF:', error);
          Alert.alert(
            'Error',
            'No se pudo abrir el PDF local. Asegúrate de tener un lector de PDF instalado.',
          );
        }
      } else {
        await WebBrowser.openBrowserAsync(effectiveResourceUrl);
      }
    };

    return (
      <View style={styles.contentWrapper}>
        {Platform.OS === 'web' && lesson.resourceType === 'pdf' && lesson.resourceUrl ? (
          <View style={styles.pdfContainer}>
            <iframe
              src={effectiveResourceUrl}
              width="100%"
              height="600px"
              style={{ border: 'none', borderRadius: 8 }}
              title="PDF Viewer"
            />
          </View>
        ) : (
          <View style={styles.resourceCard}>
            <ThemedText style={styles.resourceIcon}>📄</ThemedText>
            <View style={styles.resourceInfo}>
              <ThemedText style={styles.resourceTitle}>Recurso PDF</ThemedText>
            </View>
            <TouchableOpacity style={styles.openButton} onPress={handleOpenResource}>
              <ThemedText style={styles.openButtonText}>Abrir</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        <ThemedText style={styles.description}>{lesson.description}</ThemedText>
      </View>
    );
  };

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
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            if (lesson.quizId) {
              router.push(`/quiz/${lesson.quizId}`);
            }
          }}
        >
          <ThemedText style={styles.startButtonText}>Comenzar Quiz</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: lesson.title, headerLeft: () => null }} />
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        {lessonResourceUrl && (
          <TouchableOpacity
            style={[
              styles.syncButton,
              isCurrentDownloaded && styles.syncButtonDownloaded,
              isCurrentDownloading && styles.syncButtonDownloading,
            ]}
            onPress={handleDownload}
            disabled={isCurrentDownloading || isCurrentDownloaded}
          >
            {isCurrentDownloading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : isCurrentDownloaded ? (
              <Check size={20} color="#10B981" />
            ) : (
              <Download size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.typeLabel}>{lesson.type.toUpperCase()}</ThemedText>
          <ThemedText style={styles.title}>{lesson.title}</ThemedText>
          <ThemedText style={styles.duration}>⏱ {lesson.duration} min</ThemedText>
        </ThemedView>

        {renderContent()}

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, !prev && styles.navButtonDisabled]}
            onPress={() => prev && router.replace(`/lesson/${prev.id}`)}
            disabled={!prev}
          >
            <ChevronLeft size={24} color={prev ? COLORS.primary : COLORS.textLight} />
            <ThemedText style={[styles.navButtonText, !prev && styles.navButtonTextDisabled]}>
              Anterior
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, !next && styles.navButtonDisabled]}
            onPress={() => next && router.replace(`/lesson/${next.id}`)}
            disabled={!next}
          >
            <ThemedText style={[styles.navButtonText, !next && styles.navButtonTextDisabled]}>
              Siguiente
            </ThemedText>
            <ChevronRight size={24} color={next ? COLORS.primary : COLORS.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.completionContainer}>
          <TouchableOpacity
            style={[styles.completionButton, isCompleted && styles.completionButtonActive]}
            onPress={toggleCompletion}
            activeOpacity={0.7}
          >
            {isCompleted ? (
              <CheckCircle size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <Circle size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
            )}
            <ThemedText
              style={[
                styles.completionButtonText,
                isCompleted && styles.completionButtonTextActive,
              ]}
            >
              {isCompleted ? 'Completada' : 'Marcar como Completada'}
            </ThemedText>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 102, 196, 0.1)',
  },
  syncButtonDownloaded: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  syncButtonDownloading: {
    backgroundColor: 'rgba(255, 102, 196, 0.05)',
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
    backgroundColor: '#FFFBEB',
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
  pdfContainer: {
    width: '100%',
    height: 600,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  audioContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionContainer: {
    marginTop: 32,
    marginBottom: 20,
    alignItems: 'center',
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    minWidth: 200,
  },
  completionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  completionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  completionButtonTextActive: {
    color: '#FFFFFF',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  navButtonDisabled: {
    borderColor: COLORS.border,
    backgroundColor: '#F3F4F6',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: COLORS.textLight,
  },
});
