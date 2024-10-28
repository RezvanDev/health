import api from './api';

// Базовые типы
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Category = 'finance' | 'relationships' | 'mindfulness' | 'entertainment' | 'meaning';

// Интерфейс достижения
export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  rarity: Rarity;
  category: Category;
  requirement: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  xpReward: number;
  icon: string;
}

// Интерфейс лидера
export interface Leader {
  position: number;
  name: string;
  xp: number;
  level: number;
  achievementsCount: number;
}

// Интерфейс статистики прогресса
export interface ProgressStats {
  daily: {
    completed: number;
    total: number;
    trend: string;
  };
  weekly: {
    completed: number;
    total: number;
    trend: string;
  };
  monthly: {
    completed: number;
    total: number;
    trend: string;
  };
}

// Общая статистика
export interface Stats {
  totalXP: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  progressStats: ProgressStats;
}

// Ответ от API для таблицы лидеров
export interface LeaderboardResponse {
  leaderboard: Leader[];
  currentUser: {
    position: number;
    name: string;
    xp: number;
  };
}

// Ответ от API для достижений
export interface AchievementsResponse {
  achievements: Achievement[];
  stats: Stats;
}

// API методы
export const achievementsApi = {
  // Получение достижений и статистики
  async getUserAchievements(): Promise<AchievementsResponse> {
    try {
      const { data } = await api.get('/achievements');
      return {
        achievements: data.achievements.map((achievement: any) => ({
          ...achievement,
          maxProgress: achievement.requirement,
          progress: achievement.progress || 0,
        })),
        stats: {
          totalXP: data.stats.totalXP || 0,
          achievementsUnlocked: data.stats.achievementsUnlocked || 0,
          totalAchievements: data.stats.totalAchievements || 0,
          progressStats: {
            daily: {
              completed: data.stats.dailyCompleted || 0,
              total: data.stats.dailyTotal || 0,
              trend: data.stats.dailyTrend || "Нет данных"
            },
            weekly: {
              completed: data.stats.weeklyCompleted || 0,
              total: data.stats.weeklyTotal || 0,
              trend: data.stats.weeklyTrend || "Нет данных"
            },
            monthly: {
              completed: data.stats.monthlyCompleted || 0,
              total: data.stats.monthlyTotal || 0,
              trend: data.stats.monthlyTrend || "Нет данных"
            }
          }
        }
      };
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw new Error('Failed to fetch achievements');
    }
  },

  // Получение лидерборда
  async getLeaderboard(): Promise<LeaderboardResponse> {
    try {
      const { data } = await api.get('/achievements/leaderboard');
      return {
        leaderboard: data.leaderboard.map((leader: any) => ({
          ...leader,
          level: Math.floor(leader.xp / 1000) + 1
        })),
        currentUser: data.currentUser
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }
};

export default achievementsApi;