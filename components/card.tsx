import { Text, View } from 'react-native';

interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <Text className="text-lg font-semibold text-gray-900 mb-2">{title}</Text>
      <Text className="text-gray-600 mb-3">{description}</Text>
      {children}
    </View>
  );
}
