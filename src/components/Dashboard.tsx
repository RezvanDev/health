import React, { useState, useEffect } from 'react';
import { Brain, Heart, Star, Target, Compass, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { fetchTasks, completeTask } from '../api/tasks';

interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

interface CompletionNotification {
  show: boolean;
  xp: number;
}

interface User {
  firstName?: string;
  username?: string;
}

const getUserInfo = (): User | null => {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return {
      firstName: window.Telegram.WebApp.initDataUnsafe.user.first_name,
      username: window.Telegram.WebApp.initDataUnsafe.user.username
    };
  }
  return null;
};

const getIconComponent = (category: string) => {
  switch (category) {
    case 'finance':
      return <Star className="text-yellow-500" />;
    case 'relationships':
      return <Heart className="text-red-500" />;
    case 'mindfulness':
      return <Brain className="text-purple-500" />;
    case 'meaning':
      return <Compass className="text-green-500" />;
    default:
      return <Target className="text-blue-500" />;
  }
};

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [notification, setNotification] = useState<CompletionNotification>({
    show: false,
    xp: 0
  });

  const user = getUserInfo();
  const greeting = user?.firstName || user?.username || 'путешественник';

  const quotes = [
    "Каждый день - это новая возможность стать лучше",
    "Маленькие шаги ведут к большим достижениям",
    "Путь в тысячу ли начинается с первого шага"
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    loadTasks();
  }, [taskType]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchTasks(taskType);
      setTasks(response.tasks || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить задания');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    try {
      const updatedTask = await completeTask(taskId);
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
      showCompletionNotification(updatedTask.xp);
    } catch (err) {
      console.error(err);
      setError('Не удалось отметить задание как выполненное');
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--tg-theme-button-color)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        {notification.show && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-slide-in-top z-50">
            <CheckCircle size={20} />
            <span>+{notification.xp} XP получено!</span>
          </div>
        )}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {greeting}!</h1>
            <p className="text-lg opacity-90 italic">{randomQuote}</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 transform rotate-45 translate-x-32 -translate-y-32"></div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Target className="mr-2 text-blue-500" size={24} />
              Рекомендации на сегодня
            </h2>
            <span className="text-sm text-gray-500">
              Доступно +{totalAvailableXP} XP
            </span>
          </div>

          {!error && tasks.length > 0 && (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-300 ${
                    task.completed 
                      ? 'opacity-75 border-green-200 bg-green-50' 
                      : 'hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-gray-50">
                      {task.completed ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : getIconComponent(task.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-medium ${task.completed ? 'text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        </div>
                        <span className={`text-sm font-medium ${
                          task.completed ? 'text-green-500' : 'text-emerald-500'
                        }`}>
                          {task.completed ? 'Получено' : '+'}{task.xp} XP
                        </span>
                      </div>
                      {!task.completed && (
                        <button 
                          onClick={() => handleTaskCompletion(task.id)}
                          className="mt-3 w-full py-2 px-4 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
                        >
                          Выполнено
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8 rounded-xl bg-red-50">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {!error && tasks.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-[var(--tg-theme-secondary-bg-color)]">
              <Target size={48} className="mx-auto mb-4 text-[var(--tg-theme-hint-color)]" />
              <p className="text-[var(--tg-theme-hint-color)]">Нет доступных заданий</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

