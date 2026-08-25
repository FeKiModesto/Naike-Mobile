import axios from 'axios';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

const api = axios.create({
  baseURL: extra.apiBaseUrl ?? 'https://api.mockmerce.com.br/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': extra.apiKey,
    'X-Student-RM': extra.studentRm,
  },
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