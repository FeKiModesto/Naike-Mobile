import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { setAuthToken } from "../services/authToken";
import { LoginInput, LoginResponse, ApiError } from "../types";

const TOKEN_KEY = "naike_client_token";

interface AuthContextValue {
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (dados: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const salvo = await SecureStore.getItemAsync(TOKEN_KEY);
        if (salvo) {
          setToken(salvo);
          setAuthToken(salvo);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(dados: LoginInput) {
    try {
      const response = await api.post<LoginResponse>("/auth/login", dados);
      const { token: novoToken } = response.data;
      setToken(novoToken);
      setAuthToken(novoToken);
      await SecureStore.setItemAsync(TOKEN_KEY, novoToken);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async function logout() {
    setToken(null);
    setAuthToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn: !!token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>");
  }
  return ctx;
}
