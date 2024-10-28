import api from './api';

export interface UserProfile {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string | null;
  totalXP: number;
  level: number;
  nextLevelXP: number;
}

export interface UserStats {
  tasksCompleted: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  categories: {
    [key: string]: {
      completed: number;
      total: number;
    };
  };
  achievements: {
    unlocked: number;
    total: number;
  };
}

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    try {
      const { data } = await api.get('/profile');
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async getUserStats(): Promise<UserStats> {
    try {
      const { data } = await api.get('/profile/stats');
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};