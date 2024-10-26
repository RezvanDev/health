import React, { useState } from 'react';
import { Brain, Heart, Star, Target, Compass, CheckCircle } from 'lucide-react';

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

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      category: 'finance',
      title: 'Проанализировать расходы',
      description: 'Просмотрите траты за последнюю неделю',
      xp: 50,
      icon: <Star className="text-yellow-500" />,
      completed: false
    },
    {
      id: '2',
      category: 'relationships',
      title: 'Позвонить близким',
      description: 'Уделите время общению с семьей',
      xp: 30,
      icon: <Heart className="text-red-500" />,
      completed: false
    },
    {
      id: '3',
      category: 'mindfulness',
      title: 'Медитация',
      description: '15 минут осознанной практики',
      xp: 40,
      icon: <Brain className="text-purple-500" />,
      completed: false
    },
    {
      id: '4',
      category: 'meaning',
      title: 'Рефлексия дня',
      description: 'Запишите три главных вывода за день',
      xp: 35,
      icon: <Compass className="text-green-500" />,
      completed: false
    }
  ]);

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
          // Показываем уведомление
          showCompletionNotification(task.xp);
          // Обновляем задачу
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Уведомление о выполнении */}
      {notification.show && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-slide-in-top">
          <CheckCircle size={20} />
          <span>+{notification.xp} XP получено!</span>
        </div>
      )}

      {/* Приветствие и мотивация */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Добро пожаловать, Александр!
          </h1>
          <p className="text-lg opacity-90 italic">{randomQuote}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 transform rotate-45 translate-x-32 -translate-y-32"></div>
      </div>

      {/* Рекомендации на сегодня */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Target className="mr-2 text-blue-500" size={24} />
            Рекомендации на сегодня
          </h2>
          <span className="text-sm text-gray-500">
            Доступно +{totalAvailableXP} XP
          </span>
        </div>
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
                  ) : task.icon}
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
      </div>
    </div>
  );
}

export default Dashboard;