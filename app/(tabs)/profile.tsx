import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { getCurrentStudent } from "@/data/mockData";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
  primary: "#FAE0F0",
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
  error: "#DC2626",
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const student = getCurrentStudent();

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.avatarContainer}>
            <ThemedText style={styles.avatar}>👤</ThemedText>
          </ThemedView>
          <ThemedText style={styles.name}>{student.name}</ThemedText>
          <ThemedText style={styles.email}>{student.email}</ThemedText>
        </ThemedView>

        {/* Stats Section */}
        <ThemedView style={styles.statsSection}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statValue}>
              {student.enrolledCourses.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Courses Enrolled</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statValue}>62%</ThemedText>
            <ThemedText style={styles.statLabel}>Avg. Progress</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Account Settings */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Edit Profile</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Change Password</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Help & Support */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Help & Support</ThemedText>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Help Center</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Contact Us</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>About Goescuela</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
