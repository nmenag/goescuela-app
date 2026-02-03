import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { getCurrentStudent, getCourseById, getStudentCourseQuizScores } from '@/data/mockData';
import { FileText, Download, LogOut, CheckCircle } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOffline } from '@/hooks/useOffline';

const COLORS = {
  primary: BrandingColors.hotPink,
  background: BrandingColors.lightPink,
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
};

export default function ProfileScreen() {
  const { logout } = useAuth();
  const student = getCurrentStudent();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.headerSyncButton}
            onPress={() =>
              Alert.alert('Sincronización', 'Tu contenido se está sincronizando con el servidor.')
            }
          >
            <Download size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <ThemedView style={styles.avatarContainer}>
            <ThemedText style={styles.avatar}>👤</ThemedText>
          </ThemedView>
          <ThemedText style={styles.name}>{student.name}</ThemedText>
          <ThemedText style={styles.email}>{student.email}</ThemedText>
          <ThemedView style={styles.schoolInfo}>
            <ThemedText style={styles.schoolText}>{student.school}</ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <ThemedText style={styles.schoolText}>{student.grade}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Stats Section */}
        <ThemedView style={styles.statsSection}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statValue}>{student.enrolledCourses.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Cursos Inscritos</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statValue}>
              {student.quizScores.length > 0
                ? Math.round(
                    student.quizScores.reduce((acc, curr) => acc + curr.score, 0) /
                      student.quizScores.length,
                  )
                : 0}
              %
            </ThemedText>
            <ThemedText style={styles.statLabel}>Promedio General</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statValue}>{student.quizScores.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Quizzes Completados</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mis Calificaciones</ThemedText>
          {student.enrolledCourses.map((courseId) => {
            const course = getCourseById(courseId);
            if (!course) return null;

            const courseProgress = student.progress.find((p) => p.courseId === courseId);
            const courseQuizScores = getStudentCourseQuizScores(student.id, courseId);
            const courseAverage =
              courseQuizScores.length > 0
                ? Math.round(
                    courseQuizScores.reduce((acc, curr) => acc + curr.score, 0) /
                      courseQuizScores.length,
                  )
                : 0;

            return (
              <View key={courseId} style={styles.courseGradeCard}>
                <View style={styles.courseGradeHeader}>
                  <View style={styles.courseGradeInfo}>
                    <ThemedText style={styles.courseGradeTitle}>{course.title}</ThemedText>
                    <ThemedText style={styles.courseGradeSubtitle}>
                      {courseQuizScores.length} {courseQuizScores.length === 1 ? 'quiz' : 'quizzes'}{' '}
                      completado{courseQuizScores.length === 1 ? '' : 's'}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.courseGradeDetails}>
                  <View style={styles.courseGradeDetailItem}>
                    <ThemedText style={styles.courseGradeDetailLabel}>Promedio</ThemedText>
                    <ThemedText style={styles.courseGradeDetailValue}>{courseAverage}%</ThemedText>
                  </View>
                  <View style={styles.courseGradeDetailItem}>
                    <ThemedText style={styles.courseGradeDetailLabel}>Progreso</ThemedText>
                    <ThemedText style={styles.courseGradeDetailValue}>
                      {courseProgress?.progress || 0}%
                    </ThemedText>
                  </View>
                  <View style={styles.courseGradeDetailItem}>
                    <ThemedText style={styles.courseGradeDetailLabel}>Mejor nota</ThemedText>
                    <ThemedText style={styles.courseGradeDetailValue}>
                      {courseQuizScores.length > 0
                        ? `${Math.max(...courseQuizScores.map((s) => s.score))}%`
                        : 'N/A'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            );
          })}
        </ThemedView>

        {/* Offline Content Section */}
        <OfflineContentSection />

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Configuración de Cuenta</ThemedText>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Editar Perfil</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Cambiar Contraseña</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Notificaciones</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Help & Support */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ayuda y Soporte</ThemedText>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Centro de Ayuda</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Contáctenos</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Términos y Condiciones</ThemedText>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

function OfflineContentSection() {
  const { downloadedResources } = useOffline();

  if (downloadedResources.length === 0) return null;

  return (
    <ThemedView style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Contenido Offline</ThemedText>
        <View style={styles.offlineBadge}>
          <Download size={14} color="#FFFFFF" />
          <ThemedText style={styles.offlineBadgeText}>{downloadedResources.length}</ThemedText>
        </View>
      </View>
      <View style={styles.offlineList}>
        {downloadedResources.map((resource) => (
          <View key={resource.originalUrl} style={styles.offlineItem}>
            <View style={styles.offlineIcon}>
              <FileText size={20} color={COLORS.primary} />
            </View>
            <View style={styles.offlineInfo}>
              <ThemedText style={styles.offlineFilename} numberOfLines={1}>
                {resource.filename}
              </ThemedText>
              <ThemedText style={styles.offlineDate}>
                Descargado el {new Date(resource.downloadDate).toLocaleDateString()}
              </ThemedText>
            </View>
            <View style={styles.checkIndicator}>
              <CheckCircle size={18} color="#10B981" />
            </View>
          </View>
        ))}
      </View>
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
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    overflow: 'hidden',
  },
  headerSyncButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 10,
    backgroundColor: 'rgba(255, 102, 196, 0.1)',
    borderRadius: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    color: COLORS.textLight,
    marginBottom: 8,
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  schoolText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dot: {
    color: COLORS.textLight,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  offlineBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  offlineList: {
    gap: 12,
  },
  offlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offlineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offlineInfo: {
    flex: 1,
  },
  offlineFilename: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  offlineDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  removeButton: {
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  courseGradeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  courseGradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseGradeInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseGradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  courseGradeSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  courseGradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  courseGradeDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  courseGradeDetailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  courseGradeDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  checkIndicator: {
    padding: 8,
  },
});
