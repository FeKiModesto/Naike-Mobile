import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { subscribeUnauthorized } from '../services/api';
import { getAuthToken, setAuthToken } from '../services/authToken';
import { readSession, saveSession, deleteSession } from '../services/sessionStorage';
import { clearFavoritesCache, restoreFavorites, watchFavorites } from '../lib/favoritesCache';
import { queryClient } from '../lib/queryClient';
import { errorMessage, isOfflineError } from '../utils/errors';
import type { Customer, LoginResponse } from '../types';
interface AuthContextData {
  customer: Customer | null; isLoggedIn: boolean; isLoading: boolean; offline: boolean;
  sessionError: string | null; acceptSession: (value: LoginResponse) => Promise<void>;
  logout: () => Promise<void>; retrySession: () => void;
}
const AuthContext = createContext<AuthContextData | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<LoginResponse | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [reading, setReading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [offline, setOffline] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const generation = useRef(0);
  const clearing = useRef<Promise<void> | null>(null);
  const logout = useCallback(async () => {
    if (clearing.current) return clearing.current;
    generation.current++;
    setAuthToken(null); setCustomer(null); setSaved(null); setOffline(false); setValidating(false);
    clearing.current = (async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      const results = await Promise.allSettled([deleteSession(), clearFavoritesCache()]);
      if (results.some(r => r.status === 'rejected')) setSessionError('Você saiu, mas houve uma falha ao apagar dados locais. Tente sair novamente antes de fechar.');
    })().finally(() => { clearing.current = null; });
    return clearing.current;
  }, []);
  useEffect(() => subscribeUnauthorized(async () => {
    await logout(); setSessionError('Sua sessão expirou. Entre novamente para continuar.');
  }), [logout]);
  useEffect(() => {
    let active = true;
    void readSession().then(value => {
      if (!active) return;
      if (value) { setAuthToken(value.token); setSaved(value); setValidating(true); }
    }).catch(() => { if (active) setSessionError('Não foi possível restaurar sua sessão. Entre novamente.'); })
      .finally(() => { if (active) setReading(false); });
    return () => { active = false; };
  }, []);
  const me = useQuery({
    queryKey: ['session', generation.current], queryFn: ({ signal }) => authService.me(signal),
    enabled: !reading && validating && !!saved, staleTime: 0, retry: false,
  });
  useEffect(() => {
    if (!validating || !saved || (!me.data && !me.error)) return;
    const epoch = generation.current;
    if (me.data) {
      const value = { token: saved.token, customer: me.data };
      void (async () => {
        try {
          await saveSession(value);
          await restoreFavorites(value.customer.id);
          if (generation.current !== epoch || getAuthToken() !== value.token) return;
          watchFavorites(value.customer.id); setCustomer(value.customer); setOffline(false);
        } catch (error) { setSessionError(errorMessage(error)); }
        finally { if (generation.current === epoch) setValidating(false); }
      })();
    } else if (isOfflineError(me.error) && saved.customer.id) {
      void restoreFavorites(saved.customer.id).catch(() => undefined).then(() => {
        if (generation.current !== epoch) return;
        watchFavorites(saved.customer.id); setCustomer(saved.customer); setOffline(true); setValidating(false);
      });
    } else {
      setSessionError(errorMessage(me.error)); setValidating(false);
    }
  }, [validating, saved, me.data, me.error]);
  async function acceptSession(value: LoginResponse) {
    await clearing.current;
    await saveSession(value);
    await queryClient.cancelQueries(); queryClient.clear();
    await clearFavoritesCache();
    generation.current++;
    setAuthToken(value.token); setSaved(value); setCustomer(value.customer); setOffline(false);
    setSessionError(null); setValidating(false); watchFavorites(value.customer.id);
  }
  return <AuthContext.Provider value={{ customer, isLoggedIn: !!customer, isLoading: reading || validating,
    offline, sessionError, acceptSession, logout, retrySession: () => { setValidating(!!saved); void me.refetch(); } }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider não encontrado.');
  return value;
}
