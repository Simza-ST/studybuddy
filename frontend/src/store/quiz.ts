import { create } from 'zustand';
import { Question, QuizSession } from '../types';

interface QuizStore {
  currentSession: QuizSession | null;
  currentQuestions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  startSession: (session: QuizSession, questions: Question[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  recordAnswer: (questionId: string, answer: string) => void;
  completeSession: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentSession: null,
  currentQuestions: [],
  currentQuestionIndex: 0,
  answers: {},
  isLoading: false,
  error: null,
  startSession: (session: QuizSession, questions: Question[]) =>
    set({
      currentSession: session,
      currentQuestions: questions,
      currentQuestionIndex: 0,
      answers: {},
      error: null,
    }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.currentQuestions.length - 1
      ),
    })),
  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  recordAnswer: (questionId: string, answer: string) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    })),
  completeSession: () =>
    set({
      currentSession: null,
      currentQuestions: [],
      currentQuestionIndex: 0,
      answers: {},
    }),
  resetQuiz: () =>
    set({
      currentSession: null,
      currentQuestions: [],
      currentQuestionIndex: 0,
      answers: {},
      error: null,
    }),
}));
