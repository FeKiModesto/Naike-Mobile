
import type { ComponentProps } from 'react';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutRight,
  LinearTransition,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type WithSpringConfig,
  type WithTimingConfig,
  Easing,
} from 'react-native-reanimated';


export const ANIMACOES_ATIVAS = true;


export type ModoMovimento = 'completo' | 'reduzido' | 'desligado';

export const DURACAO = { rapida: 150, media: 250, lenta: 400 } as const;

export const ENTRADA: WithTimingConfig = { duration: DURACAO.media, easing: Easing.out(Easing.cubic) };
export const SAIDA: WithTimingConfig = { duration: DURACAO.rapida, easing: Easing.in(Easing.cubic) };


export const MOLA_TOQUE = { damping: 12, stiffness: 220, mass: 0.5 } as const satisfies WithSpringConfig;

export const MOLA_SUAVE = { damping: 18, stiffness: 140, mass: 0.8 } as const satisfies WithSpringConfig;

export const ESCALA_PRESSIONADO = 0.96;
export const ESCALA_PULO = 1.35;

export const OPACIDADE_PRESSIONADO = 0.6;
export const OPACIDADE_PISCADA = 0.3;


export const ESCALONAMENTO = { passoMs: 40, atrasoMaximoMs: 300 } as const;
export const atrasoDeEntrada = (indice: number) => Math.min(indice * ESCALONAMENTO.passoMs, ESCALONAMENTO.atrasoMaximoMs);


export const PULSO_CARREGANDO = { opacidadeMinima: 0.35, duracaoMs: 700 } as const;


export function mola(modo: ModoMovimento, alvo: number) {
  return modo === 'completo' ? withSpring(alvo, MOLA_TOQUE) : withTiming(alvo, { duration: 0 });
}


export function tempo(modo: ModoMovimento, alvo: number, config: WithTimingConfig = ENTRADA) {
  return withTiming(alvo, modo === 'desligado' ? { duration: 0 } : config);
}


export function pulsoDeCarregamento() {
  const { opacidadeMinima, duracaoMs } = PULSO_CARREGANDO;
  return withRepeat(withSequence(withTiming(opacidadeMinima, { duration: duracaoMs }), withTiming(1, { duration: duracaoMs })), -1);
}

export function puloDeEscala(modo: ModoMovimento) {
  return withSequence(tempo(modo, ESCALA_PULO, { duration: DURACAO.rapida }), mola(modo, 1));
}

export function piscadaDeOpacidade(modo: ModoMovimento) {
  return withSequence(tempo(modo, OPACIDADE_PISCADA, { duration: DURACAO.rapida }), tempo(modo, 1, { duration: DURACAO.media }));
}

type PropsDeLayout = Pick<ComponentProps<typeof Animated.View>, 'entering' | 'exiting' | 'layout'>;


export function layoutDeLista(modo: ModoMovimento, indice = 0, acomodar = true): PropsDeLayout {
  if (modo === 'desligado') return {};
  if (modo === 'reduzido') {
    return {
      entering: FadeIn.duration(DURACAO.media),
      exiting: acomodar ? FadeOut.duration(DURACAO.rapida) : undefined,
    };
  }
  return {
    entering: FadeInDown.delay(atrasoDeEntrada(indice)).duration(DURACAO.media),
    exiting: acomodar ? FadeOutRight.duration(DURACAO.media) : undefined,
    layout: acomodar
      ? LinearTransition.springify().damping(MOLA_SUAVE.damping).stiffness(MOLA_SUAVE.stiffness).mass(MOLA_SUAVE.mass)
      : undefined,
  };
}

/** Aparição de avisos e confirmações: só opacidade, serve para os dois modos que animam. */
export function entradaSuave(modo: ModoMovimento): PropsDeLayout {
  return modo === 'desligado' ? {} : { entering: FadeIn.duration(DURACAO.media) };
}