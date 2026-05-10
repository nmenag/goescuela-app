import React, { useState, useMemo } from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Bell, RefreshCw, Clock, BookOpen } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/application/hooks/useCourses';
import { useOffline } from '@/hooks/useOffline';
import { CourseCard } from '@/components/course-card';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { sync, isSyncing } = useOffline();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const { data: courses = [], isLoading } = useCourses();

  const categories = ['Todos', 'Ciencias', 'Idiomas', 'Humanidades', 'Arte'];

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        (activeCategory === 'Todos' || c.category === activeCategory) &&
        c.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [courses, activeCategory, search]);

  const handleSync = async () => {
    const success = await sync();
    if (success) {
      Alert.alert('Sincronizado', 'Tus cursos están al día.');
    } else {
      Alert.alert('Error', 'No se pudo sincronizar.');
    }
  };

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: '/learning-view',
      params: { courseId },
    });
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-brand-lightPink dark:bg-zinc-950">
        <ActivityIndicator size="large" color={BrandingColors.hotPink} />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-brand-lightPink dark:bg-zinc-950">
      <View className="flex-1">
        {/* Profile Header */}
        <Animated.View
          entering={FadeInUp.duration(400).springify()}
          className="px-6 pb-5 bg-brand-lightPink dark:bg-zinc-950"
          style={{ paddingTop: insets.top + 10 }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <ThemedText className="text-xl font-black text-gray-900 dark:text-gray-100">
                Hola, {user?.name || 'Estudiante'} 👋
              </ThemedText>
              <ThemedText className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Listo para aprender algo nuevo
              </ThemedText>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 justify-center items-center border border-gray-100 dark:border-zinc-800 shadow-sm shadow-black/5"
                onPress={handleSync}
                accessibilityLabel="Sincronizar"
              >
                {isSyncing ? (
                  <ActivityIndicator size="small" color={BrandingColors.hotPink} />
                ) : (
                  <RefreshCw size={20} color={BrandingColors.hotPink} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 justify-center items-center border border-gray-100 dark:border-zinc-800 shadow-sm shadow-black/5"
                accessibilityLabel="Notificaciones"
              >
                <Bell size={20} color={BrandingColors.hotPink} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={
            <>
              {/* Search Bar */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(100)}
                className="px-6 pb-4 bg-brand-lightPink dark:bg-zinc-950 z-10"
              >
                <View className="flex-row items-center bg-white dark:bg-zinc-900 rounded-2xl px-4 py-3 border border-gray-100 dark:border-zinc-800 shadow-sm shadow-black/5">
                  <Search size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-900 dark:text-gray-100 font-medium"
                    placeholder="Buscar cursos..."
                    placeholderTextColor="#6B7280"
                    value={search}
                    onChangeText={setSearch}
                  />
                </View>
              </Animated.View>

              {/* Categories */}
              <Animated.View entering={FadeInRight.duration(400).delay(200)} className="mb-6">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      className={`px-5 py-2.5 rounded-xl border transition-colors ${
                        activeCategory === cat
                          ? 'bg-brand-hotPink border-brand-hotPink'
                          : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
                      }`}
                      onPress={() => setActiveCategory(cat)}
                    >
                      <ThemedText
                        className={`text-sm font-bold ${
                          activeCategory === cat ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {cat}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>

              {/* Continue Learning */}
              <Animated.View entering={FadeInRight.duration(400).delay(300)} className="px-6 mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <ThemedText className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                    Continuar Aprendiendo
                  </ThemedText>
                  <TouchableOpacity>
                    <ThemedText className="text-sm font-bold text-brand-hotPink dark:text-pink-400">
                      Ver todos
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16, paddingRight: 24 }}
                  snapToInterval={300}
                  decelerationRate="fast"
                >
                  {courses.slice(0, 3).map((course, index) => (
                    <Animated.View
                      key={course.id}
                      entering={FadeInRight.duration(400).delay(300 + index * 100)}
                    >
                      <TouchableOpacity
                        className="w-[280px] h-[180px] rounded-3xl overflow-hidden bg-black"
                        onPress={() => handleCoursePress(course.id)}
                        activeOpacity={0.9}
                      >
                        <Image
                          source={{ uri: course.thumbnail }}
                          className="w-full h-full opacity-70"
                        />
                        <View className="absolute bottom-0 left-0 right-0 p-5 justify-between h-full">
                          <View className="self-start bg-white/20 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 backdrop-blur-md">
                            <BookOpen size={12} color="#FFF" />
                            <ThemedText className="text-white text-[11px] font-black uppercase tracking-wider">
                              {course.category}
                            </ThemedText>
                          </View>
                          <View>
                            <ThemedText
                              className="text-xl font-black text-white mb-2"
                              numberOfLines={2}
                            >
                              {course.title}
                            </ThemedText>
                            <View className="flex-row items-center gap-1.5">
                              <Clock size={12} color="rgba(255,255,255,0.8)" />
                              <ThemedText className="text-white/80 text-xs font-bold">
                                {course.duration}h restantes
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </ScrollView>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(400).delay(400)} className="px-6 mb-4">
                <ThemedText className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                  Recomendados para ti
                </ThemedText>
              </Animated.View>
            </>
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.duration(400).delay(400 + index * 50)}
              className="px-6 mb-4"
            >
              <CourseCard
                id={item.id}
                title={item.title}
                thumbnail={item.thumbnail}
                onPress={() => handleCoursePress(item.id)}
              />
            </Animated.View>
          )}
          ListEmptyComponent={
            <View className="items-center py-10">
              <ThemedText className="text-sm text-gray-400 dark:text-gray-500">
                No se encontraron cursos.
              </ThemedText>
            </View>
          }
        />
      </View>
    </ThemedView>
  );
}
