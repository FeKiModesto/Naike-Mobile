import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';
import { CANAL_ANDROID, prepararCanalAndroid } from '../lib/notificacao';
import { abrirProduto } from '../navigation/navegacao';
import { pushService } from '../services/pushService';

export type StatusNotificacoes = 'verificando' | 'indefinida' | 'concedida' | 'negada';

interface Estado {
  status: StatusNotificacoes;
  podePedirDeNovo: boolean;
}
interface Valor extends Estado {
  pedirPermissao: () => Promise<void>;
}

const Contexto = createContext<Valor | null>(null);
const CHAVE_VISTAS = 'naike:push:vistas';
const MAX_VISTAS = 200;
const MAX_POR_ABERTURA = 3;

async function lerVistas(): Promise<Set<string>> {
  try {
    return new Set(JSON.parse((await AsyncStorage.getItem(CHAVE_VISTAS)) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

async function gravarVistas(ids: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_VISTAS, JSON.stringify([...ids].slice(-MAX_VISTAS)));
  } catch {
  }
}

function classificar(permissao: Notifications.NotificationPermissionsStatus): Estado {
  if (permissao.granted) return { status: 'concedida', podePedirDeNovo: false };
  if (permissao.status === Notifications.PermissionStatus.UNDETERMINED) return { status: 'indefinida', podePedirDeNovo: true };
  return { status: 'negada', podePedirDeNovo: permissao.canAskAgain };
}

function abrirDaNotificacao(data: Record<string, unknown> | undefined): void {
  const id = data?.produtoId;
  if (typeof id === 'string' && id !== '') abrirProduto(id);
  else if (typeof id === 'number') abrirProduto(String(id));
}

export function NotificacoesProvider({ children }: { children: React.ReactNode }) {
  const { customer } = useAuth();
  const [estado, setEstado] = useState<Estado>({ status: 'verificando', podePedirDeNovo: true });
  const sincronizando = useRef(false);
  const repetir = useRef(false);
  const ultimoToque = useRef<string | null>(null);
  const clienteId = useRef<string | undefined>(undefined);
  clienteId.current = customer?.id;

  const apresentarNovas = useCallback(async () => {
    const mensagens = await pushService.listarEnviadas();
    const vistas = await lerVistas();
    const doCliente = (m: { customerId?: string }) => !m.customerId || m.customerId === clienteId.current;
    const apresentavel = (m: { status?: string; errorCode?: string }) => m.status !== 'FAILED' && m.errorCode !== 'NO_FAVORITE';
    const novas = mensagens.filter(m => !vistas.has(m.id) && apresentavel(m) && doCliente(m) && (m.title || m.body));
    for (const m of novas.slice(0, MAX_POR_ABERTURA).reverse()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: m.title ?? 'Naike', body: m.body ?? '', data: m.data },
        trigger: Platform.OS === 'android' ? { channelId: CANAL_ANDROID } : null,
      });
    }
    const semUso = mensagens.filter(m => !apresentavel(m) || !(m.title || m.body));
    await gravarVistas(new Set([...vistas, ...novas.map(m => m.id), ...semUso.map(m => m.id)]));
  }, []);

  const sincronizar = useCallback(async () => {
    if (sincronizando.current) {
      repetir.current = true;
      return;
    }
    sincronizando.current = true;
    try {
      const atual = classificar(await Notifications.getPermissionsAsync());
      setEstado(atual);
      if (atual.status === 'concedida') await apresentarNovas().catch(() => undefined);
    } catch {
      setEstado({ status: 'indefinida', podePedirDeNovo: true });
    } finally {
      sincronizando.current = false;
      if (repetir.current) {
        repetir.current = false;
        void sincronizar();
      }
    }
  }, [apresentarNovas]);

  const clienteDaSessao = customer?.id;
  useEffect(() => {
    if (clienteDaSessao) void sincronizar();
  }, [clienteDaSessao, sincronizar]);

  const pedirPermissao = useCallback(async () => {
    try {
      await prepararCanalAndroid();
      setEstado(classificar(await Notifications.requestPermissionsAsync()));
    } catch {
    }
    await sincronizar();
  }, [sincronizar]);

  useEffect(() => {
    void prepararCanalAndroid().catch(() => undefined).then(sincronizar);
    const assinatura = AppState.addEventListener('change', situacao => {
      if (situacao === 'active') void sincronizar();
    });
    return () => assinatura.remove();
  }, [sincronizar]);

  useEffect(() => {
    function tratar(resposta: Notifications.NotificationResponse) {
      const id = resposta.notification.request.identifier;
      if (ultimoToque.current === id) return;
      ultimoToque.current = id;
      abrirDaNotificacao(resposta.notification.request.content.data);
    }
    const assinatura = Notifications.addNotificationResponseReceivedListener(tratar);
    const inicial = Notifications.getLastNotificationResponse();
    if (inicial) tratar(inicial);
    return () => assinatura.remove();
  }, []);

  const valor = useMemo<Valor>(() => ({ ...estado, pedirPermissao }), [estado, pedirPermissao]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useNotificacoes(): Valor {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useNotificacoes precisa estar dentro de um NotificacoesProvider');
  return valor;
}
