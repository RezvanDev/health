import React, { useState } from 'react';
import { Trophy, Star, Crown, Medal, Target, Calendar, Clock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  category: string;
}

interface Leader {
  id: string;
  name: string;
  xp: number;
  level: number;
  position: number;
}

interface ProgressStats {
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

const progressStats: ProgressStats = {
  daily: {
    completed: 5,
    total: 8,
    trend: "+2 со вчера"
  },
  weekly: {
    completed: 12,
    total: 15,
    trend: "По графику"
  },
  monthly: {
    completed: 3,
    total: 5,
    trend: "Осталось 2"
  }
};

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Мастер финансов',
    description: 'Выполните 50 финансовых задач',
    progress: 30,
    maxProgress: 50,
    unlocked: false,
    icon: <Star className="text-yellow-500" />,
    rarity: 'epic',
    xp: 500,
    category: 'finance'
  },
  {
    id: '2',
    title: 'Гуру осознанности',
    description: 'Медитируйте 30 дней подряд',
    progress: 30,
    maxProgress: 30,
    unlocked: true,
    icon: <Medal className="text-purple-500" />,
    rarity: 'legendary',
    xp: 1000,
    category: 'mindfulness'
  }
];

const leaders: Leader[] = [
  { id: '1', name: 'Александр', xp: 15000, level: 25, position: 1 },
  { id: '2', name: 'Мария', xp: 12500, level: 20, position: 2 },
  { id: '3', name: 'Дмитрий', xp: 10000, level: 18, position: 3 }
];

export function Achievements() {
  const [activeTab, setActiveTab] = useState<'progress' | 'achievements' | 'leaderboard'>('progress');
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Переключатель */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'progress'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <Target className="inline-block mr-2 h-5 w-5" />
          Прогресс
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'achievements'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <Trophy className="inline-block mr-2 h-5 w-5" />
          Достижения
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'leaderboard'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <Crown className="inline-block mr-2 h-5 w-5" />
          Лидеры
        </button>
      </div>

      {activeTab === 'progress' && (
        <div className="grid gap-4">
          <ProgressCard
            title="Ежедневные задачи"
            icon={<Clock size={24} />}
            stats={progressStats.daily}
            gradient="from-blue-500 to-cyan-500"
          />
          <ProgressCard
            title="Недельные цели"
            icon={<Calendar size={24} />}
            stats={progressStats.weekly}
            gradient="from-purple-500 to-pink-500"
          />
          <ProgressCard
            title="Месячные вызовы"
            icon={<Target size={24} />}
            stats={progressStats.monthly}
            gradient="from-amber-500 to-orange-500"
          />
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressCard({ title, icon, stats, gradient }: {
  title: string;
  icon: React.ReactNode;
  stats: {
    completed: number;
    total: number;
    trend: string;
  };
  gradient: string;
}) {
  const percentage = (stats.completed / stats.total) * 100;

  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white`}>
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className="text-lg font-bold">
          {stats.completed}/{stats.total}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{Math.round(percentage)}%</span>
          <span className="text-gray-500">{stats.trend}</span>
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-amber-400 to-amber-500'
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]}`}>
          {achievement.icon}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{achievement.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
            </div>
            <span className="text-sm text-emerald-500 font-medium">+{achievement.xp} XP</span>
          </div>

          {!achievement.unlocked && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Прогресс</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeaderCard({ leader }: { leader: Leader }) {
  const positionColors = {
    1: 'text-yellow-500',
    2: 'text-gray-500',
    3: 'text-amber-600'
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className={`text-2xl font-bold ${positionColors[leader.position as keyof typeof positionColors] || 'text-gray-400'}`}>
          #{leader.position}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{leader.name}</h3>
              <p className="text-sm text-gray-500">Уровень {leader.level}</p>
              </div>
            <span className="text-sm font-medium text-blue-600">{leader.xp.toLocaleString()} XP</span>
          </div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Achievements;