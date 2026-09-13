import api from './api';
import type { CadastroClienteInput, Customer, LoginInput, LoginResponse } from '../types';
export const authService = {
  login: async (input: LoginInput) => (await api.post<LoginResponse>('/auth/login', input)).data,
  register: async (input: CadastroClienteInput) => (await api.post<LoginResponse>('/auth/register', input)).data,
  me: async (signal?: AbortSignal) => (await api.get<Customer>('/auth/me', { signal })).data,
};
