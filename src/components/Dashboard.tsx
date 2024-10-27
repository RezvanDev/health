import React, { useState, useEffect } from 'react';
import { Brain, Heart, Star, Target, Compass, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { fetchTasks, completeTask } from '../api/tasks';

interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  xp: number;
  icon: React.ReactNode;
  completed: boolean;
}

interface CompletionNotification {
  show: boolean;
  xp: number;
}

const getIconComponent = (category: string) => {
  switch (category) {
    case 'finance':
      return <Star className="text-yellow-400" />;
    case 'relationships':
      return <Heart className="text-red-400" />;
    case 'mindfulness':
      return <Brain className="text-purple-400" />;
    case 'meaning':
      return <Compass className="text-green-400" />;
    default:
      return <Target className="text-blue-400" />;
  }
};

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      category: 'finance',
      title: 'Проанализировать расходы',
      description: 'Просмотрите траты за последнюю неделю',
      xp: 50,
      icon: getIconComponent('finance'),
      completed: false
    },
    {
      id: '2',
      category: 'relationships',
      title: 'Позвонить близким',
      description: 'Уделите время общению с семьей',
      xp: 30,
      icon: getIconComponent('relationships'),
      completed: false
    },
    {
      id: '3',
      category: 'mindfulness',
      title: 'Медитация',
      description: '15 минут осознанной практики',
      xp: 40,
      icon: getIconComponent('mindfulness'),
      completed: false
    },
    {
      id: '4',
      category: 'meaning',
      title: 'Рефлексия дня',
      description: 'Запишите три главных вывода за день',
      xp: 35,
      icon: getIconComponent('meaning'),
      completed: false
    }
  ]);

  const [taskType, setTaskType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [notification, setNotification] = useState<CompletionNotification>({
    show: false,
    xp: 0
  });

  const quotes = [
    "Каждый день - это новая возможность стать лучше",
    "Маленькие шаги ведут к большим достижениям",
    "Путь в тысячу ли начинается с первого шага"
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleTaskCompletion = (taskId: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => {
        if (task.id === taskId && !task.completed) {
          showCompletionNotification(task.xp);
          return { ...task, completed: true };
        }
        return task;
      })
    );
  };

  const showCompletionNotification = (xp: number) => {
    setNotification({ show: true, xp });
    setTimeout(() => {
      setNotification({ show: false, xp: 0 });
    }, 3000);
  };

  const totalAvailableXP = tasks
    .filter(task => !task.completed)
    .reduce((sum, task) => sum + task.xp, 0);

  // Получаем имя пользователя из Telegram WebApp
  const getUserName = () => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      return window.Telegram.WebApp.initDataUnsafe.user.first_name || 
             window.Telegram.WebApp.initDataUnsafe.user.username ||
             'пользователь';
    }
    return 'пользователь';
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Уведомление о выполнении */}
        {notification.show && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center justify-center space-x-2 z-50 min-w-[200px]">
            <Trophy className="text-yellow-300" size={20} />
            <span className="font-medium">+{notification.xp} XP</span>
          </div>
        )}

        {/* Приветствие и мотивация */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--tg-theme-button-color)] to-blue-600 p-6 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="text-yellow-300" size={24} />
              <h1 className="text-2xl font-bold text-white">
                Приветствую, {getUserName()}!
              </h1>
            </div>
            <p className="text-base text-white opacity-90 font-light">
              {randomQuote}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 transform rotate-45 translate-x-32 -translate-y-32"></div>
        </div>

        {/* Навигация по типам задач */}
        <div className="sticky top-0 z-40 bg-[var(--tg-theme-bg-color)] pt-2 pb-4">
          <div className="flex justify-between gap-2">
            {[
              { type: 'daily' as const, label: 'Ежедневные' },
              { type: 'weekly' as const, label: 'Еженедельные' },
              { type: 'monthly' as const, label: 'Ежемесячные' }
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setTaskType(type)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                  taskType === type
                    ? 'bg-[var(--tg-theme-button-color)] text-white shadow-lg'
                    : 'bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] hover:opacity-80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Секция с задачами */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--tg-theme-text-color)] flex items-center">
              <Target className="mr-2 text-[var(--tg-theme-button-color)]" size={24} />
              {taskType === 'daily' && 'Задания на сегодня'}
              {taskType === 'weekly' && 'Задания на неделю'}
              {taskType === 'monthly' && 'Задания на месяц'}
            </h2>
            <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--tg-theme-secondary-bg-color)]">
              <Trophy size={18} className="text-yellow-400" />
              <span className="font-medium text-[var(--tg-theme-text-color)]">
                +{totalAvailableXP} XP
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  task.completed 
                    ? 'bg-[var(--tg-theme-secondary-bg-color)] border border-green-200'
                    : 'bg-white shadow-md hover:shadow-lg'
                }`}
                style={{ minHeight: '160px' }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-auto">
                    <div className={`p-2 rounded-lg ${
                      task.completed 
                        ? 'bg-green-100'
                        : 'bg-[var(--tg-theme-secondary-bg-color)]'
                    }`}>
                      {task.completed ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : task.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-medium ${
                          task.completed ? 'text-gray-500' : 'text-[var(--tg-theme-text-color)]'
                        }`}>
                          {task.title}
                        </h3>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                          task.completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {task.completed ? 'Получено' : '+'}{task.xp} XP
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{task.description}</p>
                    </div>
                  </div>
                  {!task.completed && (
                    <button 
                      onClick={() => handleTaskCompletion(task.id)}
                      className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[var(--tg-theme-button-color)] text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      Выполнить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;