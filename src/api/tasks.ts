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

export const fetchTasks = async (type: 'daily' | 'weekly' | 'monthly') => {
    try {
      console.log('Fetching tasks for type:', type);
      const { data } = await api.get(`/tasks?type=${type}`);
      console.log('Received data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };

export const completeTask = async (taskId: string): Promise<Task> => {
  const { data } = await api.post(`/tasks/${taskId}/complete`);
  return data;
};