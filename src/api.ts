import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'https://602e-202-79-184-241.ngrok-free.app/api';

// Общие типы
type Period = 'daily' | 'weekly' | 'monthly';
type Priority = 'low' | 'medium' | 'high';
type Category = 'finance' | 'relationships' | 'mindfulness' | 'entertainment' | 'meaning';

// Системные задачи (рекомендации)
export interface SystemTask {
  id: string;
  title: string;
  description: string;
  category: Category;
  xp: number;
  period: Period;
  completed: boolean;
  completedAt?: string;
}

// Пользовательские задачи
export interface UserTask {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  deadline?: string;
  xp: number;
  createdAt: string;
}

// Остальные интерфейсы
export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  category: string;
}

export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
}

// API клиент
export const api = {
  // Системные задачи (рекомендации на дашборде)
  systemTasks: {
    getAll: async (period: Period): Promise<SystemTask[]> => {
      const response = await axios.get(`${API_URL}/system-tasks`, {
        params: { period }
      });
      return response.data;
    },

    complete: async (taskId: string): Promise<SystemTask> => {
      const response = await axios.post(`${API_URL}/system-tasks/${taskId}/complete`);
      return response.data;
    }
  },

  // Пользовательские задачи
  userTasks: {
    getAll: async (): Promise<UserTask[]> => {
      const response = await axios.get(`${API_URL}/user-tasks`);
      return response.data;
    },

    create: async (taskData: Omit<UserTask, 'id' | 'completed' | 'createdAt'>): Promise<UserTask> => {
      const response = await axios.post(`${API_URL}/user-tasks`, taskData);
      return response.data;
    },

    complete: async (taskId: string): Promise<UserTask> => {
      const response = await axios.post(`${API_URL}/user-tasks/${taskId}/complete`);
      return response.data;
    },

    delete: async (taskId: string): Promise<void> => {
      await axios.delete(`${API_URL}/user-tasks/${taskId}`);
    }
  },

  // Достижения остаются без изменений
  achievements: {
    getAll: async (): Promise<Achievement[]> => {
      const response = await axios.get(`${API_URL}/achievements`);
      return response.data;
    },

    getProgress: async (): Promise<{
      daily: { completed: number; total: number; trend: string };
      weekly: { completed: number; total: number; trend: string };
      monthly: { completed: number; total: number; trend: string };
    }> => {
      const response = await axios.get(`${API_URL}/achievements/progress`);
      return response.data;
    }
  },

  // Статистика
  stats: {
    getDaily: async () => {
      const response = await axios.get(`${API_URL}/stats/daily`);
      return response.data;
    },

    getWeekly: async () => {
      const response = await axios.get(`${API_URL}/stats/weekly`);
      return response.data;
    },

    getMonthly: async () => {
      const response = await axios.get(`${API_URL}/stats/monthly`);
      return response.data;
    },

    getCategories: async () => {
      const response = await axios.get(`${API_URL}/stats/categories`);
      return response.data;
    }
  },

  // Профиль
  profile: {
    get: async (): Promise<UserProfile> => {
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    },

    update: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      const response = await axios.put(`${API_URL}/profile`, data);
      return response.data;
    },

    getProgress: async () => {
      const response = await axios.get(`${API_URL}/profile/progress`);
      return response.data;
    }
  }
};

// Настройка перехватчика для Telegram
axios.interceptors.request.use((config) => {
  if (window.Telegram?.WebApp) {
    const webAppData = window.Telegram.WebApp.initData;
    config.headers['x-telegram-auth-data'] = webAppData;
  }
  return config;
});

export default api;