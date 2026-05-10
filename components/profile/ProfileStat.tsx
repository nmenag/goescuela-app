import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BrandingColors } from '@/constants/theme';

interface ProfileStatProps {
  label: string;
  value: string | number;
  icon?: string;
}

export const ProfileStat = ({ label, value, icon }: ProfileStatProps) => {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {icon && <ThemedText style={styles.icon}>{icon}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    minWidth: 100,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    color: BrandingColors.hotPink,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  icon: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 12,
    opacity: 0.5,
  },
});
