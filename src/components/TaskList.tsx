import React, { useState, useEffect } from 'react';
import { Plus, Filter, CheckCircle2, Circle, Star, Calendar, Clock } from 'lucide-react';
import { TaskModal } from './TaskModal';
import api, { Task } from '../api';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await api.tasks.getAll();

      // Добавляем проверку, чтобы убедиться, что data - это массив
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]); // Устанавливаем tasks как пустой массив в случае ошибки
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await api.tasks.complete(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTaskCreate = async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    try {
      await api.tasks.create(taskData);
      await loadTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await api.tasks.delete(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Проверка, является ли tasks массивом перед вызовом filter
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
      })
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои задачи</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          <span>Новая задача</span>
        </button>
      </div>

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

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Задачи не найдены</h3>
          <p className="text-sm">
            {filter === 'completed'
              ? 'У вас пока нет завершённых задач'
              : filter === 'active'
              ? 'У вас пока нет активных задач'
              : 'Создайте свою первую задачу'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
              onDelete={handleTaskDelete}
            />
          ))}
        </div>
      )}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleTaskCreate} />
    </div>
  );
}

function TaskCard({
  task,
  onComplete,
  onDelete
}: {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const priorityColors = {
    low: 'text-gray-400',
    medium: 'text-yellow-500',
    high: 'text-red-500'
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl bg-white shadow-sm border border-gray-100 transition-opacity ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <button className="mt-1" onClick={() => !task.completed && onComplete(task.id)}>
          {task.completed ? (
            <CheckCircle2 className="text-green-500" size={22} />
          ) : (
            <Circle className="text-gray-400 hover:text-blue-500 transition-colors" size={22} />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            </div>
            <Star className={priorityColors[task.priority]} size={18} />
          </div>

          <div className="flex items-center space-x-3 mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{task.category}</span>
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

          {!task.completed && (
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={() => onComplete(task.id)}
                className="flex-1 py-2 px-4 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
              >
                Выполнить
              </button>
              <button
                onClick={handleDeleteClick}
                className="py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
