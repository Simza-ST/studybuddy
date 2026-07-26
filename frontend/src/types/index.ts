export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Material {
  id: string;
  userId: string;
  title: string;
  type: 'pdf' | 'docx' | 'text' | 'image';
  url: string;
  uploadedAt: string;
}

export interface Question {
  id: string;
  materialId: string;
  type: 'mcq' | 'short-answer' | 'long-answer';
  text: string;
  options?: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  explanation: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  materialId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
