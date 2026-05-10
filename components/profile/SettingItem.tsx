import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ChevronRight } from 'lucide-react-native';

interface SettingItemProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}

export const SettingItem = ({ label, icon, onPress, destructive }: SettingItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <ThemedText style={[styles.label, destructive && styles.destructiveLabel]}>
          {label}
        </ThemedText>
      </View>
      <ChevronRight size={20} color={destructive ? '#FEE2E2' : '#D1D5DB'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  destructiveLabel: {
    color: '#DC2626',
  },
});
