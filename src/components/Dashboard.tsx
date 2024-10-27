import React, { useState, useEffect } from 'react';
import { Target, CheckCircle } from 'lucide-react';
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

        {/* Кнопки для переключения между ежедневными, еженедельными и ежемесячными заданиями */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Target className="mr-2 text-blue-500" size={24} />
              Задания
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTaskType('daily')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  taskType === 'daily'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ежедневные
              </button>
              <button
                onClick={() => setTaskType('weekly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  taskType === 'weekly'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Еженедельные
              </button>
              <button
                onClick={() => setTaskType('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  taskType === 'monthly'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ежемесячные
              </button>
            </div>
          </div>

          {/* Список задач */}
          <div className="space-y-3">
            {error ? (
              <div className="text-center py-8 rounded-xl bg-red-50">
                <p className="text-red-500">{error}</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-[var(--tg-theme-secondary-bg-color)]">
                <Target size={48} className="mx-auto mb-4 text-[var(--tg-theme-hint-color)]" />
                <p className="text-[var(--tg-theme-hint-color)]">Нет доступных заданий</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className={`p-4 rounded-xl bg-white shadow-sm border border-gray-100 transition-opacity ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {task.category}
            </span>
            <span className="text-xs text-emerald-500 ml-auto">+{task.xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
