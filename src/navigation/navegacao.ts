import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Navegação fora de componente: o toque na notificação chega por um listener do sistema, não por uma tela.
 * Com o app FECHADO, o listener dispara antes de o navegador existir e navegar nesse instante não faz nada.
 * Por isso o destino fica guardado e é consumido no `onReady` do NavigationContainer (RF-59).
 */
export const navegacaoRef = createNavigationContainerRef<RootStackParamList>();

let produtoPendente: string | null = null;

export function abrirProduto(id: string): void {
  if (!navegacaoRef.isReady()) {
    produtoPendente = id;
    return;
  }
  navegacaoRef.navigate('Detalhe', { id });
}

export function consumirNavegacaoPendente(): void {
  if (!produtoPendente) return;
  const id = produtoPendente;
  produtoPendente = null;
  navegacaoRef.navigate('Detalhe', { id });
}