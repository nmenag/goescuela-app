import { CourseCard } from "@/components/course-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandingColors } from "@/constants/theme";
import { mockCourses } from "@/data/mockData";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const COLORS = {
  primary: BrandingColors.hotPink,
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
};

export default function CoursesScreen() {
  const router = useRouter();

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: "/learning-view",
      params: { courseId },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Mis Cursos</ThemedText>
        <ThemedText style={styles.subtitle}>
          Explora todos los cursos disponibles
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.coursesContainer}>
          {mockCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              thumbnail={course.thumbnail}
              onPress={() => handleCoursePress(course.id)}
            />
          ))}
        </ThemedView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
  },
  coursesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
