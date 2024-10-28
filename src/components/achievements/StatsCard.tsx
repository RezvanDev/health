import React from 'react';
import { Trophy, Star, Target, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { Stats } from '../../api/achievementsApi';

interface StatsCardProps {
  stats: Stats;
}

interface StatCardInfo {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  subtext?: string;
}

export function StatsCard({ stats }: StatsCardProps) {
  const achievementPercentage = Math.round(
    (stats.achievementsUnlocked / stats.totalAchievements) * 100
  );

  const cards: StatCardInfo[] = [
    {
      title: 'Всего XP',
      value: stats.totalXP.toLocaleString(),
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      gradient: 'from-yellow-400 to-amber-500',
      subtext: `Уровень ${Math.floor(stats.totalXP / 1000) + 1}`
    },
    {
      title: 'Достижения',
      value: `${stats.achievementsUnlocked}/${stats.totalAchievements}`,
      icon: <Trophy className="w-5 h-5 text-purple-500" />,
      gradient: 'from-purple-400 to-pink-500',
      subtext: `${achievementPercentage}% выполнено`
    },
    {
      title: 'Прогресс за неделю',
      value: `${stats.progressStats.weekly.completed}/${stats.progressStats.weekly.total}`,
      icon: <Target className="w-5 h-5 text-blue-500" />,
      gradient: 'from-blue-400 to-cyan-500',
      subtext: stats.progressStats.weekly.trend
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${card.gradient} bg-opacity-10`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-xl font-bold">{card.value}</p>
                {card.subtext && (
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center">
                    {getTrendIcon(card.subtext)}
                    {card.subtext}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Вспомогательная функция для отображения иконки тренда
function getTrendIcon(trend: string) {
  if (trend.includes('+') || trend.includes('рост')) {
    return <ArrowUp className="w-3 h-3 text-green-500 mr-1" />;
  }
  if (trend.includes('-') || trend.includes('спад')) {
    return <ArrowDown className="w-3 h-3 text-red-500 mr-1" />;
  }
  return <ArrowRight className="w-3 h-3 text-gray-500 mr-1" />;
}

export default StatsCard;