import React from 'react';
import { Trophy, Star, Medal, Crown } from 'lucide-react';
import { Achievement } from '../../api/achievementsApi';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const rarityConfig = {
    common: {
      gradient: 'from-gray-400 to-gray-500',
      icon: Star,
      label: 'Обычное'
    },
    rare: {
      gradient: 'from-blue-400 to-blue-500',
      icon: Medal,
      label: 'Редкое'
    },
    epic: {
      gradient: 'from-purple-400 to-purple-500',
      icon: Trophy,
      label: 'Эпическое'
    },
    legendary: {
      gradient: 'from-amber-400 to-amber-500',
      icon: Crown,
      label: 'Легендарное'
    }
  };

  const { gradient, icon: Icon, label } = rarityConfig[achievement.rarity];
  const progress = Math.min((achievement.progress / achievement.requirement) * 100, 100);

  return (
    <div 
      className={`p-4 rounded-xl bg-white shadow-sm border border-gray-100 transition-opacity ${
        achievement.unlocked ? 'opacity-100' : 'opacity-75'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="text-white" size={24} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">
                {achievement.title}
                {achievement.unlocked && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
            </div>
            <span className="text-sm text-emerald-500 font-medium">+{achievement.xpReward} XP</span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                {label}
              </span>
              <span>
                {achievement.progress}/{achievement.requirement}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}