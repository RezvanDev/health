import axios from 'axios';

// Создаем инстанс Axios с базовым URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // URL API из переменных окружения
  headers: {
    'Content-Type': 'application/json',   // Задаем заголовки для запросов
    'ngrok-skip-browser-warning': 'true', // Для работы через ngrok
  },
});

// Интерфейс для данных задачи
interface TaskData {
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  xp: number;
}

// Интерфейс для задачи (когда она уже существует в системе)
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  xp: number;
  createdAt: string;
}

// Функция для получения данных аутентификации из Telegram WebApp
const getTelegramInitData = (): string | null => {
  // Проверяем, что Telegram WebApp доступен
  if (window.Telegram?.WebApp) {
    const webAppData = {
      ...window.Telegram.WebApp.initDataUnsafe,
      hash: window.Telegram.WebApp.initData,
    };

    // Проверяем, есть ли данные пользователя
    if (webAppData.user) {
      // Возвращаем данные в виде строки JSON
      return JSON.stringify({
        id: webAppData.user.id,
        first_name: webAppData.user.first_name,
        last_name: webAppData.user.last_name,
        username: webAppData.user.username,
        hash: webAppData.hash,
      });
    }
  }
  return null; // Если данные недоступны, возвращаем null
};

// Перехватчик для добавления аутентификационных данных
api.interceptors.request.use((request) => {
  const initData = getTelegramInitData(); // Получаем данные Telegram WebApp
  if (initData) {
    request.headers['X-Telegram-Auth-Data'] = initData; // Добавляем их в заголовки запроса
  }
  return request; // Возвращаем запрос
});

// Получение задач пользователя
export const getUserTasks = async (): Promise<Task[]> => {
  const { data } = await api.get('/user-tasks'); // Запрос к API для получения задач
  return data.tasks; // Возвращаем список задач
};

// Создание новой задачи
export const createUserTask = async (taskData: TaskData): Promise<Task> => {
  const { data } = await api.post('/user-tasks', taskData); // Запрос на создание новой задачи
  return data;
};

// Завершение задачи по ID
export const completeUserTask = async (taskId: string): Promise<Task> => {
  const { data } = await api.post(`/user-tasks/${taskId}/complete`); // Запрос на завершение задачи
  return data; // Возвращаем обновленную задачу
};

// Удаление задачи по ID
export const deleteUserTask = async (taskId: string): Promise<void> => {
  await api.delete(`/user-tasks/${taskId}`); // Запрос на удаление задачи
};
