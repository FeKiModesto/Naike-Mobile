import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useMovimento } from '../hooks/useMovimento';
import { layoutDeLista } from '../lib/animacoes';

export function ItemDeLista({ indice, acomodar = true, style, children }: { indice: number; acomodar?: boolean; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const modo = useMovimento();
  return <Animated.View {...layoutDeLista(modo, indice, acomodar)} style={style}>{children}</Animated.View>;
}
