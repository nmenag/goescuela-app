import { CircularProgressBar } from "@/components/circular-progress";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandingColors } from "@/constants/theme";
import {
    getCourseById,
    getCurrentStudent,
    getStudentCourseProgress,
} from "@/data/mockData";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
  primary: BrandingColors.hotPink,
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

export default function CourseDetailScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const course = getCourseById(courseId || "");
  const student = getCurrentStudent();
  const progress = getStudentCourseProgress(student.id, courseId || "");

  if (!course) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Course not found</ThemedText>
      </ThemedView>
    );
  }

  const handleStartLearning = () => {
    router.push({
      pathname: "/learning-view",
      params: { courseId: course.id },
    });
  };

  const handleTakeQuiz = () => {
    router.push({
      pathname: "/quiz",
      params: { courseId: course.id },
    });
  };

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header with Back Button */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ThemedText style={styles.backButton}>← Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Thumbnail */}
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />

        {/* Course Title */}
        <ThemedView style={styles.titleSection}>
          <ThemedText style={styles.title}>{course.title}</ThemedText>
          <ThemedView style={styles.ratingSection}>
            <ThemedText style={styles.rating}>⭐ {course.rating}</ThemedText>
            <ThemedText style={styles.students}>
              ({course.students.toLocaleString()} students)
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Instructor */}
        <ThemedView style={styles.instructorSection}>
          <ThemedText style={styles.sectionLabel}>Instructor</ThemedText>
          <ThemedView style={styles.instructorCard}>
            <ThemedText style={styles.instructorName}>
              {course.instructor.name}
            </ThemedText>
            <ThemedText style={styles.instructorRole}>
              Expert Instructor
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Course Statistics */}
        <ThemedView style={styles.statsSection}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{course.duration}h</ThemedText>
            <ThemedText style={styles.statLabel}>Duration</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>
              {course.modules.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Modules</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{totalLessons}</ThemedText>
            <ThemedText style={styles.statLabel}>Lessons</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{course.level}</ThemedText>
            <ThemedText style={styles.statLabel}>Level</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Progress */}
        {progress && (
          <ThemedView style={styles.progressSection}>
            <ThemedText style={styles.sectionLabel}>Your Progress</ThemedText>
            <ThemedView style={styles.progressContent}>
              <CircularProgressBar
                size={120}
                strokeWidth={6}
                progress={progress.progress}
                color={COLORS.primary}
              />
              <ThemedView style={styles.progressInfo}>
                <ThemedText style={styles.progressText}>
                  {progress.completedLessons.length} of {totalLessons} lessons
                  completed
                </ThemedText>
                <ThemedText style={styles.progressPercentage}>
                  {Math.round(progress.progress)}% Complete
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}

        {/* Description */}
        <ThemedView style={styles.descriptionSection}>
          <ThemedText style={styles.sectionLabel}>About This Course</ThemedText>
          <ThemedText style={styles.description}>
            {course.description}
          </ThemedText>
        </ThemedView>

        {/* What You'll Learn */}
        <ThemedView style={styles.learningSection}>
          <ThemedText style={styles.sectionLabel}>What Learn</ThemedText>
          <ThemedView style={styles.learningItem}>
            <ThemedText style={styles.bullet}>✓</ThemedText>
            <ThemedText style={styles.learningText}>
              Master all core concepts and best practices
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.learningItem}>
            <ThemedText style={styles.bullet}>✓</ThemedText>
            <ThemedText style={styles.learningText}>
              Build real-world projects from scratch
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.learningItem}>
            <ThemedText style={styles.bullet}>✓</ThemedText>
            <ThemedText style={styles.learningText}>
              Gain hands-on experience with industry tools
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.learningItem}>
            <ThemedText style={styles.bullet}>✓</ThemedText>
            <ThemedText style={styles.learningText}>
              Complete assignments and earn certification
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Action Buttons */}
        <ThemedView style={styles.buttonsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartLearning}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.primaryButtonText}>
              {progress ? "Continue Learning" : "Start Learning"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleTakeQuiz}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.secondaryButtonText}>
              Take Quiz
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  thumbnail: {
    width: "100%",
    height: 240,
    backgroundColor: "#E5E7EB",
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  students: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  instructorSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  instructorCard: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructorName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  instructorRole: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
    lineHeight: 18,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 21,
  },
  learningSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  learningItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
    gap: 12,
  },
  bullet: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 2,
  },
  learningText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    flex: 1,
  },
  buttonsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
