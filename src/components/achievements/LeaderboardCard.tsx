import React from 'react';
import { Crown, Medal } from 'lucide-react';
import { Leader } from '../../api/achievementsApi';

interface LeaderboardCardProps {
  leader: Leader;
  isCurrentUser?: boolean;
}

interface PositionConfig {
  icon: typeof Crown | typeof Medal;
  color: string;
  gradient: string;
}

const positionConfig: Record<number, PositionConfig> = {
  1: {
    icon: Crown,
    color: 'text-yellow-500',
    gradient: 'from-yellow-500 to-amber-500'
  },
  2: {
    icon: Medal,
    color: 'text-gray-400',
    gradient: 'from-gray-400 to-gray-500'
  },
  3: {
    icon: Medal,
    color: 'text-amber-600',
    gradient: 'from-amber-600 to-amber-700'
  }
};

const defaultConfig: PositionConfig = {
  icon: Medal,
  color: 'text-gray-400',
  gradient: 'from-gray-400 to-gray-500'
};

export function LeaderboardCard({ leader, isCurrentUser }: LeaderboardCardProps) {
  const config = positionConfig[leader.position] || defaultConfig;
  const Icon = config.icon;

  // Рассчитываем прогресс до следующего уровня
  const levelProgress = leader.xp % 1000;
  const levelProgressPercentage = (levelProgress / 1000) * 100;

  return (
    <div 
      className={`p-4 rounded-xl bg-white shadow-sm border transition-all ${
        isCurrentUser 
          ? 'border-blue-200 bg-blue-50' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 ${config.color}`}>
          <Icon size={24} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                {leader.name}
                {isCurrentUser && (
                  <span className="ml-2 text-xs text-blue-500">(Вы)</span>
                )}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <span>Уровень {leader.level}</span>
                <span>•</span>
                <span>{leader.achievementsCount} достижений</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium text-blue-600">
                {leader.xp.toLocaleString()} XP
              </span>
              <p className="text-xs text-gray-500">
                #{leader.position} место
              </p>
            </div>
          </div>
          <div className="mt-2">
            {/* Прогресс-бар уровня */}
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`bg-gradient-to-r ${config.gradient} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${levelProgressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Уровень {leader.level}</span>
              <span>{1000 - levelProgress} XP до уровня {leader.level + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardCard;