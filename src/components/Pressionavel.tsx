import React from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useMovimento } from '../hooks/useMovimento';
import { ESCALA_PRESSIONADO, OPACIDADE_PRESSIONADO, SAIDA, mola, tempo } from '../lib/animacoes';

const AreaAnimada = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; semAnimacao?: boolean };

/**
 * Feedback de toque em um lugar só (RF-49). Modo completo: encolhe com mola.
 * Reduzir movimento ou animações desligadas: escurece, sem deslocar nada (RF-54).
 * Os valores vivem na thread de UI: tocar não re-renderiza o componente.
 */
export function Pressionavel({ style, semAnimacao, onPressIn, onPressOut, ...resto }: Props) {
  const modo = useMovimento();
  const escala = useSharedValue(1);
  const opacidade = useSharedValue(1);
  // A opacidade do estilo (ex.: botão desabilitado) é a base; o toque a multiplica.
  const opacidadeDoEstilo = StyleSheet.flatten(style)?.opacity;
  const base = typeof opacidadeDoEstilo === 'number' ? opacidadeDoEstilo : 1;

  const estiloAnimado = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }], opacity: base * opacidade.value }));

  function mudar(pressionado: boolean) {
    if (semAnimacao) return;
    if (modo === 'completo') escala.value = mola(modo, pressionado ? ESCALA_PRESSIONADO : 1);
    else opacidade.value = tempo(modo, pressionado ? OPACIDADE_PRESSIONADO : 1, SAIDA);
  }

  return <AreaAnimada {...resto} style={[style, estiloAnimado]}
    onPressIn={evento => { mudar(true); onPressIn?.(evento); }}
    onPressOut={evento => { mudar(false); onPressOut?.(evento); }} />;
}
