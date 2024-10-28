import React, { useState, useEffect } from 'react';
import { 
  User, Award, Target, Zap, Calendar, 
  BarChart2, Settings, ChevronRight, Loader2 
} from 'lucide-react';
import { profileApi, UserProfile, UserStats } from '../api/profileApi';

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Получаем данные профиля и статистику
      const profileData = await profileApi.getProfile();
      const statsData = await profileApi.getUserStats();

      console.log('Profile data:', profileData); // Для отладки
      console.log('Stats data:', statsData);     // Для отладки

      setProfile(profileData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Не удалось загрузить данные профиля');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--tg-theme-button-color)]" />
        <p className="mt-2 text-[var(--tg-theme-hint-color)]">Загрузка профиля...</p>
      </div>
    );
  }

  if (error || !profile || !stats) {
    return (
      <div className="min-h-screen bg-[var(--tg-theme-bg-color)] p-4 flex items-center justify-center">
        <div className="tg-card w-full max-w-md text-center p-6">
          <p className="text-red-500 mb-4">{error || 'Не удалось загрузить данные'}</p>
          <button 
            onClick={loadProfileData}
            className="tg-button"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const xpForNextLevel = profile.nextLevelXP - profile.totalXP;
  const xpProgress = ((profile.totalXP % 1000) / 1000) * 100;

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Профиль */}
        <div className="tg-card p-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Аватар */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--tg-theme-button-color)] to-purple-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>

            {/* Информация */}
            <div className="text-center">
              <h1 className="text-xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-[var(--tg-theme-hint-color)]">
                @{profile.username}
              </p>
            </div>

            {/* XP прогресс */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Уровень {profile.level}</span>
                <span className="text-sm text-[var(--tg-theme-button-color)]">
                  +{xpForNextLevel} XP до {profile.level + 1} уровня
                </span>
              </div>
              <div className="w-full bg-[var(--tg-theme-secondary-bg-color)] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[var(--tg-theme-button-color)] to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1 text-center">
                {profile.totalXP} / {profile.nextLevelXP} XP
              </p>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Target className="text-[var(--tg-theme-button-color)]" />}
            title="Выполнено задач"
            value={stats.tasksCompleted.total}
            subtitle={`${stats.tasksCompleted.daily} сегодня`}
          />
          
          <StatCard
            icon={<Award className="text-purple-500" />}
            title="Достижения"
            value={stats.achievements.unlocked}
            subtitle={`из ${stats.achievements.total}`}
          />
        </div>

        {/* Категории */}
        <div className="tg-card p-4 space-y-4">
          <h3 className="font-medium">Категории</h3>
          {Object.entries(stats.categories).map(([key, data]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span>{getCategoryName(key)}</span>
                <span className="text-[var(--tg-theme-hint-color)]">
                  {data.completed}/{data.total}
                </span>
              </div>
              <div className="w-full bg-[var(--tg-theme-secondary-bg-color)] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[var(--tg-theme-button-color)] to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${(data.completed / data.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Действия */}
        <div className="space-y-2">
          <button className="tg-card p-4 w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart2 className="text-[var(--tg-theme-button-color)]" />
              <span>Детальная статистика</span>
            </div>
            <ChevronRight className="text-[var(--tg-theme-hint-color)]" />
          </button>

          <button className="tg-card p-4 w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="text-[var(--tg-theme-hint-color)]" />
              <span>Настройки</span>
            </div>
            <ChevronRight className="text-[var(--tg-theme-hint-color)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Компонент статистики
function StatCard({
  icon,
  title,
  value,
  subtitle
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle?: string;
}) {
  return (
    <div className="tg-card p-4">
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div>
        <span className="text-2xl font-bold">{value}</span>
        {subtitle && (
          <span className="text-sm text-[var(--tg-theme-hint-color)] ml-2">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

// Получение названия категории
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    finance: 'Финансы',
    relationships: 'Отношения',
    mindfulness: 'Осознанность',
    entertainment: 'Развлечения',
    meaning: 'Смысл жизни'
  };
  return names[category] || category;
}

export default Profile;