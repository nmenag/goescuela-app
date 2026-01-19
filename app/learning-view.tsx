import { Accordion } from "@/components/accordion";
import { Tabs } from "@/components/tabs";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getCourseById } from "@/data/mockData";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const COLORS = {
  primary: "#FAE0F0",
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

export default function LearningViewScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const course = getCourseById(courseId || "");
  const [selectedModule, setSelectedModule] = useState(course?.modules[0]?.id);

  if (!course) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Course not found</ThemedText>
      </ThemedView>
    );
  }

  const accordionItems = course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    duration: module.duration,
    content: (
      <ThemedView style={styles.lessonsContainer}>
        {module.lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonItem}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.lessonInfo}>
              <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
              <ThemedText style={styles.lessonDuration}>
                ⏱ {lesson.duration} min
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.lessonIcon}>▶</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    ),
  }));

  const overviewTab = (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.overviewSection}>
        <ThemedText style={styles.overviewTitle}>About This Course</ThemedText>
        <ThemedText style={styles.overviewText}>
          {course.description}
        </ThemedText>

        <ThemedText style={[styles.overviewTitle, { marginTop: 20 }]}>
          Course Details
        </ThemedText>
        <ThemedView style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Level:</ThemedText>
          <ThemedText style={styles.detailValue}>{course.level}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Duration:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {course.duration} hours
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Modules:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {course.modules.length}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Students:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {course.students.toLocaleString()}
          </ThemedText>
        </ThemedView>

        <ThemedText style={[styles.overviewTitle, { marginTop: 20 }]}>
          Instructor
        </ThemedText>
        <ThemedView style={styles.instructorCard}>
          <ThemedText style={styles.instructorName}>
            {course.instructor.name}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );

  const resourcesTab = (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.resourcesSection}>
        <ThemedText style={styles.resourcesTitle}>Course Materials</ThemedText>

        {course.modules.map((module) =>
          module.lessons.map((lesson) =>
            lesson.resources ? (
              <ThemedView key={lesson.id} style={styles.resourceGroup}>
                <ThemedText style={styles.lessonResourceTitle}>
                  {lesson.title}
                </ThemedText>
                {lesson.resources.map((resource) => (
                  <TouchableOpacity
                    key={resource.id}
                    style={styles.resourceItem}
                    onPress={() => {
                      if (resource.type === "link" || resource.type === "pdf") {
                        Linking.openURL(resource.url);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={styles.resourceIcon}>
                      {resource.type === "pdf" ? "📄" : "🔗"}
                    </ThemedText>
                    <ThemedView style={styles.resourceInfo}>
                      <ThemedText style={styles.resourceTitle}>
                        {resource.title}
                      </ThemedText>
                      <ThemedText style={styles.resourceType}>
                        {resource.type.toUpperCase()}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.downloadIcon}>⬇</ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            ) : null,
          ),
        )}

        {course.modules.every((m) => m.lessons.every((l) => !l.resources)) && (
          <ThemedText style={styles.noResources}>
            No resources available yet
          </ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header with Back Button */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ThemedText style={styles.backButton}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </ThemedText>
      </ThemedView>

      {/* Video Player Placeholder */}
      <ThemedView style={styles.videoPlayer}>
        <ThemedText style={styles.videoIcon}>▶️</ThemedText>
        <ThemedText style={styles.videoText}>Video Player</ThemedText>
      </ThemedView>

      {/* Tabs Section */}
      <Tabs
        tabs={[
          {
            id: "curriculum",
            label: "Curriculum",
            content: <Accordion items={accordionItems} />,
          },
          { id: "overview", label: "Overview", content: overviewTab },
          { id: "resources", label: "Resources", content: resourcesTab },
        ]}
      />
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  videoPlayer: {
    height: 200,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  lessonsContainer: {
    gap: 8,
  },
  lessonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  lessonIcon: {
    fontSize: 16,
    color: COLORS.primary,
  },
  tabContent: {
    flex: 1,
  },
  overviewSection: {
    padding: 16,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  instructorCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  resourcesSection: {
    padding: 16,
  },
  resourcesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  resourceGroup: {
    marginBottom: 20,
  },
  lessonResourceTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  resourceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 2,
  },
  resourceType: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  downloadIcon: {
    fontSize: 16,
    color: COLORS.primary,
  },
  noResources: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginVertical: 40,
  },
});
