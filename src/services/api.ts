import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'X-API-Key': process.env.API_KEY,
    'X-Student-RM': process.env.STUDENT_RM,
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.error?.message || 'Erro inesperado';
      const code = data?.error?.code || 'UNKNOWN_ERROR';
      return Promise.reject({ status, code, message, details: data?.error?.details });
    }
    if (error.request) {
      return Promise.reject({ status: 0, code: 'NETWORK_ERROR', message: 'Sem conexão com a rede' });
    }
    return Promise.reject({ status: 0, code: 'UNKNOWN', message: 'Erro desconhecido' });
  }
);

export default api;