import React, { useState, useEffect } from 'react';
import { Brain, Heart, Star, Target, Compass, CheckCircle, Calendar, Clock } from 'lucide-react';
import api, { SystemTask } from '../api';

interface CompletionNotification {
  show: boolean;
  xp: number;
}

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [tasks, setTasks] = useState<SystemTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    loadTasks();
  }, [selectedPeriod]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.systemTasks.getAll(selectedPeriod);
      
      if (Array.isArray(response)) {
        setTasks(response);
      } else {
        console.error('Invalid response format:', response);
        setTasks([]);
        setError('Неверный формат данных с сервера');
      }
    } catch (error) {
      console.error('Error loading system tasks:', error);
      setTasks([]);
      setError('Ошибка загрузки рекомендаций');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    try {
      const completedTask = await api.systemTasks.complete(taskId);
      showCompletionNotification(completedTask.xp);
      await loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Ошибка при выполнении задачи');
    }
  };

  const showCompletionNotification = (xp: number) => {
    setNotification({ show: true, xp });
    setTimeout(() => {
      setNotification({ show: false, xp: 0 });
    }, 3000);
  };

  const getCategoryIcon = (category: string) => {
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

  const totalAvailableXP = tasks.filter(task => !task.completed).reduce((sum, task) => sum + (task.xp || 0), 0);

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily': return 'Ежедневные';
      case 'weekly': return 'Еженедельные';
      case 'monthly': return 'Ежемесячные';
      default: return '';
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'daily':
        return <Clock className="mr-2" size={18} />;
      case 'weekly':
        return <Calendar className="mr-2" size={18} />;
      case 'monthly':
        return <Target className="mr-2" size={18} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {notification.show && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-slide-in-top">
          <CheckCircle size={20} />
          <span>+{notification.xp} XP получено!</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg">
          {error}
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Добро пожаловать, Александр!
          </h1>
          <p className="text-lg opacity-90 italic">{randomQuote}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 transform rotate-45 translate-x-32 -translate-y-32"></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Target className="mr-2 text-blue-500" size={24} />
            Рекомендации
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Доступно +{totalAvailableXP} XP
            </span>
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as 'daily' | 'weekly' | 'monthly')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getPeriodIcon(period)}
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>

        {!Array.isArray(tasks) || tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Нет активных задач</h3>
            <p className="text-sm">На этот период пока нет рекомендаций</p>
          </div>
        ) : (
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
                    ) : getCategoryIcon(task.category)}
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
      </div>
    </div>
  );
}

export default Dashboard;
