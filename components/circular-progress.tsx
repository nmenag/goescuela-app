import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const COLORS = {
  primary: '#FAE0F0',
  background: '#FFFFFF',
  border: '#E5E7EB',
};

interface CircularProgressBarProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  strokeWidth,
  progress,
  color = COLORS.primary,
  backgroundColor = '#E5E7EB',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
});
