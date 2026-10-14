import React from 'react';
import { Notice } from './UI';
import type { PropsMapa } from './MapaRetirada';

/** O react-native-maps não existe na web: a lista de pontos continua funcionando abaixo. */
export function MapaRetirada(_props: PropsMapa) {
  return <Notice text="O mapa só está disponível no aplicativo (Android e iOS). Os pontos aparecem na lista abaixo." />;
}
