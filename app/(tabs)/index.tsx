import { CourseCard } from "@/components/course-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandingColors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import {
  getCurrentStudent,
  mockCourses,
} from "@/data/mockData";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet } from "react-native";

const COLORS = {
  primary: BrandingColors.hotPink,
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const student = getCurrentStudent();

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: "/learning-view",
      params: { courseId },
    });
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedText style={styles.greeting}>Hola 👋</ThemedText>
      <ThemedText style={styles.name}>{user?.name || "Estudiante"}</ThemedText>
    </ThemedView>
  );

  const renderAllCourses = () => (
    <FlatList
      data={mockCourses}
      renderItem={({ item }) => (
        <ThemedView style={styles.courseCardWrapper}>
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnail={item.thumbnail}
            onPress={() => handleCoursePress(item.id)}
          />
        </ThemedView>
      )}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.coursesContainer}
    />
  );

  const renderListHeader = () => renderAllCourses();

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={mockCourses}
        renderItem={({ item }) => (
          <ThemedView style={styles.courseCardWrapper}>
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              thumbnail={item.thumbnail}
              onPress={() => handleCoursePress(item.id)}
            />
          </ThemedView>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  courseCardWrapper: {
    marginBottom: 16,
  },
  coursesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
