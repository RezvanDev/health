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
    "Каждое достижение начинается с решения попробовать",
    "Маленький прогресс каждый день ведет к большим результатам",
    "Действуй сейчас, создавай свое будущее"
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

  const totalAvailableXP = tasks && tasks.length > 0
    ? tasks.filter(task => !task.completed).reduce((sum, task) => sum + task.xp, 0)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--tg-theme-button-color)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] overflow-hidden">
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        {notification.show && (
          <div className="fixed top-4 right-4 bg-[var(--tg-theme-button-color)] text-white px-4 py-3 rounded-2xl shadow-lg flex items-center space-x-2 animate-slide-in-top z-50">
            <Trophy className="text-yellow-300" size={20} />
            <span>+{notification.xp} XP получено!</span>
          </div>
        )}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--tg-theme-button-color)] to-[var(--tg-theme-secondary-bg-color)] p-6">
          <div className="relative z-10">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-yellow-300" size={24} />
              <h1 className="text-2xl font-bold text-white">
                Приветствую, {greeting}!
              </h1>
            </div>
            <p className="mt-2 text-lg opacity-90 italic text-white font-light">
              {randomQuote}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 pb-2">
          {(['daily', 'weekly', 'monthly'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTaskType(type)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 w-full ${
                taskType === type 
                  ? 'bg-[var(--tg-theme-button-color)] text-white' 
                  : 'bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-hint-color)] hover:bg-opacity-80'
              }`}
            >
              {type === 'daily' && 'Ежедневные'}
              {type === 'weekly' && 'Еженедельные'}
              {type === 'monthly' && 'Ежемесячные'}
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Target className="mr-2 text-[var(--tg-theme-button-color)]" size={24} />
              {taskType === 'daily' && 'Задания на сегодня'}
              {taskType === 'weekly' && 'Задания на неделю'}
              {taskType === 'monthly' && 'Задания на месяц'}
            </h2>
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[var(--tg-theme-secondary-bg-color)]">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-sm font-medium">
                +{totalAvailableXP} XP
              </span>
            </div>
          </div>

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

          {!error && tasks.length > 0 && (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    task.completed 
                      ? 'bg-[var(--tg-theme-secondary-bg-color)] opacity-50' 
                      : 'bg-[var(--tg-theme-secondary-bg-color)]'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      task.completed 
                        ? 'bg-green-100' 
                        : 'bg-[var(--tg-theme-secondary-bg-color)]'
                    }`}>
                      {task.completed ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : getIconComponent(task.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-medium ${
                            task.completed 
                              ? 'text-[var(--tg-theme-hint-color)]' 
                              : ''
                          }`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1">
                            {task.description}
                          </p>
                        </div>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          task.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-button-color)]'
                        }`}>
                          {task.completed ? 'Получено' : '+'}{task.xp} XP
                        </span>
                      </div>
                      {!task.completed && (
                        <button 
                          onClick={() => handleTaskCompletion(task.id)}
                          className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[var(--tg-theme-button-color)] text-white font-medium hover:opacity-90 transition-opacity"
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
