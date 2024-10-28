import api from './api';

export interface UserProfile {
  telegramId: string;
  username: string;
  firstName: string;
  lastName?: string;
  totalXP: number;
  level: number;
  stats: UserStats;
}

export interface UserStats {
  tasksCompleted: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  streak: {
    current: number;
    longest: number;
    lastActivity: string;
  };
  achievements: {
    unlocked: number;
    total: number;
  };
  categories: {
    [key: string]: {
      completed: number;
      total: number;
    };
  };
}

export const profileApi = {
  // Получение профиля пользователя
  async getProfile(): Promise<UserProfile> {
    try {
      const { data } = await api.get('/profile');
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  },

  // Получение статистики пользователя
  async getUserStats(): Promise<UserStats> {
    try {
      const { data } = await api.get('/profile/stats');
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user stats');
    }
  }
};