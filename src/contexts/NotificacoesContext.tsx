import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';
import { CANAL_ANDROID, prepararCanalAndroid } from '../lib/notificacao';
import { abrirProduto } from '../navigation/navegacao';
import { pushService } from '../services/pushService';

/**
 * Três desfechos da permissão: ainda não decidida, concedida, negada (RF-56).
 * Nos três o app funciona inteiro; só o aviso de novidades depende da permissão (RF-60).
 */
export type StatusNotificacoes = 'verificando' | 'indefinida' | 'concedida' | 'negada';

interface Estado {
  status: StatusNotificacoes;
  /** Negada, mas o sistema ainda aceita perguntar. Falso = só pelos ajustes do aparelho. */
  podePedirDeNovo: boolean;
}
interface Valor extends Estado {
  /** Mostra o diálogo do sistema. Chame só depois de explicar o ganho (ex.: ao favoritar). */
  pedirPermissao: () => Promise<void>;
}

const Contexto = createContext<Valor | null>(null);
const CHAVE_VISTAS = 'naike:push:vistas';
const MAX_VISTAS = 200;
/** Teto por abertura: o histórico antigo da loja não vira uma enxurrada de avisos. */
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
    // Sem armazenamento, um aviso pode se repetir. Nada quebra.
  }
}

function classificar(permissao: Notifications.NotificationPermissionsStatus): Estado {
  if (permissao.granted) return { status: 'concedida', podePedirDeNovo: false };
  if (permissao.status === Notifications.PermissionStatus.UNDETERMINED) return { status: 'indefinida', podePedirDeNovo: true };
  return { status: 'negada', podePedirDeNovo: permissao.canAskAgain };
}

/** RF-58/59: o texto é para a pessoa, o `data` é para o app. O toque abre o produto de data.produtoId. */
function abrirDaNotificacao(data: Record<string, unknown> | undefined): void {
  const id = data?.produtoId;
  if (typeof id === 'string' && id !== '') abrirProduto(id);
  else if (typeof id === 'number') abrirProduto(String(id));
}

export function NotificacoesProvider({ children }: { children: React.ReactNode }) {
  const { customer } = useAuth();
  const [estado, setEstado] = useState<Estado>({ status: 'verificando', podePedirDeNovo: true });
  const sincronizando = useRef(false);
  const ultimoToque = useRef<string | null>(null);
  const clienteId = useRef<string | undefined>(undefined);
  clienteId.current = customer?.id;

  /** Caminho B (RF-57): busca o histórico da loja e apresenta, como notificação local, o que ainda não foi visto. */
  const apresentarNovas = useCallback(async () => {
    const mensagens = await pushService.listarEnviadas();
    const vistas = await lerVistas();
    const doCliente = (m: { customerId?: string }) => !m.customerId || m.customerId === clienteId.current;
    const novas = mensagens.filter(m => !vistas.has(m.id) && doCliente(m) && (m.title || m.body));
    // Do mais antigo para o mais novo, para o mais recente ficar por cima.
    for (const m of novas.slice(0, MAX_POR_ABERTURA).reverse()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: m.title ?? 'Naike', body: m.body ?? '', data: m.data },
        trigger: Platform.OS === 'android' ? { channelId: CANAL_ANDROID } : null,
      });
    }
    await gravarVistas(new Set([...vistas, ...mensagens.map(m => m.id)]));
  }, []);

  /** Lê a permissão sem incomodar e, se concedida, apresenta as novidades. */
  const sincronizar = useCallback(async () => {
    if (sincronizando.current) return;
    sincronizando.current = true;
    try {
      const atual = classificar(await Notifications.getPermissionsAsync());
      setEstado(atual);
      if (atual.status === 'concedida') await apresentarNovas().catch(() => undefined);
    } catch {
      setEstado({ status: 'indefinida', podePedirDeNovo: true });
    } finally {
      sincronizando.current = false;
    }
  }, [apresentarNovas]);

  const pedirPermissao = useCallback(async () => {
    try {
      // No Android 13+ o canal precisa existir antes do diálogo de permissão.
      await prepararCanalAndroid();
      setEstado(classificar(await Notifications.requestPermissionsAsync()));
    } catch {
      // Se o pedido falhar, o app segue sem avisos.
    }
    await sincronizar();
  }, [sincronizar]);

  // Na abertura o app só LÊ a permissão. Pedir aqui seria antes de a pessoa saber o que ganha.
  useEffect(() => {
    void prepararCanalAndroid().catch(() => undefined).then(sincronizar);
    // Voltar dos ajustes do aparelho (ligou ou desligou) atualiza o estado sem reiniciar o app.
    const assinatura = AppState.addEventListener('change', situacao => {
      if (situacao === 'active') void sincronizar();
    });
    return () => assinatura.remove();
  }, [sincronizar]);

  // Toque na notificação, com o app aberto, em segundo plano ou fechado.
  useEffect(() => {
    function tratar(resposta: Notifications.NotificationResponse) {
      const id = resposta.notification.request.identifier;
      if (ultimoToque.current === id) return; // o mesmo toque pode chegar pelos dois caminhos
      ultimoToque.current = id;
      abrirDaNotificacao(resposta.notification.request.content.data);
    }
    const assinatura = Notifications.addNotificationResponseReceivedListener(tratar);
    // App fechado: o toque que o abriu aconteceu antes de o listener existir.
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
