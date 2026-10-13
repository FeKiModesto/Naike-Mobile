import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useMovimento } from '../hooks/useMovimento';
import { layoutDeLista } from '../lib/animacoes';

/**
 * Item de lista com entrada escalonada (RF-51). Com `acomodar`, também sai animado quando
 * é removido e os vizinhos se acomodam (RF-52). Grades de catálogo passam `acomodar={false}`:
 * trocar o filtro não deve fazer a grade inteira deslizar.
 */
export function ItemDeLista({ indice, acomodar = true, style, children }: { indice: number; acomodar?: boolean; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const modo = useMovimento();
  return <Animated.View {...layoutDeLista(modo, indice, acomodar)} style={style}>{children}</Animated.View>;
}
