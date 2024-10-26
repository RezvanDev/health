import React from 'react';
import { 
  BarChart2, 
  Target, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Star,
  Heart,
  Brain,
  Gamepad,
  Compass
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface CategoryStats {
  name: string;
  completed: number;
  color: string;
  icon: React.ReactNode;
}

const categoryStats: CategoryStats[] = [
  { name: 'Финансы', completed: 45, color: '#EAB308', icon: <Star className="text-yellow-500" /> },
  { name: 'Отношения', completed: 32, color: '#EC4899', icon: <Heart className="text-pink-500" /> },
  { name: 'Осознанность', completed: 28, color: '#8B5CF6', icon: <Brain className="text-purple-500" /> },
  { name: 'Развлечения', completed: 15, color: '#3B82F6', icon: <Gamepad className="text-blue-500" /> },
  { name: 'Смысл жизни', completed: 20, color: '#22C55E', icon: <Compass className="text-green-500" /> }
];

const weeklyProgress = [
  { day: 'Пн', tasks: 5, xp: 150 },
  { day: 'Вт', tasks: 7, xp: 210 },
  { day: 'Ср', tasks: 4, xp: 120 },
  { day: 'Чт', tasks: 8, xp: 240 },
  { day: 'Пт', tasks: 6, xp: 180 },
  { day: 'Сб', tasks: 3, xp: 90 },
  { day: 'Вс', tasks: 5, xp: 150 }
];

const monthlyXP = [
  { month: 'Янв', xp: 2100 },
  { month: 'Фев', xp: 2400 },
  { month: 'Мар', xp: 2750 }
];

export function DetailedStats() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart2 className="mr-2 text-blue-500" size={28} />
          Подробная статистика
        </h1>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Общий прогресс"
          value="78%"
          subtitle="Выполнено задач"
          icon={<Target className="text-blue-500" size={24} />}
        />
        <MetricCard
          title="Продуктивность"
          value="92%"
          subtitle="За последние 7 дней"
          icon={<TrendingUp className="text-green-500" size={24} />}
        />
        <MetricCard
          title="Среднее время"
          value="45"
          subtitle="Минут на задачу"
          icon={<Clock className="text-purple-500" size={24} />}
        />
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График XP по дням недели */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">XP за неделю</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="xp" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* График прогресса по месяцам */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Прогресс по месяцам</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyXP}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Статистика по категориям */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Круговая диаграмма */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Распределение по категориям</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="completed"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Список категорий */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Активность по категориям</h3>
          <div className="space-y-4">
            {categoryStats.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full mr-3">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(category.completed / 50) * 100}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{category.completed} задач</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Достижения за период */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Последние достижения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AchievementCard
            title="Ранняя пташка"
            description="7 дней подряд выполняли утренние задачи"
            date="24 марта"
            icon={<Trophy className="text-yellow-500" />}
          />
          <AchievementCard
            title="Мастер медитации"
            description="30 дней практики осознанности"
            date="22 марта"
            icon={<Trophy className="text-purple-500" />}
          />
          <AchievementCard
            title="Финансовый гуру"
            description="Выполнено 50 задач по финансам"
            date="20 марта"
            icon={<Trophy className="text-blue-500" />}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {value}
        <span className="text-sm font-normal text-gray-500 ml-1">{subtitle}</span>
      </div>
    </div>
  );
}

function AchievementCard({ title, description, date, icon }: {
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <span className="text-xs text-gray-400 mt-2 block">{date}</span>
        </div>
      </div>
    </div>
  );
}

export default DetailedStats;