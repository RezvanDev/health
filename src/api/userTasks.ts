import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Функция для получения данных Telegram
const getTelegramAuthData = () => {
  if (!window.Telegram?.WebApp?.initDataUnsafe?.user) {
    console.warn('No Telegram WebApp data available');
    return null;
  }

  const user = window.Telegram.WebApp.initDataUnsafe.user;
  const initData = window.Telegram.WebApp.initData;

  return JSON.stringify({
    id: user.id,
    hash: initData,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username
  });
};

// Перехватчик для запросов
api.interceptors.request.use(request => {
  const authData = getTelegramAuthData();
  if (authData) {
    request.headers['X-Telegram-Auth-Data'] = authData;
  }
  return request;
});

// Перехватчик для ответов
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      details: error.response?.data
    });
    return Promise.reject(error);
  }
);

export interface UserTask {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  deadline?: string;
  xp: number;
  priority: 'low' | 'medium' | 'high';
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

interface CreateTaskData extends Omit<UserTask, 'id' | 'completed' | 'createdAt'> {}

// API функции
const userTasksApi = {
  // Получение списка задач пользователя
  getUserTasks: async () => {
    const { data } = await api.get<{ tasks: UserTask[] }>('/user-tasks');
    return data.tasks;
  },

  // Создание новой задачи
  createUserTask: async (taskData: CreateTaskData) => {
    const { data } = await api.post<UserTask>('/user-tasks', taskData);
    return data;
  },

  // Обновление статуса задачи
  completeUserTask: async (taskId: string) => {
    const { data } = await api.post<UserTask>(`/user-tasks/${taskId}/complete`);
    return data;
  },

  // Удаление задачи
  deleteUserTask: async (taskId: string) => {
    await api.delete(`/user-tasks/${taskId}`);
  }
};

export const {
  getUserTasks,
  createUserTask,
  completeUserTask,
  deleteUserTask
} = userTasksApi;

export default userTasksApi;