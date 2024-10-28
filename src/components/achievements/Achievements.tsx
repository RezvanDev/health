import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Target, Loader2 } from 'lucide-react';
import { achievementsApi, Achievement, Leader, Stats } from '../../api/achievementsApi';
import { AchievementCard } from './AchievementCard';
import { LeaderboardCard } from './LeaderboardCard';
import { StatsCard } from './StatsCard';

type ActiveTab = 'progress' | 'achievements' | 'leaderboard';

export function Achievements() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('progress');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [currentUserPosition, setCurrentUserPosition] = useState<number>(0);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [achievementsData, leaderboardData] = await Promise.all([
        achievementsApi.getUserAchievements(),
        achievementsApi.getLeaderboard()
      ]);

      setAchievements(achievementsData.achievements);
      setStats(achievementsData.stats);
      setLeaders(leaderboardData.leaderboard);
      setCurrentUserPosition(leaderboardData.currentUser.position);
    } catch (err) {
      console.error('Error loading achievements:', err);
      setError('Не удалось загрузить данные. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const tabConfig = [
    {
      id: 'progress' as const,
      label: 'Прогресс',
      icon: Target
    },
    {
      id: 'achievements' as const,
      label: 'Достижения',
      icon: Trophy
    },
    {
      id: 'leaderboard' as const,
      label: 'Лидеры',
      icon: Crown
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-500">Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 rounded-xl bg-red-50">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      {/* Общая статистика всегда видна */}
      {stats && <StatsCard stats={stats} />}

      {/* Переключатель вкладок */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
        {tabConfig.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Контент вкладок */}
      <div className="min-h-[400px]">
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {/* Фильтры и сортировка */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                Достижения ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </h2>
            </div>

            {/* Список достижений */}
            <div className="space-y-4">
              {achievements
                .sort((a, b) => {
                  // Сначала разблокированные
                  if (a.unlocked !== b.unlocked) {
                    return a.unlocked ? -1 : 1;
                  }
                  // Затем по прогрессу
                  const aProgress = a.progress / a.maxProgress;
                  const bProgress = b.progress / b.maxProgress;
                  return bProgress - aProgress;
                })
                .map((achievement) => (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement}
                  />
                ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Таблица лидеров</h2>
              {currentUserPosition > 10 && (
                <p className="text-sm text-gray-500">
                  Ваше место: #{currentUserPosition}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {leaders.map((leader) => (
                <LeaderboardCard
                  key={leader.position}
                  leader={leader}
                  isCurrentUser={leader.position === currentUserPosition}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && stats && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {/* Дополнительная статистика */}
              <div className="rounded-xl bg-white border border-gray-100 p-4">
                <h3 className="text-lg font-medium mb-4">Общий прогресс</h3>
                <div className="space-y-4">
                  {/* Прогресс выполнения ежедневных заданий */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ежедневные задания</span>
                      <span className="text-gray-500">
                        {stats.progressStats.daily.completed}/{stats.progressStats.daily.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(stats.progressStats.daily.completed / stats.progressStats.daily.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Прогресс выполнения еженедельных заданий */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Еженедельные задания</span>
                      <span className="text-gray-500">
                        {stats.progressStats.weekly.completed}/{stats.progressStats.weekly.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(stats.progressStats.weekly.completed / stats.progressStats.weekly.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Прогресс выполнения ежемесячных заданий */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ежемесячные задания</span>
                      <span className="text-gray-500">
                        {stats.progressStats.monthly.completed}/{stats.progressStats.monthly.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(stats.progressStats.monthly.completed / stats.progressStats.monthly.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Следующее достижение */}
              {achievements.length > 0 && (
                <div className="rounded-xl bg-white border border-gray-100 p-4">
                  <h3 className="text-lg font-medium mb-4">Следующее достижение</h3>
                  {achievements
                    .filter(a => !a.unlocked)
                    .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
                    .slice(0, 1)
                    .map(achievement => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Achievements;