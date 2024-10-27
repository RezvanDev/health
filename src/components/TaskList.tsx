import React, { useState, useEffect } from 'react';
import { Plus, Filter, CheckCircle2, Circle, Star, Calendar, Clock, Trash2, Loader2 } from 'lucide-react';
import { TaskModal } from './TaskModal';
import { getUserTasks, completeUserTask, deleteUserTask, UserTask } from '../api/userTasks';

export function TaskList() {
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await getUserTasks();
      setTasks(tasks);
      setError(null);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Не удалось загрузить задачи');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const updatedTask = await completeUserTask(taskId);
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
      // Можно добавить уведомление об успешном выполнении
    } catch (err) {
      console.error('Error completing task:', err);
      // Можно добавить уведомление об ошибке
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteUserTask(taskId);
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      // Можно добавить уведомление об успешном удалении
    } catch (err) {
      console.error('Error deleting task:', err);
      // Можно добавить уведомление об ошибке
    }
  };

  const handleTaskCreate = () => {
    setIsModalOpen(false);
    loadTasks(); // Перезагружаем список задач
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--tg-theme-text-color)]">Мои задачи</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[var(--tg-theme-button-color)] text-white rounded-xl flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          <span>Новая задача</span>
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex space-x-2 bg-[var(--tg-theme-secondary-bg-color)] p-1 rounded-xl sticky top-0 z-10">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-button-color)] shadow-sm' 
              : 'text-[var(--tg-theme-hint-color)]'
          }`}
        >
          Все задачи
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            filter === 'active' 
              ? 'bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-button-color)] shadow-sm' 
              : 'text-[var(--tg-theme-hint-color)]'
          }`}
        >
          Активные
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            filter === 'completed' 
              ? 'bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-button-color)] shadow-sm' 
              : 'text-[var(--tg-theme-hint-color)]'
          }`}
        >
          Завершённые
        </button>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="text-center py-4 text-red-500">
          {error}
        </div>
      )}

      {/* Пустое состояние */}
      {!error && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--tg-theme-secondary-bg-color)] flex items-center justify-center">
            <Filter className="text-[var(--tg-theme-hint-color)]" size={24} />
          </div>
          <p className="text-[var(--tg-theme-hint-color)]">
            {filter === 'all' && 'У вас пока нет задач'}
            {filter === 'active' && 'Нет активных задач'}
            {filter === 'completed' && 'Нет завершённых задач'}
          </p>
        </div>
      )}

      {/* Список задач */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleTaskComplete}
            onDelete={handleTaskDelete}
          />
        ))}
      </div>

      {/* Модальное окно создания задачи */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreate={handleTaskCreate}
      />
    </div>
  );
}

interface TaskCardProps {
  task: UserTask;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: 'text-gray-400',
    medium: 'text-yellow-500',
    high: 'text-red-500'
  };

  return (
    <div className={`p-4 rounded-xl bg-[var(--tg-theme-bg-color)] shadow-sm border border-[var(--tg-theme-secondary-bg-color)] transition-all ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-4">
        <button 
          onClick={() => !task.completed && onComplete(task.id)}
          className="mt-1"
        >
          {task.completed ? (
            <CheckCircle2 className="text-green-500" size={22} />
          ) : (
            <Circle className="text-[var(--tg-theme-hint-color)]" size={22} />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-medium ${
                task.completed 
                  ? 'line-through text-[var(--tg-theme-hint-color)]' 
                  : 'text-[var(--tg-theme-text-color)]'
              }`}>
                {task.title}
              </h3>
              <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1">
                {task.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Star className={priorityColors[task.priority]} size={18} />
              {!task.completed && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1 hover:bg-[var(--tg-theme-secondary-bg-color)] rounded-lg transition-colors"
                >
                  <Trash2 className="text-red-500" size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]">
              {task.category}
            </span>
            {task.deadline && (
              <span className="text-xs flex items-center text-[var(--tg-theme-hint-color)]">
                <Calendar size={14} className="mr-1" />
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
            <span className="text-xs flex items-center text-[var(--tg-theme-hint-color)]">
              <Clock size={14} className="mr-1" />
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs text-emerald-500 ml-auto">
              +{task.xp} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;