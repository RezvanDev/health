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
    console.log('No Telegram WebApp data available');
    return null;
  }

  const user = window.Telegram.WebApp.initDataUnsafe.user;
  const hash = window.Telegram.WebApp.initData;
  
  // Добавляем логирование
  console.log('Telegram user data:', user);
  console.log('Telegram hash:', hash);
  
  return JSON.stringify({
    id: user.id,
    hash: hash,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username
  });
};

// Добавляем перехватчик для аутентификации
api.interceptors.request.use(request => {
  const authData = getTelegramAuthData();
  
  if (authData) {
    request.headers['X-Telegram-Auth-Data'] = authData;
    // Добавляем логирование
    console.log('Sending auth header:', request.headers['X-Telegram-Auth-Data']);
  } else {
    console.warn('No auth data available');
  }
  
  return request;
});

// Добавляем логирование ответов
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

// ... rest of the code (interfaces and API methods) stays the same