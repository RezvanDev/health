import React, { useState } from 'react';
import { Plus, Filter, CheckCircle2, Circle, Star, Calendar, Clock } from 'lucide-react';
import { TaskModal } from './TaskModal';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  deadline?: string;
  xp: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Прочитать книгу по финансам',
    description: 'Изучить основы инвестирования',
    category: 'Финансы',
    completed: false,
    deadline: '2024-03-25',
    xp: 10,
    priority: 'high',
    createdAt: '2024-03-20'
  },
  {
    id: '2',
    title: 'Медитация',
    description: '15 минут практики осознанности',
    category: 'Осознанность',
    completed: true,
    xp: 10,
    priority: 'medium',
    createdAt: '2024-03-20'
  }
];

export function TaskList() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Заголовок и действия */}
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
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Модальное окно создания задачи */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
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
        <button className="mt-1">
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
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
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
                {task.deadline}
              </span>
            )}
            <span className="text-xs flex items-center text-gray-500">
              <Clock size={14} className="mr-1" />
              {task.createdAt}
            </span>
            <span className="text-xs text-emerald-500 ml-auto">+{task.xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;