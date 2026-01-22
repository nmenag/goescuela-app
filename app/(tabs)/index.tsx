import { CategoryCard } from "@/components/category-card";
import { CourseCard } from "@/components/course-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandingColors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import {
    getCurrentStudent,
    mockCategories,
    mockCourses,
} from "@/data/mockData";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

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
      pathname: "/course-detail",
      params: { courseId },
    });
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedText style={styles.greeting}>Good morning 👋</ThemedText>
      <ThemedText style={styles.name}>{user?.name || "Student"}</ThemedText>
    </ThemedView>
  );

  const renderFeaturedCategories = () => (
    <ThemedView style={styles.section}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Featured Categories</ThemedText>
        <TouchableOpacity onPress={() => router.push("/courses")}>
          <ThemedText style={styles.viewAll}>View all</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={styles.categoriesScroll}
      >
        {mockCategories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            onPress={() => router.push("/courses")}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );

  const renderRecommendedCourses = () => (
    <ThemedView style={styles.section}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Recommended For You</ThemedText>
        <TouchableOpacity onPress={() => router.push("/courses")}>
          <ThemedText style={styles.viewAll}>View all</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      {mockCourses.slice(0, 3).map((course) => (
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
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {renderHeader()}
        {renderFeaturedCategories()}
        {renderRecommendedCourses()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
});
