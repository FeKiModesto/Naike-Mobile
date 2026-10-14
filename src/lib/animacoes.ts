/**
 * Vocabulário de movimento do app. Toda duração, mola e escala vive aqui (RF-62);
 * nenhum componente escolhe número próprio.
 *
 * Regra prática: se o dedo causou o movimento, mola (withSpring). Se o movimento só
 * informa (entrou, saiu, carregou), tempo (withTiming).
 */
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

/**
 * RF-55: chave geral. Em `false`, nenhuma animação roda: os valores mudam no mesmo
 * frame e o app continua inteiro. Cada componente consulta o modo por `useMovimento()`.
 */
export const ANIMACOES_ATIVAS = true;

/**
 * - completo: movimento normal.
 * - reduzido: "Reduzir movimento" do sistema. Sai o deslocamento e a escala, fica o
 *   feedback em opacidade (RF-54).
 * - desligado: ANIMACOES_ATIVAS = false.
 */
export type ModoMovimento = 'completo' | 'reduzido' | 'desligado';

export const DURACAO = { rapida: 150, media: 250, lenta: 400 } as const;

export const ENTRADA: WithTimingConfig = { duration: DURACAO.media, easing: Easing.out(Easing.cubic) };
export const SAIDA: WithTimingConfig = { duration: DURACAO.rapida, easing: Easing.in(Easing.cubic) };

/** Resposta ao toque: curta, com um quique perceptível e sem balançar. */
export const MOLA_TOQUE = { damping: 12, stiffness: 220, mass: 0.5 } as const satisfies WithSpringConfig;
/** Para o que se acomoda (itens de lista depois de uma remoção). */
export const MOLA_SUAVE = { damping: 18, stiffness: 140, mass: 0.8 } as const satisfies WithSpringConfig;

export const ESCALA_PRESSIONADO = 0.96;
export const ESCALA_PULO = 1.35;
/** Em "reduzir movimento" o toque escurece em vez de encolher. */
export const OPACIDADE_PRESSIONADO = 0.6;
export const OPACIDADE_PISCADA = 0.3;

/** Entrada escalonada da lista (RF-51). O teto evita o item 40 esperar 1,6 s para aparecer. */
export const ESCALONAMENTO = { passoMs: 40, atrasoMaximoMs: 300 } as const;
export const atrasoDeEntrada = (indice: number) => Math.min(indice * ESCALONAMENTO.passoMs, ESCALONAMENTO.atrasoMaximoMs);

/** Sinal de vida do carregamento (RF-53). */
export const PULSO_CARREGANDO = { opacidadeMinima: 0.35, duracaoMs: 700 } as const;

/** Mola para valores animados em resposta ao toque. Fora do modo completo, o valor muda direto. */
export function mola(modo: ModoMovimento, alvo: number) {
  return modo === 'completo' ? withSpring(alvo, MOLA_TOQUE) : withTiming(alvo, { duration: 0 });
}

/** Tempo para valores animados que apenas informam. Desligado, o valor muda no mesmo frame. */
export function tempo(modo: ModoMovimento, alvo: number, config: WithTimingConfig = ENTRADA) {
  return withTiming(alvo, modo === 'desligado' ? { duration: 0 } : config);
}

/** Pulso lento e infinito do carregamento (RF-53). Quem usa deve cancelar ao desmontar. */
export function pulsoDeCarregamento() {
  const { opacidadeMinima, duracaoMs } = PULSO_CARREGANDO;
  return withRepeat(withSequence(withTiming(opacidadeMinima, { duration: duracaoMs }), withTiming(1, { duration: duracaoMs })), -1);
}

/** Pulo de confirmação (RF-50): cresce rápido e volta com mola. */
export function puloDeEscala(modo: ModoMovimento) {
  return withSequence(tempo(modo, ESCALA_PULO, { duration: DURACAO.rapida }), mola(modo, 1));
}

/** O pulo em "reduzir movimento": uma piscada de opacidade, sem deslocamento nem escala. */
export function piscadaDeOpacidade(modo: ModoMovimento) {
  return withSequence(tempo(modo, OPACIDADE_PISCADA, { duration: DURACAO.rapida }), tempo(modo, 1, { duration: DURACAO.media }));
}

type PropsDeLayout = Pick<ComponentProps<typeof Animated.View>, 'entering' | 'exiting' | 'layout'>;

/**
 * Entrada, saída e acomodação de um item de lista (RF-51, RF-52).
 * `acomodar` liga saída animada e `layout`: os que ficam sobem juntos em vez de pular.
 */
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
