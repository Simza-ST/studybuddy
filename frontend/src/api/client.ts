import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // server will clear cookie if needed; client-side cleanup if any
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  async login(email: string, password: string) {
    const response = await client.post('/auth/login', { email, password });
    return response.data;
  },

  async signup(email: string, password: string, name: string) {
    const response = await client.post('/auth/signup', { email, password, name });
    return response.data;
  },

  async logout() {
    // server should clear cookie via endpoint; client ensures any local state is cleared
    localStorage.removeItem('auth_token');
    await client.post('/auth/logout');
  },

  async uploadMaterial(formData: FormData) {
    return client.post('/upload/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getMaterials() {
    return client.get('/materials');
  },

  async getMaterialById(id: string) {
    return client.get(`/materials/${id}`);
  },

  async startQuiz(materialId: string) {
    return client.post('/quiz/start', { materialId });
  },

  async submitAnswer(sessionId: string, answer: any) {
    return client.post(`/quiz/${sessionId}/answer`, answer);
  },

  async completeQuiz(sessionId: string) {
    return client.post(`/quiz/${sessionId}/complete`);
  },

  async getQuizHistory() {
    return client.get('/quiz/history');
  },

  async getAnalytics() {
    return client.get('/analytics/summary');
  },

  async getTopicStrength() {
    return client.get('/analytics/topics');
  },
};
