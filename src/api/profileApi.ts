import api from './api';

export interface UserProfile {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  lastName?: string;
  totalXP: number;
  level: number;
  nextLevelXP: number;
  stats?: {
    tasksCompleted: number;
    achievements: {
      unlocked: number;
      total: number;
    };
  };
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

export interface ProfileResponse {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string | null;
  totalXP: number;
  level: number;
  nextLevelXP: number;
  stats: {
    tasksCompleted: number;
    achievements: {
      unlocked: number;
      total: number;
    };
  };
}

export interface StatsResponse {
  tasksCompleted: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  categories: {
    [category: string]: {
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
  // Получение профиля пользователя
  async getProfile(): Promise<UserProfile> {
    try {
      const { data } = await api.get<ProfileResponse>('/profile');
      return {
        ...data,
        lastName: data.lastName || undefined
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  },

  // Получение статистики пользователя
  async getUserStats(): Promise<UserStats> {
    try {
      const { data } = await api.get<StatsResponse>('/profile/stats');
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user stats');
    }
  }
};

export default profileApi;