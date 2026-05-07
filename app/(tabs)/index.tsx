import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Bell, RefreshCw, Clock, BookOpen } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/application/hooks/useCourses';
import { CourseCard } from '@/components/course-card';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { sync, isSyncing } = useOffline();
  const [search, setSearch] = useState('');

  const { data: courses = [], isLoading } = useCourses();

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

  const categories = ['Todos', 'Ciencias', 'Idiomas', 'Humanidades', 'Arte'];
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredCourses = courses.filter(
    (c) =>
      (activeCategory === 'Todos' || c.category === activeCategory) &&
      c.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={BrandingColors.hotPink} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <ThemedText style={styles.greeting}>Hola, {user?.name || 'Estudiante'} 👋</ThemedText>
              <ThemedText style={styles.headerSub}>¡Listo para aprender algo nuevo!</ThemedText>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={handleSync}>
                {isSyncing ? (
                  <ActivityIndicator size="small" color={BrandingColors.hotPink} />
                ) : (
                  <RefreshCw size={20} color={BrandingColors.hotPink} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Bell size={20} color={BrandingColors.hotPink} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cursos..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryBadge, activeCategory === cat && styles.categoryBadgeActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <ThemedText
                  style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}
                >
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Continuar Aprendiendo</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAll}>Ver todos</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={300}
            decelerationRate="fast"
          >
            {courses.slice(0, 3).map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.featuredCard}
                onPress={() => handleCoursePress(course.id)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: course.thumbnail }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredTag}>
                    <BookOpen size={12} color="#FFF" />
                    <ThemedText style={styles.featuredTagText}>{course.category}</ThemedText>
                  </View>
                  <View>
                    <ThemedText style={styles.featuredTitle}>{course.title}</ThemedText>
                    <View style={styles.featuredMeta}>
                      <Clock size={12} color="rgba(255,255,255,0.8)" />
                      <ThemedText style={styles.featuredMetaText}>
                        {course.duration}h restantes
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recomendados para ti</ThemedText>
          <View style={styles.recommendedGrid}>
            {filteredCourses.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <CourseCard
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  onPress={() => handleCoursePress(item.id)}
                />
              </View>
            ))}
          </View>
          {filteredCourses.length === 0 && (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>No se encontraron cursos.</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandingColors.lightPink,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: BrandingColors.lightPink,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  headerSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchSection: {
    paddingHorizontal: 24,
    backgroundColor: BrandingColors.lightPink,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryBadgeActive: {
    backgroundColor: BrandingColors.hotPink,
    borderColor: BrandingColors.hotPink,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandingColors.hotPink,
  },
  horizontalList: {
    gap: 16,
    paddingRight: 24,
  },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    justifyContent: 'space-between',
    height: '100%',
  },
  featuredTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredMetaText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  recommendedGrid: {
    gap: 16,
  },
  gridItem: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
