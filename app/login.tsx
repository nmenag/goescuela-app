import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

const COLORS = {
  primary: "#FAE0F0",
  primaryDark: "#E8C2D8",
  background: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
  error: "#DC2626",
};

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Goescuela</ThemedText>
          <ThemedText style={styles.subtitle}>Welcome Back</ThemedText>
          <ThemedText style={styles.description}>
            Sign in to continue learning and exploring amazing courses
          </ThemedText>
        </ThemedView>

        {/* Login Form */}
        <ThemedView style={styles.formContainer}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email Address</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              value={email}
              onChangeText={setEmail}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry
              editable={!loading}
              value={password}
              onChangeText={setPassword}
            />
          </ThemedView>

          {/* Forgot Password Link */}
          <TouchableOpacity disabled={loading}>
            <ThemedText style={styles.forgotPassword}>
              Forgot password?
            </ThemedText>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>

        {/* Demo Credentials */}
        <ThemedView style={styles.demoSection}>
          <ThemedText style={styles.demoLabel}>Demo Credentials:</ThemedText>
          <ThemedText style={styles.demoText}>
            Email: sarah@example.com
          </ThemedText>
          <ThemedText style={styles.demoText}>Password: password123</ThemedText>
        </ThemedView>

        {/* Sign Up Link */}
        <ThemedView style={styles.signupSection}>
          <ThemedText style={styles.signupText}>
            Don't have an account?{" "}
          </ThemedText>
          <TouchableOpacity disabled={loading}>
            <ThemedText style={styles.signupLink}>Sign up</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.background,
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: COLORS.background,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: "#F9FAFB",
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
    textAlign: "right",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    minHeight: 48,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  demoSection: {
    backgroundColor: "#F3E8FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  demoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6D28D9",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: "#6D28D9",
    lineHeight: 18,
  },
  signupSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
