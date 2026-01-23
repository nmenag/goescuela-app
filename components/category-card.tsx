import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandingColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = {
  primary: BrandingColors.hotPink,
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
};

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, onPress }) => {
  const iconEmojis: { [key: string]: string } = {
    phone: '📱',
    globe: '🌐',
    palette: '🎨',
    'bar-chart-2': '📊',
    code: '💻',
    briefcase: '💼',
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={styles.card}>
        <ThemedText style={styles.icon}>{iconEmojis[icon] || icon}</ThemedText>
        <ThemedText style={styles.name} numberOfLines={2}>
          {name}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 130,
    marginRight: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 140,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
  },
});
