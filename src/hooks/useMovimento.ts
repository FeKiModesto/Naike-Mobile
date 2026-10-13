import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';
import { ANIMACOES_ATIVAS, type ModoMovimento } from '../lib/animacoes';

// "Reduzir movimento" do sistema. Lido uma vez e mantido atualizado: se a pessoa mudar
// a configuração com o app aberto, os componentes reagem sem reiniciar.
let reduzido = false;
const ouvintes = new Set<() => void>();
function definir(valor: boolean) {
  if (valor === reduzido) return;
  reduzido = valor;
  ouvintes.forEach(avisar => avisar());
}
void AccessibilityInfo.isReduceMotionEnabled().then(definir).catch(() => undefined);
AccessibilityInfo.addEventListener('reduceMotionChanged', definir);

const assinar = (ouvinte: () => void) => { ouvintes.add(ouvinte); return () => { ouvintes.delete(ouvinte); }; };

export function useMovimento(): ModoMovimento {
  const sistemaReduz = useSyncExternalStore(assinar, () => reduzido, () => false);
  if (!ANIMACOES_ATIVAS) return 'desligado';
  return sistemaReduz ? 'reduzido' : 'completo';
}
