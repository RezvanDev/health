import axios from 'axios';

interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

interface TaskResponse {
  tasks: Task[];
  totalXP: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для данных Telegram
api.interceptors.request.use((config) => {
  const telegramInitData = window.Telegram?.WebApp?.initData;
  if (telegramInitData) {
    config.headers['X-Telegram-Auth-Data'] = telegramInitData;
  }
  return config;
});

export const fetchTasks = async (type: 'daily' | 'weekly' | 'monthly'): Promise<TaskResponse> => {
  const { data } = await api.get(`/tasks?type=${type}`);
  return data;
};

export const completeTask = async (taskId: string): Promise<Task> => {
  const { data } = await api.post(`/tasks/${taskId}/complete`);
  return data;
};