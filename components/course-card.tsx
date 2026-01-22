import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandingColors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
  primary: BrandingColors.hotPink,
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  price?: number;
  onPress?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  instructor,
  thumbnail,
  rating,
  students,
  price,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.card}>
        {/* Thumbnail */}
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />

        {/* Rating Badge */}
        <ThemedView style={styles.ratingBadge}>
          <ThemedText style={styles.ratingText}>⭐ {rating}</ThemedText>
        </ThemedView>

        {/* Content */}
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {title}
          </ThemedText>

          <ThemedText style={styles.instructor} numberOfLines={1}>
            {instructor}
          </ThemedText>

          {/* Footer */}
          <ThemedView style={styles.footer}>
            <ThemedText style={styles.students}>
              {students.toLocaleString()} students
            </ThemedText>
            {price && <ThemedText style={styles.price}>${price}</ThemedText>}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E7EB",
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 21,
  },
  instructor: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  students: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
