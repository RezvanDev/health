import React, { useState } from 'react';
import { User, Award, Target, Zap, Calendar, BarChart2, Settings, ChevronRight } from 'lucide-react';
import { DetailedStats } from './DetailedStats';

interface UserStats {
  level: number;
  xp: number;
  nextLevelXP: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  achievements: number;
  totalAchievements: number;
}

const userStats: UserStats = {
  level: 15,
  xp: 2750,
  nextLevelXP: 3000,
  tasksCompleted: 127,
  currentStreak: 7,
  longestStreak: 14,
  achievements: 12,
  totalAchievements: 20
};

export function Profile() {
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  if (showDetailedStats) {
    return <DetailedStats onBack={() => setShowDetailedStats(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Профиль */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <User size={48} className="text-white" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">Александр</h1>
            <p className="text-gray-500">@username</p>
            
            <div className="mt-4">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <span className="text-lg font-bold">Уровень {userStats.level}</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                  + {userStats.nextLevelXP - userStats.xp} XP до след. уровня
                </span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(userStats.xp / userStats.nextLevelXP) * 100}%` }}
                />
              </div>
              
              <div className="mt-1 text-sm text-gray-500">
                {userStats.xp} / {userStats.nextLevelXP} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="text-blue-500" />}
          title="Выполнено задач"
          value={userStats.tasksCompleted}
        />
        <StatCard
          icon={<Zap className="text-yellow-500" />}
          title="Текущая серия"
          value={userStats.currentStreak}
          subtitle="дней"
        />
        <StatCard
          icon={<Calendar className="text-green-500" />}
          title="Лучшая серия"
          value={userStats.longestStreak}
          subtitle="дней"
        />
        <StatCard
          icon={<Award className="text-purple-500" />}
          title="Достижения"
          value={userStats.achievements}
          subtitle={`из ${userStats.totalAchievements}`}
        />
      </div>

      {/* Действия */}
      <div className="space-y-3">
        <button 
          onClick={() => setShowDetailedStats(true)}
          className="w-full p-4 bg-white rounded-xl shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <BarChart2 size={20} className="text-blue-500" />
            <span className="font-medium">Подробная статистика</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
        
        <button className="w-full p-4 bg-white rounded-xl shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <Settings size={20} className="text-gray-500" />
            <span className="font-medium">Настройки</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}

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
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {value}
        {subtitle && <span className="text-sm font-normal text-gray-500 ml-1">{subtitle}</span>}
      </div>
    </div>
  );
}

export default Profile;