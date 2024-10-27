import React, { useState } from 'react';
import { X, Star, Heart, Brain, Gamepad, Compass, AlertCircle, Loader2 } from 'lucide-react';
import { userTasksApi, CreateUserTaskDTO, TaskCategory } from '../api/api';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const categories: { id: TaskCategory; name: string; icon: React.ReactNode }[] = [
  { id: 'finance', name: 'Финансы', icon: <Star className="text-yellow-500" /> },
  { id: 'relationships', name: 'Отношения', icon: <Heart className="text-red-500" /> },
  { id: 'mindfulness', name: 'Осознанность', icon: <Brain className="text-purple-500" /> },
  { id: 'entertainment', name: 'Развлечения', icon: <Gamepad className="text-blue-500" /> },
  { id: 'meaning', name: 'Смысл жизни', icon: <Compass className="text-green-500" /> }
];

const initialTaskData: CreateUserTaskDTO = {
  title: '',
  description: '',
  category: 'finance',
  priority: 'medium',
  repeat: 'none',
  deadline: ''
};

export function TaskModal({ isOpen, onClose, onTaskCreated }: TaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<CreateUserTaskDTO>(initialTaskData);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userTasksApi.createTask(taskData);
      onTaskCreated();
      setTaskData(initialTaskData);
      onClose();
    } catch (err) {
      setError('Не удалось создать задачу. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="bg-white rounded-xl w-full max-w-sm mx-auto relative overflow-y-auto max-h-[90vh] md:max-h-[80vh]">
        {/* Шапка */}
        <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Новая задача</h2>
            <p className="text-xs text-gray-500">+10 XP за выполнение</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Например: Прочитать книгу"
              required
              disabled={loading}
            />
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Описание
  </label>
  <textarea
    value={taskData.description}
    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
    rows={3}
    placeholder="Опишите подробности задачи..."
    disabled={loading}
    style={{ minHeight: '80px', maxHeight: '80px' }}
  />
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setTaskData({ ...taskData, category: category.id })}
                  disabled={loading}
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
                Приоритет
              </label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={loading}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Повторение
              </label>
              <select
                value={taskData.repeat}
                onChange={(e) => setTaskData({ ...taskData, repeat: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={loading}
              >
                <option value="none">Нет</option>
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Срок выполнения
            </label>
            <input
              type="date"
              value={taskData.deadline}
              onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-xs text-blue-600">
              <AlertCircle size={16} className="mr-1" />
              +10 XP за выполнение
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Создание...
                  </>
                ) : (
                  'Создать'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;