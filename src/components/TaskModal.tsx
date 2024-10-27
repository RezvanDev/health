import React, { useState } from 'react';
import { X, Star, Heart, Brain, Gamepad, Compass, AlertCircle, Loader2 } from 'lucide-react';
import { createUserTask } from '../api/userTasks';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreate?: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  xp: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function TaskModal({ isOpen, onClose, onTaskCreate }: TaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: 'finance',
    priority: 'medium',
    deadline: '',
    repeat: 'none',
    xp: 10
  });

  const categories: Category[] = [
    { id: 'finance', name: 'Финансы', icon: <Star className="text-yellow-500" /> },
    { id: 'relationships', name: 'Отношения', icon: <Heart className="text-red-500" /> },
    { id: 'mindfulness', name: 'Осознанность', icon: <Brain className="text-purple-500" /> },
    { id: 'entertainment', name: 'Развлечения', icon: <Gamepad className="text-blue-500" /> },
    { id: 'meaning', name: 'Смысл жизни', icon: <Compass className="text-green-500" /> }
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserTask(taskData);
      onTaskCreate?.();
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      // Можно добавить уведомление об ошибке
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | number) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="bg-[var(--tg-theme-bg-color)] rounded-xl w-full max-w-sm mx-auto relative overflow-y-auto max-h-[90vh] md:max-h-[80vh]">
        {/* Шапка */}
        <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] px-4 py-3 border-b border-[var(--tg-theme-secondary-bg-color)] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--tg-theme-text-color)]">
              Новая задача
            </h2>
            <p className="text-xs text-[var(--tg-theme-hint-color)]">
              +{taskData.xp} XP за выполнение
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--tg-theme-secondary-bg-color)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--tg-theme-hint-color)]" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1">
              Название
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full rounded-lg border border-[var(--tg-theme-secondary-bg-color)] bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color)] transition-shadow"
              placeholder="Например: Прочитать книгу"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1">
              Описание
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full rounded-lg border border-[var(--tg-theme-secondary-bg-color)] bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color)] transition-shadow"
              rows={2}
              placeholder="Опишите подробности задачи..."
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1">
              Категория
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleInputChange('category', category.id)}
                  className={`p-2 rounded-lg border ${
                    taskData.category === category.id
                      ? 'border-[var(--tg-theme-button-color)] bg-[var(--tg-theme-secondary-bg-color)]'
                      : 'border-[var(--tg-theme-secondary-bg-color)] hover:border-[var(--tg-theme-button-color)]'
                  } transition-colors flex flex-col items-center gap-1`}
                >
                  {category.icon}
                  <span className="text-xs font-medium text-[var(--tg-theme-text-color)]">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1">
                Приоритет
              </label>
              <select
                value={taskData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full rounded-lg border border-[var(--tg-theme-secondary-bg-color)] bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color)]"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1">
                Повторение
              </label>
              <select
                value={taskData.repeat}
                onChange={(e) => handleInputChange('repeat', e.target.value)}
                className="w-full rounded-lg border border-[var(--tg-theme-secondary-bg-color)] bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color)]"
              >
                <option value="none">Нет</option>
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1">
              Срок выполнения
            </label>
            <input
              type="date"
              value={taskData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="w-full rounded-lg border border-[var(--tg-theme-secondary-bg-color)] bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color)]"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1">
              XP за выполнение
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={taskData.xp}
              onChange={(e) => handleInputChange('xp', parseInt(e.target.value))}
              className="w-full h-2 bg-[var(--tg-theme-secondary-bg-color)] rounded-lg appearance-none cursor-pointer accent-[var(--tg-theme-button-color)]"
            />
            <div className="flex justify-between text-xs text-[var(--tg-theme-hint-color)] mt-1">
              <span>10 XP</span>
              <span>{taskData.xp} XP</span>
              <span>100 XP</span>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-xs text-[var(--tg-theme-button-color)]">
              <AlertCircle size={16} className="mr-1" />
              +{taskData.xp} XP за выполнение
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-[var(--tg-theme-hint-color)] hover:bg-[var(--tg-theme-secondary-bg-color)] rounded-lg transition-colors"
                disabled={loading}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-[var(--tg-theme-button-color)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
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