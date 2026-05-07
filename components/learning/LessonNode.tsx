import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Lesson, StudentProgress } from '@/data/mockData';
import {
  CheckCircle,
  Video,
  HelpCircle,
  FileText,
  BookOpen,
  Mic,
  PlayCircle,
  Download,
} from 'lucide-react-native';
import { BrandingColors } from '@/constants/theme';

interface LessonNodeProps {
  lesson: Lesson;
  index: number;
  progress: StudentProgress | undefined;
  sequential: boolean;
  isDownloaded: (url: string) => boolean;
  onPress: (lessonId: string) => void;
  prevLessonCompleted: boolean;
}

export const LessonNode = ({
  lesson,
  index,
  progress,
  sequential,
  isDownloaded,
  onPress,
  prevLessonCompleted,
}: LessonNodeProps) => {
  const isCompleted = progress?.completedLessons.includes(lesson.id);
  const isLocked = sequential && !prevLessonCompleted;
  const isCurrent = !isCompleted && !isLocked;

  // Duolingo-style sine wave offset
  const xOffset = Math.sin(index) * 60;

  const getIcon = () => {
    const size = 32;
    const color = isLocked ? '#9CA3AF' : '#FFFFFF';

    if (isCompleted) return <CheckCircle size={size} color="#FFFFFF" strokeWidth={4} />;

    switch (lesson.type) {
      case 'video':
        return <Video size={size} color={color} />;
      case 'quiz':
        return <HelpCircle size={size} color={color} />;
      case 'resource':
        return <FileText size={size} color={color} />;
      case 'homework':
        return <BookOpen size={size} color={color} />;
      case 'audio':
        return <Mic size={size} color={color} />;
      default:
        return <PlayCircle size={size} color={color} />;
    }
  };

  const hasDownload = (() => {
    const url = lesson.videoUrl || lesson.audioUrl || lesson.resourceUrl;
    return url && isDownloaded(url);
  })();

  return (
    <View style={[styles.container, { transform: [{ translateX: xOffset }] }]}>
      <TouchableOpacity
        style={[
          styles.circle,
          isCompleted && styles.circleCompleted,
          isCurrent && styles.circleCurrent,
          isLocked && styles.circleLocked,
        ]}
        onPress={() => onPress(lesson.id)}
        disabled={isLocked}
        activeOpacity={0.8}
      >
        {getIcon()}
        {hasDownload && (
          <View style={styles.downloadBadge}>
            <Download size={10} color="#FFFFFF" strokeWidth={4} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.labelContainer}>
        <ThemedText style={[styles.labelText, isLocked && styles.labelLocked]}>
          {lesson.title}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
    width: 140,
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 6,
    borderBottomColor: '#D1D5DB',
  },
  circleCompleted: {
    backgroundColor: '#FFB300',
    borderColor: '#FFB300',
    borderBottomColor: '#E6A100',
  },
  circleCurrent: {
    backgroundColor: BrandingColors.hotPink,
    borderColor: BrandingColors.hotPink,
    borderBottomColor: '#D81B60',
  },
  circleLocked: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
    borderBottomColor: '#9CA3AF',
  },
  labelContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
  },
  labelLocked: {
    color: '#9CA3AF',
  },
  downloadBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
