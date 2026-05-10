import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react-native';
import { BrandingColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);

  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch {
      Alert.alert('Error', 'Credenciales inválidas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Demo fallback
  const handleDemoLogin = async () => {
    setLoading(true);
    setTimeout(async () => {
      await login('demo@example.com', 'demo123');
      setLoading(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-brand-lightPink ">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
          className="px-6"
          contentContainerClassName="flex-grow justify-center"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Illustration or Logo */}
          <View className="items-center mb-10">
            <View className="w-24 h-24 bg-white rounded-3xl justify-center items-center shadow-sm shadow-black/5 mb-6">
              <Image
                source={require('@/assets/images/logo.png')}
                className="w-14 h-14"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-black text-gray-900 mb-2">Bienvenido de nuevo</Text>
            <Text className="text-base text-gray-600 text-center px-5">
              Inicia sesión para continuar tu aprendizaje
            </Text>
          </View>

          {/* Form */}
          <View className="w-full max-w-md mx-auto">
            <View className="mb-5">
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Correo Electrónico</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View
                      className={`flex-row items-center bg-white rounded-2xl border-2 px-4 transition-colors ${
                        errors.email
                          ? 'border-red-500'
                          : focusedInput === 'email'
                            ? 'border-brand-hotPink'
                            : 'border-gray-100 '
                      }`}
                    >
                      <Mail
                        size={20}
                        color={
                          errors.email
                            ? '#EF4444'
                            : focusedInput === 'email'
                              ? BrandingColors.hotPink
                              : '#6B7280'
                        }
                        className="mr-3"
                      />
                      <TextInput
                        className="flex-1 py-4 text-base text-gray-900 font-medium"
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor="#6B7280"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => {
                          onBlur();
                          setFocusedInput(null);
                        }}
                      />
                      {errors.email && <AlertCircle size={20} color="#EF4444" className="ml-2" />}
                    </View>
                    {errors.email && (
                      <Text className="text-red-500 text-xs font-bold mt-2 ml-2">
                        {errors.email.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <View className="mb-5">
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Contraseña</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View
                      className={`flex-row items-center bg-white rounded-2xl border-2 px-4 transition-colors ${
                        errors.password
                          ? 'border-red-500'
                          : focusedInput === 'password'
                            ? 'border-brand-hotPink'
                            : 'border-gray-100 '
                      }`}
                    >
                      <Lock
                        size={20}
                        color={
                          errors.password
                            ? '#EF4444'
                            : focusedInput === 'password'
                              ? BrandingColors.hotPink
                              : '#6B7280'
                        }
                        className="mr-3"
                      />
                      <TextInput
                        className="flex-1 py-4 text-base text-gray-900 font-medium"
                        placeholder="••••••••"
                        placeholderTextColor="#6B7280"
                        secureTextEntry={!showPassword}
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => {
                          onBlur();
                          setFocusedInput(null);
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="p-2"
                        accessibilityLabel={
                          showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                        }
                        accessibilityRole="button"
                      >
                        {showPassword ? (
                          <EyeOff size={20} color={errors.password ? '#EF4444' : '#6B7280'} />
                        ) : (
                          <Eye size={20} color={errors.password ? '#EF4444' : '#6B7280'} />
                        )}
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <Text className="text-red-500 text-xs font-bold mt-2 ml-2">
                        {errors.password.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <TouchableOpacity className="self-end mb-8" onPress={handleDemoLogin}>
              <Text className="text-sm font-semibold text-brand-hotPink ">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-brand-hotPink rounded-2xl py-4 flex-row justify-center items-center shadow-md shadow-brand-hotPink/20 ${loading ? 'opacity-60' : ''}`}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-white text-lg font-extrabold">Ingresar</Text>
                  <ArrowRight size={20} color="#FFFFFF" className="ml-2.5" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
