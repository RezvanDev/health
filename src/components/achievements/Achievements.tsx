import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Target, Loader2 } from 'lucide-react';
import { achievementsApi, Achievement, Leader, Stats } from '../../api/achievementsApi';
import { AchievementCard } from './AchievementCard';
import { LeaderboardCard } from './LeaderboardCard';
import { StatsCard } from './StatsCard';

type ActiveTab = 'progress' | 'achievements' | 'leaderboard';

const gradients = {
  daily: 'from-blue-500 to-blue-600',
  weekly: 'from-purple-500 to-purple-600',
  monthly: 'from-amber-500 to-amber-600'
};

export function Achievements() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('progress');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [currentUserPosition, setCurrentUserPosition] = useState<number>(0);
  const [stats, setStats] = useState<Stats | null>(null);

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

  const renderProgressBars = () => {
    if (!stats) return null;

    const progressData = [
      {
        label: 'Ежедневные задания',
        data: stats.progressStats.daily,
        gradient: gradients.daily
      },
      {
        label: 'Еженедельные задания',
        data: stats.progressStats.weekly,
        gradient: gradients.weekly
      },
      {
        label: 'Ежемесячные задания',
        data: stats.progressStats.monthly,
        gradient: gradients.monthly
      }
    ];

    return progressData.map(({ label, data, gradient }) => (
      <div key={label} className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">{label}</span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {data.completed}/{data.total}
            </span>
            <span className="text-xs text-gray-500">{data.trend}</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-500`}
            style={{
              width: `${(data.completed / data.total) * 100}%`
            }}
          />
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-500">Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--tg-theme-bg-color)] p-4 flex items-center justify-center">
        <div className="text-center w-full max-w-md py-8 rounded-xl bg-red-50">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="max-w-3xl mx-auto">
        {/* Верхняя статистика */}
        <div className="p-4 mb-4">
          {stats && <StatsCard stats={stats} />}
        </div>

        {/* Навигация */}
        <div className="sticky top-0 z-10 bg-[var(--tg-theme-bg-color)] px-4 py-2">
          <div className="bg-gray-100 p-1 rounded-xl shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              {tabConfig.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    py-2.5 
                    rounded-lg 
                    font-medium 
                    transition-all
                    duration-200
                    flex 
                    items-center 
                    justify-center 
                    gap-2
                    ${
                      activeTab === id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="p-4">
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  Достижения ({achievements.filter(a => a.unlocked).length}/{achievements.length})
                </h2>
              </div>
              <div className="space-y-3">
                {achievements
                  .sort((a, b) => {
                    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
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
              {/* Прогресс */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-medium mb-6">Общий прогресс</h3>
                <div className="space-y-6">
                  {renderProgressBars()}
                </div>
              </div>

              {/* Следующее достижение */}
              {achievements.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Achievements;