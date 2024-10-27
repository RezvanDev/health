import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Получение реальных данных Telegram WebApp
const getTelegramInitData = () => {
  if (window.Telegram?.WebApp) {
    const webAppData = {
      ...window.Telegram.WebApp.initDataUnsafe,
      hash: window.Telegram.WebApp.initData
    };
    
    // Проверяем, что у нас есть данные пользователя
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

// Добавляем перехватчик для добавления auth data
api.interceptors.request.use(request => {
  const initData = getTelegramInitData();
  if (initData) {
    request.headers['X-Telegram-Auth-Data'] = initData;
  } else {
    console.warn('Telegram WebApp data not available');
  }
  
  console.log('Sending request:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const fetchTasks = async (type: 'daily' | 'weekly' | 'monthly') => {
  const { data } = await api.get(`/tasks?type=${type}`);
  return data;
};

export const completeTask = async (taskId: string) => {
  const { data } = await api.post(`/tasks/${taskId}/complete`);
  return data;
};