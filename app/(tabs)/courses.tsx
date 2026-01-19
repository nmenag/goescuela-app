import { CourseCard } from "@/components/course-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { mockCourses } from "@/data/mockData";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const COLORS = {
  primary: "#FAE0F0",
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
};

export default function CoursesScreen() {
  const router = useRouter();

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: "/course-detail",
      params: { courseId },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>My Courses</ThemedText>
        <ThemedText style={styles.subtitle}>
          Explore all available courses
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.coursesContainer}>
          {mockCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              instructor={course.instructor.name}
              thumbnail={course.thumbnail}
              rating={course.rating}
              students={course.students}
              price={course.price}
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
