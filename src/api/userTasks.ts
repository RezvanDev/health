import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Функция для получения данных аутентификации
const getTelegramAuthData = () => {
  const webApp = window.Telegram?.WebApp;
  if (!webApp?.initDataUnsafe?.user) {
    console.warn('No Telegram WebApp data available');
    return null;
  }

  // Собираем данные в том формате, который ожидает middleware
  const authData = {
    id: webApp.initDataUnsafe.user.id,
    hash: webApp.initDataUnsafe.hash, // хэш из initDataUnsafe
    first_name: webApp.initDataUnsafe.user.first_name,
    last_name: webApp.initDataUnsafe.user.last_name,
    username: webApp.initDataUnsafe.user.username
  };

  return JSON.stringify(authData);
};

// Добавляем перехватчик для аутентификации
api.interceptors.request.use(request => {
  const authData = getTelegramAuthData();
  
  if (authData) {
    request.headers['X-Telegram-Auth-Data'] = authData;
    console.log('Auth data sent:', authData);
  } else {
    console.warn('No auth data available');
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