import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { getCurrentStudent, getCourseById, getStudentCourseQuizScores } from '@/data/mockData';
import {
  FileText,
  LogOut,
  CheckCircle,
  User,
  Bell,
  HelpCircle,
  Shield,
  RefreshCw,
} from 'lucide-react-native';
import { useOffline } from '@/hooks/useOffline';

// Components
import { ProfileStat } from '@/components/profile/ProfileStat';
import { SettingItem } from '@/components/profile/SettingItem';

import { useStudentProfile } from '@/application/hooks/useStudent';
import { useCourses } from '@/application/hooks/useCourses';

export default function ProfileScreen() {
  const { logout, user: authUser } = useAuth();
  const insets = useSafeAreaInsets();
  const { sync, isSyncing, downloadedResources } = useOffline();

  const { data: student, isLoading: isStudentLoading } = useStudentProfile(authUser?.id || '');
  const { data: courses = [], isLoading: isCoursesLoading } = useCourses();

  const handleSync = async () => {
    const success = await sync();
    if (success) {
      Alert.alert('Éxito', 'Los datos se han sincronizado correctamente.');
    } else {
      Alert.alert('Aviso', 'No se ha podido sincronizar. Verifica tu conexión a internet.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
    ]);
  };

  if (isStudentLoading || isCoursesLoading || !student) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={BrandingColors.hotPink} />
      </ThemedView>
    );
  }

  // Calculate stats from data
  const averageScore = 0; // Simplified for now

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.syncButton} onPress={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <RefreshCw size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarInner}>
                <User size={50} color={BrandingColors.hotPink} />
              </View>
            </View>
            <View style={styles.onlineBadge} />
          </View>

          <ThemedText style={styles.userName}>{student.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{student.email}</ThemedText>

          <View style={styles.badgeRow}>
            <View style={styles.schoolBadge}>
              <ThemedText style={styles.schoolBadgeText}>{student.school}</ThemedText>
            </View>
            <View style={styles.gradeBadge}>
              <ThemedText style={styles.gradeBadgeText}>{student.grade}</ThemedText>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsGrid}>
          <ProfileStat label="Cursos" value={student.enrolledCourses.length} />
          <ProfileStat label="Promedio" value={`${averageScore}%`} />
          <ProfileStat label="Quizzes" value={student.quizScores.length} />
        </View>

        {/* Grades Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Progreso Académico</ThemedText>
          {student.enrolledCourses.map((courseId) => {
            const course = getCourseById(courseId);
            if (!course) return null;
            const courseProgress = student.progress.find((p) => p.courseId === courseId);
            const courseScores = getStudentCourseQuizScores(student.id, courseId);
            const courseAvg =
              courseScores.length > 0
                ? Math.round(courseScores.reduce((a, b) => a + b.score, 0) / courseScores.length)
                : 0;

            return (
              <View key={courseId} style={styles.academicCard}>
                <ThemedText style={styles.academicTitle}>{course.title}</ThemedText>
                <View style={styles.academicStats}>
                  <View style={styles.academicStat}>
                    <ThemedText style={styles.academicVal}>{courseAvg}%</ThemedText>
                    <ThemedText style={styles.academicLab}>Nota</ThemedText>
                  </View>
                  <View style={styles.academicStat}>
                    <ThemedText style={styles.academicVal}>
                      {courseProgress?.progress || 0}%
                    </ThemedText>
                    <ThemedText style={styles.academicLab}>Progreso</ThemedText>
                  </View>
                  <View style={styles.academicStat}>
                    <ThemedText style={styles.academicVal}>{courseScores.length}</ThemedText>
                    <ThemedText style={styles.academicLab}>Temas</ThemedText>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Offline Content */}
        {downloadedResources.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Contenido Offline</ThemedText>
              <View style={styles.offlineCount}>
                <ThemedText style={styles.offlineCountText}>
                  {downloadedResources.length}
                </ThemedText>
              </View>
            </View>
            {downloadedResources.map((res, i) => (
              <View key={i} style={styles.offlineItem}>
                <FileText size={20} color={BrandingColors.hotPink} />
                <ThemedText style={styles.offlineName} numberOfLines={1}>
                  {res.filename}
                </ThemedText>
                <CheckCircle size={16} color="#10B981" />
              </View>
            ))}
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Configuración</ThemedText>
          <SettingItem label="Editar Perfil" icon={<User size={20} color="#6B7280" />} />
          <SettingItem label="Notificaciones" icon={<Bell size={20} color="#6B7280" />} />
          <SettingItem label="Seguridad" icon={<Shield size={20} color="#6B7280" />} />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Soporte</ThemedText>
          <SettingItem label="Centro de Ayuda" icon={<HelpCircle size={20} color="#6B7280" />} />
          <SettingItem
            label="Cerrar Sesión"
            icon={<LogOut size={20} color="#DC2626" />}
            destructive
            onPress={handleLogout}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandingColors.lightPink,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: BrandingColors.hotPink,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  syncButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  schoolBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  schoolBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  gradeBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  gradeBadgeText: {
    color: BrandingColors.hotPink,
    fontSize: 12,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -25,
    gap: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  academicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  academicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  academicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  academicStat: {
    alignItems: 'center',
  },
  academicVal: {
    fontSize: 18,
    fontWeight: '800',
    color: BrandingColors.hotPink,
  },
  academicLab: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offlineCount: {
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  offlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  offlineName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
