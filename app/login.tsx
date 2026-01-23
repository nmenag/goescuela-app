import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  primary: BrandingColors.lightPink,
  primaryDark: BrandingColors.hotPink,
  background: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Demo mode - skip validation and login immediately
      await login(email || 'demo@example.com', password || 'demo123');
    } catch (error) {
      Alert.alert(
        'Error de Inicio de Sesión',
        error instanceof Error ? error.message : 'Algo salió mal',
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
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        </ThemedView>

        {/* Login Form */}
        <ThemedView style={styles.formContainer}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Correo Electrónico</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="tu@ejemplo.com"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              value={email}
              onChangeText={setEmail}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Contraseña</ThemedText>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry={!showPassword}
                editable={!loading}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={20} color={COLORS.textLight} />
                ) : (
                  <Eye size={20} color={COLORS.textLight} />
                )}
              </TouchableOpacity>
            </View>
          </ThemedView>

          {/* Forgot Password Link */}
          <TouchableOpacity disabled={loading}>
            <ThemedText style={styles.forgotPassword}>¿Olvidó la contraseña?</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <ThemedText style={styles.loginButtonText}>Iniciar Sesión</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
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
    fontWeight: '600',
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
    backgroundColor: '#F9FAFB',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: BrandingColors.hotPink,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 48,
    shadowColor: BrandingColors.hotPink,
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
    fontWeight: '600',
    color: '#FFFFFF',
  },
  demoSection: {
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  demoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6D28D9',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#6D28D9',
    lineHeight: 18,
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
