import React, { useState } from 'react';
import { X, Star, Heart, Brain, Gamepad, Compass, AlertCircle } from 'lucide-react';
import { Task } from '../api';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

export function TaskModal({ isOpen, onClose, onSubmit }: TaskModalProps) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    category: 'finance',
    priority: 'medium' as const,
    deadline: '',
    period: 'daily' as const,
    xp: 10
  });

  const categories = [
    { id: 'finance', name: 'Финансы', icon: <Star className="text-yellow-500" /> },
    { id: 'relationships', name: 'Отношения', icon: <Heart className="text-red-500" /> },
    { id: 'mindfulness', name: 'Осознанность', icon: <Brain className="text-purple-500" /> },
    { id: 'entertainment', name: 'Развлечения', icon: <Gamepad className="text-blue-500" /> },
    { id: 'meaning', name: 'Смысл жизни', icon: <Compass className="text-green-500" /> }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskData.title || !taskData.category || !taskData.period || !taskData.xp) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Убедимся, что deadline в нужном формате
    const formattedTaskData = {
      ...taskData,
      deadline: taskData.deadline || null, // Если пусто, установим null
    };

    onSubmit(formattedTaskData);
    setTaskData({
      title: '',
      description: '',
      category: 'finance',
      priority: 'medium',
      deadline: '',
      period: 'daily',
      xp: 10
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="bg-white rounded-xl w-full max-w-sm mx-auto relative overflow-y-auto max-h-[90vh] md:max-h-[80vh]">
        <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Новая задача</h2>
            <p className="text-xs text-gray-500">+{taskData.xp} XP за выполнение</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Например: Прочитать книгу"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              rows={2}
              placeholder="Опишите подробности задачи..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setTaskData({ ...taskData, category: category.id })}
                  className={`p-2 rounded-lg border ${
                    taskData.category === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  } transition-colors flex flex-col items-center gap-1`}
                >
                  {category.icon}
                  <span className="text-xs font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Приоритет <span className="text-red-500">*</span>
              </label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as Task['priority'] })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Период <span className="text-red-500">*</span>
              </label>
              <select
                value={taskData.period}
                onChange={(e) => setTaskData({ ...taskData, period: e.target.value as Task['period'] })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Срок выполнения (необязательно)
            </label>
            <input
              type="date"
              value={taskData.deadline}
              onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-xs text-blue-600">
              <AlertCircle size={16} className="mr-1" />
              +{taskData.xp} XP за выполнение
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Создать
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
