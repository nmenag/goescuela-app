import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  onPress?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, thumbnail, onPress }) => {
  return (
    <TouchableOpacity className="mb-4" onPress={onPress} activeOpacity={0.8}>
      <View className="w-full rounded-2xl overflow-hidden shadow-sm shadow-black/5 bg-white border border-gray-100 ">
        {/* Thumbnail */}
        <View className="w-full aspect-[16/9] p-3 bg-transparent justify-center items-center">
          <Image source={{ uri: thumbnail }} className="w-full h-full" resizeMode="contain" />
        </View>

        {/* Content */}
        <View className="p-4">
          <Text
            className="text-[15px] font-bold text-gray-900 mb-1.5 leading-[21px]"
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
