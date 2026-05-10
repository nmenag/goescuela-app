import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BrandingColors } from '@/constants/theme';
import { Question, Answer } from '@/data/mockData';

interface QuizQuestionProps {
  question: Question;
  userAnswer: any;
  onSelect: (answer: any, type: string) => void;
}

export const QuizQuestion = ({ question, userAnswer, onSelect }: QuizQuestionProps) => {
  const isMultiple = question.allowMultipleAnswers;

  if (question.type === 'sequence') {
    const list = userAnswer || question.answers;

    const handleMove = (fromIndex: number, direction: 'up' | 'down') => {
      const newList = [...list];
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
      if (toIndex >= 0 && toIndex < newList.length) {
        [newList[fromIndex], newList[toIndex]] = [newList[toIndex], newList[fromIndex]];
        onSelect(newList, 'sequence');
      }
    };

    return (
      <View style={styles.optionsContainer}>
        {list.map((item: Answer, index: number) => (
          <View key={index} style={styles.sequenceItem}>
            <ThemedText style={styles.optionText}>{item.content}</ThemedText>
            <View style={styles.sequenceControls}>
              <TouchableOpacity
                onPress={() => handleMove(index, 'up')}
                disabled={index === 0}
                style={[styles.arrowButton, index === 0 && styles.disabledArrow]}
              >
                <ThemedText style={styles.arrowText}>▲</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMove(index, 'down')}
                disabled={index === list.length - 1}
                style={[styles.arrowButton, index === list.length - 1 && styles.disabledArrow]}
              >
                <ThemedText style={styles.arrowText}>▼</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.optionsContainer}>
      {question.answers.map((option: Answer, index: number) => {
        const isSelected = isMultiple
          ? (userAnswer as number[])?.includes(index)
          : userAnswer === index;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
            onPress={() => onSelect(index, isMultiple ? 'multiple-choice' : 'single-choice')}
            activeOpacity={0.7}
          >
            <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
              {isSelected && <ThemedText style={styles.optionCheck}>✓</ThemedText>}
            </View>
            <ThemedText style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option.content}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: BrandingColors.hotPink,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  optionCircleSelected: {
    borderColor: BrandingColors.hotPink,
    backgroundColor: BrandingColors.hotPink,
  },
  optionCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: BrandingColors.hotPink,
    fontWeight: '700',
  },
  sequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  sequenceControls: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 14,
    color: '#4B5563',
  },
  disabledArrow: {
    opacity: 0.3,
  },
});
