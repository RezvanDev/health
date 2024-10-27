import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Добавляем перехватчик для аутентификации
api.interceptors.request.use(request => {
  if (window.Telegram?.WebApp?.initData) {
    request.headers['X-Telegram-Auth-Data'] = window.Telegram.WebApp.initData;
  }
  return request;
});

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

// Получение списка задач пользователя
export const getUserTasks = async () => {
  const { data } = await api.get<{ tasks: UserTask[] }>('/user-tasks');
  return data.tasks;
};

// Создание новой задачи
export const createUserTask = async (taskData: Omit<UserTask, 'id' | 'completed' | 'createdAt'>) => {
  const { data } = await api.post<UserTask>('/user-tasks', taskData);
  return data;
};

// Обновление статуса задачи
export const completeUserTask = async (taskId: string) => {
  const { data } = await api.post<UserTask>(`/user-tasks/${taskId}/complete`);
  return data;
};

// Удаление задачи
export const deleteUserTask = async (taskId: string) => {
  await api.delete(`/user-tasks/${taskId}`);
};