import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Типы для пользовательских задач
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskCategory = 'finance' | 'relationships' | 'mindfulness' | 'entertainment' | 'meaning';

export interface UserTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  repeat: TaskRepeat;
  deadline?: string;
  xp: number;
  completed: boolean;
  createdAt: string;
}

export interface CreateUserTaskDTO {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  repeat: TaskRepeat;
  deadline?: string;
}

// Получение Telegram данных для аутентификации
const getTelegramAuthData = () => {
  if (window.Telegram?.WebApp) {
    const webAppData = {
      ...window.Telegram.WebApp.initDataUnsafe,
      hash: window.Telegram.WebApp.initData
    };
    
    if (webAppData.user) {
      return JSON.stringify({
        id: webAppData.user.id,
        first_name: webAppData.user.first_name,
        last_name: webAppData.user.last_name,
        username: webAppData.user.username,
        hash: webAppData.hash
      });
    }
  }
  return null;
};

// Добавляем перехватчик для авторизации
api.interceptors.request.use(request => {
  const authData = getTelegramAuthData();
  if (authData) {
    request.headers['X-Telegram-Auth-Data'] = authData;
  } else {
    console.warn('Telegram WebApp data not available');
  }
  return request;
});

// API методы для работы с пользовательскими задачами
export const userTasksApi = {
  // Получение списка задач
  async getTasks(): Promise<UserTask[]> {
    try {
      const { data } = await api.get('/user-tasks');
      return data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  // Создание новой задачи
  async createTask(taskData: CreateUserTaskDTO): Promise<UserTask> {
    try {
      const { data } = await api.post('/user-tasks', taskData);
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  // Отметка о выполнении задачи
  async completeTask(taskId: string): Promise<{ xpEarned: number; totalXP: number }> {
    try {
      const { data } = await api.post(`/user-tasks/${taskId}/complete`);
      return data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw new Error('Failed to complete task');
    }
  },

  // Удаление задачи
  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/user-tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },

  // Обновление задачи
  async updateTask(taskId: string, taskData: Partial<CreateUserTaskDTO>): Promise<UserTask> {
    try {
      const { data } = await api.patch(`/user-tasks/${taskId}`, taskData);
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }
};

export default api;