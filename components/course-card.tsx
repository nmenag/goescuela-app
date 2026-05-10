import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  onPress?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, thumbnail, onPress }) => {
  return (
    <TouchableOpacity className="mb-4" onPress={onPress} activeOpacity={0.8}>
      <ThemedView className="w-full rounded-2xl overflow-hidden shadow-sm shadow-black/5 dark:shadow-none bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
        {/* Thumbnail */}
        <View className="w-full aspect-[16/9] p-3 bg-transparent justify-center items-center">
          <Image source={{ uri: thumbnail }} className="w-full h-full" resizeMode="contain" />
        </View>

        {/* Content */}
        <View className="p-4">
          <ThemedText
            className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-1.5 leading-[21px]"
            numberOfLines={2}
          >
            {title}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};
