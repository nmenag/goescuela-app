import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const COLORS = {
  primary: "#FAE0F0",
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
};

const notifications = [
  {
    id: "1",
    title: "Course Started",
    message: "You have started React Native Fundamentals",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Assignment Due",
    message: "Your quiz for Advanced JavaScript is due tomorrow",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    title: "Certificate Earned",
    message: "Congratulations! You earned a certificate in Web Design",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    title: "New Course Available",
    message: "Check out our new course on Machine Learning",
    timestamp: "2 days ago",
  },
];

export default function NotificationsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Notifications</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <ThemedView key={notification.id} style={styles.notificationCard}>
            <ThemedText style={styles.notificationTitle}>
              {notification.title}
            </ThemedText>
            <ThemedText style={styles.notificationMessage}>
              {notification.message}
            </ThemedText>
            <ThemedText style={styles.timestamp}>
              {notification.timestamp}
            </ThemedText>
          </ThemedView>
        ))}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
