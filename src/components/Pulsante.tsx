import React, { useEffect } from 'react';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useMovimento } from '../hooks/useMovimento';
import { pulsoDeCarregamento } from '../lib/animacoes';

/**
 * Sinal de vida do carregamento (RF-53): a opacidade vai e volta devagar, sem parar.
 * Só no modo completo. Em "reduzir movimento" o texto fica parado e quem sinaliza é o
 * ActivityIndicator nativo, que continua na tela.
 */
export function Pulsante({ children }: { children: React.ReactNode }) {
  const modo = useMovimento();
  const opacidade = useSharedValue(1);

  useEffect(() => {
    if (modo !== 'completo') { opacidade.value = 1; return; }
    opacidade.value = pulsoDeCarregamento();
    return () => cancelAnimation(opacidade);
  }, [modo, opacidade]);

  const estilo = useAnimatedStyle(() => ({ opacity: opacidade.value }));
  return <Animated.View style={estilo}>{children}</Animated.View>;
}