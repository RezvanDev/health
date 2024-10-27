import React, { useState, useEffect } from 'react';
import { Plus, Star, Calendar, Clock, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { TaskModal } from './TaskModal';
import { userTasksApi, UserTask } from '../api/api';

export function TaskList() {
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка задач
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const userTasks = await userTasksApi.getTasks();
      setTasks(userTasks);
    } catch (err) {
      setError('Не удалось загрузить задачи');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Обработка создания новой задачи
  const handleTaskCreated = async () => {
    await loadTasks();
  };

  // Обработка выполнения задачи
  const handleTaskCompletion = async (taskId: string) => {
    try {
      await userTasksApi.completeTask(taskId);
      await loadTasks();
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Не удалось отметить задачу как выполненную');
    }
  };

  // Обработка удаления задачи
  const handleTaskDeletion = async (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await userTasksApi.deleteTask(taskId);
        await loadTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Не удалось удалить задачу');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-500">Загрузка задач...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Мои задачи</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length} {tasks.length === 1 ? 'задача' : 'задач'} всего
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          <span>Новая задача</span>
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Все задачи
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            filter === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Активные
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            filter === 'completed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Завершённые
        </button>
      </div>

      {/* Список задач */}
      <div className="space-y-3">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}
        
        {!error && filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-500 font-medium">Нет задач</h3>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'all' && 'Создайте свою первую задачу'}
              {filter === 'active' && 'Нет активных задач'}
              {filter === 'completed' && 'Нет завершённых задач'}
            </p>
          </div>
        )}

        {filteredTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onComplete={handleTaskCompletion}
            onDelete={handleTaskDeletion}
          />
        ))}
      </div>

      {/* Модальное окно создания задачи */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}

interface TaskCardProps {
  task: UserTask;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: 'text-gray-400',
    medium: 'text-yellow-500',
    high: 'text-red-500'
  };

  return (
    <div className={`p-4 rounded-xl bg-white shadow-sm border border-gray-100 transition-opacity ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-4">
        <button 
          className="mt-1"
          onClick={() => !task.completed && onComplete(task.id)}
        >
          {task.completed ? (
            <CheckCircle2 className="text-green-500" size={22} />
          ) : (
            <Circle className="text-gray-400" size={22} />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              )}
            </div>
            <Star className={priorityColors[task.priority]} size={18} />
          </div>

          <div className="flex items-center space-x-3 mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {task.category}
            </span>
            {task.deadline && (
              <span className="text-xs flex items-center text-gray-500">
                <Calendar size={14} className="mr-1" />
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
            <span className="text-xs flex items-center text-gray-500">
              <Clock size={14} className="mr-1" />
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs text-emerald-500 ml-auto">+{task.xp} XP</span>
          </div>

          {/* Кнопка удаления */}
          {!task.completed && (
            <button
              onClick={() => onDelete(task.id)}
              className="mt-2 text-xs text-red-500 hover:text-red-600"
            >
              Удалить задачу
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;