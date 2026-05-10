import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { BrandingColors } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  isLoading,
  size = 'md',
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white border-2 border-gray-100';
      case 'outline':
        return 'bg-transparent border-2 border-pink-500';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-pink-500'; // Primary
    }
  };

  const getLabelStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-gray-800';
      case 'outline':
        return 'text-pink-500';
      case 'ghost':
        return 'text-gray-600';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-2xl flex-row items-center justify-center ${getVariantStyles()} ${
        size === 'sm' ? 'py-2 px-4' : size === 'lg' ? 'py-5 px-8' : 'py-4 px-6'
      } ${props.disabled || isLoading ? 'opacity-50' : ''}`}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : BrandingColors.hotPink} />
      ) : (
        <Text
          className={`text-center font-bold ${size === 'lg' ? 'text-lg' : 'text-base'} ${getLabelStyles()}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
