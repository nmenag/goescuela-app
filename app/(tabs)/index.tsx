import React, { useState, useMemo } from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, RefreshCw, Clock, BookOpen } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
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
      <View className="flex-1 justify-center items-center bg-brand-lightPink ">
        <ActivityIndicator size="large" color={BrandingColors.hotPink} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-lightPink ">
      <View className="flex-1">
        {/* Profile Header */}
        <Animated.View
          entering={FadeInUp.duration(400).springify()}
          className="px-6 pb-5 bg-brand-lightPink "
          style={{ paddingTop: insets.top + 10 }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xl font-black text-gray-900 ">
                Hola, {user?.name || 'Estudiante'} 👋
              </Text>
              <Text className="text-sm text-gray-500 mt-1">Listo para aprender algo nuevo</Text>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="w-11 h-11 rounded-2xl bg-white justify-center items-center border border-gray-100 shadow-sm shadow-black/5"
                onPress={handleSync}
                accessibilityLabel="Sincronizar"
              >
                {isSyncing ? (
                  <ActivityIndicator size="small" color={BrandingColors.hotPink} />
                ) : (
                  <RefreshCw size={20} color={BrandingColors.hotPink} />
                )}
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
                className="px-6 pb-4 bg-brand-lightPink z-10"
              >
                <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm shadow-black/5">
                  <Search size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-900 font-medium"
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
                          : 'bg-white border-gray-100 '
                      }`}
                      onPress={() => setActiveCategory(cat)}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          activeCategory === cat ? 'text-white' : 'text-gray-500 '
                        }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>

              {/* Continue Learning */}
              <Animated.View entering={FadeInRight.duration(400).delay(300)} className="px-6 mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-extrabold text-gray-900 ">
                    Continuar Aprendiendo
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-bold text-brand-hotPink ">Ver todos</Text>
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
                        className="w-[280px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm"
                        onPress={() => handleCoursePress(course.id)}
                        activeOpacity={0.9}
                      >
                        <View className="w-full h-[140px] p-4 bg-gray-50/50 justify-center items-center border-b border-gray-50">
                          <Image
                            source={{ uri: course.thumbnail }}
                            className="w-full h-full"
                            resizeMode="contain"
                          />
                        </View>
                        <View className="p-4">
                          <Text
                            className="text-base font-black text-gray-900 mb-3"
                            numberOfLines={2}
                          >
                            {course.title}
                          </Text>
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-1.5 bg-brand-lightPink px-2.5 py-1 rounded-lg">
                              <BookOpen size={12} color="#ff66c4" />
                              <Text className="text-brand-hotPink text-[10px] font-black uppercase tracking-wider">
                                {course.category}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1.5">
                              <Clock size={14} color="#9CA3AF" />
                              <Text className="text-gray-500 text-xs font-bold">
                                {course.duration}h
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </ScrollView>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(400).delay(400)} className="px-6 mb-4">
                <Text className="text-lg font-extrabold text-gray-900 ">Recomendados para ti</Text>
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
              <Text className="text-sm text-gray-400 ">No se encontraron cursos.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
