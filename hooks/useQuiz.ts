import { useState, useCallback } from 'react';
import { Quiz, Question } from '@/data/mockData';

export type QuizState = 'intro' | 'questions' | 'review' | 'results';

export function useQuiz(quiz: Quiz) {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const startQuiz = useCallback(() => {
    setState('questions');
    setAnswers(Array(quiz.questions.length).fill(null));
    setCurrentQuestionIndex(0);
  }, [quiz.questions.length]);

  const selectAnswer = useCallback(
    (answer: any, type: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        if (type === 'multiple-choice' && typeof answer === 'number') {
          const currentSelection = (newAnswers[currentQuestionIndex] as number[]) || [];
          if (currentSelection.includes(answer)) {
            newAnswers[currentQuestionIndex] = currentSelection.filter((i) => i !== answer);
          } else {
            newAnswers[currentQuestionIndex] = [...currentSelection, answer];
          }
        } else {
          newAnswers[currentQuestionIndex] = answer;
        }
        return newAnswers;
      });
    },
    [currentQuestionIndex],
  );

  const calculateScore = useCallback(() => {
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];

      if (question.type === 'sequence') {
        if (Array.isArray(userAnswer)) {
          const isCorrect = userAnswer.every((ans, i) => ans.order === i + 1);
          if (isCorrect) correctCount++;
        }
      } else if (question.allowMultipleAnswers) {
        if (Array.isArray(userAnswer)) {
          const correctIndices = question.answers
            .map((a, i) => (a.is_correct ? i : -1))
            .filter((i) => i !== -1);

          const sortedUser = [...userAnswer].sort();
          const sortedCorrect = [...correctIndices].sort();

          if (
            sortedUser.length === sortedCorrect.length &&
            sortedUser.every((val, idx) => val === sortedCorrect[idx])
          ) {
            correctCount++;
          }
        }
      } else {
        if (userAnswer !== null && question.answers[userAnswer]?.is_correct) {
          correctCount++;
        }
      }
    });
    return Math.round((correctCount / quiz.questions.length) * 100);
  }, [answers, quiz.questions]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setState('review');
    }
  }, [currentQuestionIndex, quiz.questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const submitQuiz = useCallback(() => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setState('results');
  }, [calculateScore]);

  const retakeQuiz = useCallback(() => {
    setState('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
    setState('questions');
  }, []);

  return {
    state,
    setState,
    currentQuestionIndex,
    answers,
    score,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    retakeQuiz,
    goToQuestion,
    currentQuestion: quiz.questions[currentQuestionIndex],
    progress: ((currentQuestionIndex + 1) / quiz.questions.length) * 100,
    isAnswered: answers[currentQuestionIndex] !== null,
  };
}
