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
      
      // Загружаем данные параллельно
      const [profileData, statsData] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getUserStats()
      ]);

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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--tg-theme-button-color)]" />
        <p className="mt-2 text-[var(--tg-theme-hint-color)]">Загрузка профиля...</p>
      </div>
    );
  }

  if (error || !profile || !stats) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="tg-card text-center py-8 w-full max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
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
  const xpProgress = (profile.totalXP % 1000) / 10; // Прогресс в процентах

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Профиль пользователя */}
        <div className="tg-card">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Аватар */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--tg-theme-button-color)] to-purple-500 flex items-center justify-center shadow-lg">
              <User size={48} className="text-white" />
            </div>
            
            {/* Информация */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-[var(--tg-theme-hint-color)]">
                @{profile.username}
              </p>
              
              {/* Прогресс уровня */}
              <div className="mt-4">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <span className="text-lg font-bold">Уровень {profile.level}</span>
                  <span className="px-2 py-1 bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-button-color)] text-xs font-medium rounded-full">
                    +{xpForNextLevel} XP до {profile.level + 1} уровня
                  </span>
                </div>
                
                <div className="w-full bg-[var(--tg-theme-secondary-bg-color)] rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-[var(--tg-theme-button-color)] to-purple-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                
                <div className="mt-1 text-sm text-[var(--tg-theme-hint-color)]">
                  {profile.totalXP.toLocaleString()} / {profile.nextLevelXP.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Target className="text-[var(--tg-theme-button-color)]" />}
            title="Выполнено задач"
            value={stats.tasksCompleted.total}
            subtitle={`${stats.tasksCompleted.daily} сегодня`}
          />
          
          <StatCard
            icon={<Zap className="text-yellow-500" />}
            title="Текущая серия"
            value={stats.streak.current}
            subtitle="дней подряд"
          />
          
          <StatCard
            icon={<Calendar className="text-green-500" />}
            title="Лучшая серия"
            value={stats.streak.longest}
            subtitle="дней подряд"
          />
          
          <StatCard
            icon={<Award className="text-purple-500" />}
            title="Достижения"
            value={stats.achievements.unlocked}
            subtitle={`из ${stats.achievements.total}`}
          />
        </div>

        {/* Прогресс по категориям */}
        <div className="tg-card space-y-4">
          <h3 className="font-medium">Прогресс по категориям</h3>
          {Object.entries(stats.categories).map(([category, data]) => (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--tg-theme-text-color)]">
                  {getCategoryName(category)}
                </span>
                <span className="text-[var(--tg-theme-hint-color)]">
                  {data.completed}/{data.total}
                </span>
              </div>
              <div className="w-full bg-[var(--tg-theme-secondary-bg-color)] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[var(--tg-theme-button-color)] to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.completed / data.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Действия */}
        <div className="space-y-3">
          <button 
            onClick={() => {}} // TODO: Добавить переход к детальной статистике
            className="tg-card w-full flex items-center justify-between hover:bg-[var(--tg-theme-secondary-bg-color)] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <BarChart2 className="text-[var(--tg-theme-button-color)]" />
              <span>Подробная статистика</span>
            </div>
            <ChevronRight className="text-[var(--tg-theme-hint-color)]" />
          </button>
          
          <button 
            className="tg-card w-full flex items-center justify-between hover:bg-[var(--tg-theme-secondary-bg-color)] transition-colors"
          >
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

// Компонент карточки статистики
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle?: string;
}

function StatCard({ icon, title, value, subtitle }: StatCardProps) {
  return (
    <div className="tg-card">
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <span className="text-sm text-[var(--tg-theme-hint-color)]">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {value.toLocaleString()}
        {subtitle && (
          <div className="text-sm font-normal text-[var(--tg-theme-hint-color)]">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// Вспомогательная функция для получения названия категории
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