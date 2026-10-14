import React, { useEffect, useRef } from 'react';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useMovimento } from '../hooks/useMovimento';
import { piscadaDeOpacidade, puloDeEscala } from '../lib/animacoes';


export function PulsoAoAtivar({ ativo, children }: { ativo: boolean; children: React.ReactNode }) {
  const modo = useMovimento();
  const escala = useSharedValue(1);
  const opacidade = useSharedValue(1);
  const anterior = useRef(ativo);

  useEffect(() => {
    const ativou = ativo && !anterior.current;
    anterior.current = ativo;
    if (!ativou) return;
    if (modo === 'completo') escala.value = puloDeEscala(modo);
    else if (modo === 'reduzido') opacidade.value = piscadaDeOpacidade(modo);
  }, [ativo, modo, escala, opacidade]);

  const estilo = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }], opacity: opacidade.value }));
  return <Animated.View style={estilo}>{children}</Animated.View>;
}