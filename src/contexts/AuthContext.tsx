import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import api from '../services/api';
import { setAuthToken } from '../services/authToken';

async function getStoredToken() {
  if (Platform.OS === 'web') return localStorage.getItem('naike_cliente_token');
  const SecureStore = await import('expo-secure-store');
  return SecureStore.getItemAsync('naike_cliente_token');
}
async function saveStoredToken(token: string) {
  if (Platform.OS === 'web') { localStorage.setItem('naike_cliente_token', token); return; }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.setItemAsync('naike_cliente_token', token);
}
async function removeStoredToken() {
  if (Platform.OS === 'web') { localStorage.removeItem('naike_cliente_token'); return; }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.deleteItemAsync('naike_cliente_token');
}

interface AuthContextData {
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStoredToken().then((saved) => {
      if (saved) { setToken(saved); setAuthToken(saved); }
    }).finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setAuthToken(data.token);
    await saveStoredToken(data.token);
  }

  async function logout() {
    setToken(null);
    setAuthToken(null);
    await removeStoredToken();
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }