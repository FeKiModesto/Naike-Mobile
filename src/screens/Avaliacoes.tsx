import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useAvaliacoes, useCanReview, useEnviarAvaliacao } from '../hooks/useAvaliacoes';
import { Button, ErrorNotice, Field, Notice, Page, State } from '../components/UI';
import { colors, ui } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { CanReviewMotivo } from '../types';

function motivoTexto(motivo: CanReviewMotivo): string {
  switch (motivo) {
    case 'NOT_PURCHASED': return 'Só quem comprou este produto pode deixar uma avaliação.';
    case 'ALREADY_REVIEWED': return 'Você já avaliou este produto. Obrigado pelo feedback!';
    case 'REVIEW_WINDOW_EXPIRED': return 'O prazo para avaliar este produto já encerrou.';
    default: return 'Não é possível avaliar este produto no momento.';
  }
}

function Estrelas({ valor, onChange, desabilitado }: { valor: number; onChange: (n: number) => void; desabilitado: boolean }) {
  return <View style={{ flexDirection: 'row', gap: 6 }}>
    {[1, 2, 3, 4, 5].map(n => <Pressable key={n} onPress={() => !desabilitado && onChange(n)} accessibilityLabel={`${n} estrela${n > 1 ? 's' : ''}`}>
      <Text style={{ fontSize: 32, color: n <= valor ? '#F5A623' : colors.line }}>★</Text>
    </Pressable>)}
  </View>;
}

function EstrelasLeitura({ valor }: { valor: number }) {
  return <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(n => <Text key={n} style={{ fontSize: 14, color: n <= valor ? '#F5A623' : colors.line }}>★</Text>)}
  </View>;
}

export function Avaliacoes() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Avaliacoes'>>();
  const { productId, productName } = params;
  const avaliacoes = useAvaliacoes(productId);
  const canReview = useCanReview(productId);
  const enviar = useEnviarAvaliacao(productId);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [erroForm, setErroForm] = useState('');
  const [enviado, setEnviado] = useState(false);
  function handleEnviar() {
    if (nota === 0) { setErroForm('Selecione uma nota antes de enviar.'); return; }
    if (comentario.trim().length < 5) { setErroForm('Escreva um comentário com pelo menos 5 caracteres.'); return; }
    setErroForm('');
    enviar.mutate(
      { rating: nota, comment: comentario.trim(), mediaIds: [] },
      { onSuccess: () => { setNota(0); setComentario(''); setEnviado(true); } },
    );
  }
  const lista = avaliacoes.data ?? [];
  return <Page>
    <Text style={ui.title}>{productName}</Text>
    <Text style={[ui.eyebrow, { color: colors.muted }]}>AVALIAÇÕES DOS CLIENTES</Text>
    {canReview.isPending ? <State loading title="Verificando…" /> : canReview.error ? <ErrorNotice error={canReview.error} /> : canReview.data?.canReview ? <View style={[ui.card, { gap: 16 }]}>
      <Text style={ui.heading}>Deixe sua avaliação</Text>
      <Estrelas valor={nota} onChange={setNota} desabilitado={enviar.isPending} />
      <Field label="Comentário" multiline value={comentario} onChangeText={setComentario} placeholder="O que você achou do produto?" editable={!enviar.isPending} />
      {erroForm ? <Notice text={erroForm} tone="error" /> : null}
      {enviado && <Notice text="Avaliação enviada com sucesso! Obrigado." tone="success" />}
      <ErrorNotice error={enviar.error} />
      <Button title={enviar.isPending ? 'Enviando…' : 'Enviar avaliação'} onPress={handleEnviar} loading={enviar.isPending} />
    </View> : <Notice tone="info" text={motivoTexto(canReview.data?.reason ?? 'NOT_PURCHASED')} />}
    <Text style={ui.heading}>O que dizem os clientes</Text>
    {avaliacoes.isPending ? <State loading title="Carregando avaliações…" /> : avaliacoes.error ? <State error={avaliacoes.error} title="Não conseguimos carregar" action={() => void avaliacoes.refetch()} /> : lista.length === 0 ? <State icon="chatbubble-outline" title="Nenhuma avaliação ainda" text="Seja o primeiro a avaliar este produto." /> : <View style={{ gap: 14 }}>
      {lista.map(r => <View key={r.id} style={ui.card}>
        <View style={ui.between}>
          <Text style={{ fontWeight: '700', color: colors.ink }}>{r.customer.name}</Text>
          <EstrelasLeitura valor={r.rating} />
        </View>
        <Text style={ui.body}>{r.comment}</Text>
        {r.mediaIds.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {r.mediaIds.map(mid => <Image key={mid} source={{ uri: `https://api.mockmerce.com.br/v1/uploads/${mid}` }} style={{ width: 80, height: 80, borderRadius: 10 }} resizeMode="cover" accessibilityLabel="Foto da avaliação" />)}
          </View>
        </ScrollView>}
        <Text style={ui.muted}>{new Date(r.createdAt).toLocaleDateString('pt-BR')}</Text>
      </View>)}
    </View>}
  </Page>;
}