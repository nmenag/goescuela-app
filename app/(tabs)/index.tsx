import { CourseCard } from '@/components/course-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { mockCourses } from '@/data/mockData';
import { useRouter } from 'expo-router';
import { Download } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOffline } from '@/hooks/useOffline';
import { ActivityIndicator, Alert } from 'react-native';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: BrandingColors.lightPink,
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { sync, isSyncing } = useOffline();

  const handleSync = async () => {
    const success = await sync();
    if (success) {
      Alert.alert('Éxito', 'Los datos se han sincronizado correctamente.');
    } else {
      Alert.alert('Aviso', 'No se ha podido sincronizar. Verifica tu conexión a internet.');
    }
  };

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: '/learning-view',
      params: { courseId },
    });
  };

  const renderHeader = () => (
    <ThemedView style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <ThemedView style={styles.headerTop}>
        <ThemedView>
          <ThemedText style={styles.greeting}>Hola 👋</ThemedText>
          <ThemedText style={styles.name}>{user?.name || 'Estudiante'}</ThemedText>
        </ThemedView>
        <TouchableOpacity style={styles.syncButton} onPress={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Download size={22} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      <ThemedView style={styles.horizontalSection}>
        <FlatList
          horizontal
          data={mockCourses}
          renderItem={({ item }) => (
            <ThemedView style={styles.courseCardWrapper}>
              <CourseCard
                key={item.id}
                id={item.id}
                title={item.title}
                thumbnail={item.thumbnail}
                onPress={() => handleCoursePress(item.id)}
              />
            </ThemedView>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={280 + 16}
          decelerationRate="fast"
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 250,
    height: 200,
  },
  horizontalSection: {
    marginHorizontal: 0,
    paddingVertical: 10,
  },
  syncButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  courseCardWrapper: {
    width: 280,
    marginRight: 16,
  },
});
