import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Добавляем перехватчик для логирования
api.interceptors.request.use(request => {
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