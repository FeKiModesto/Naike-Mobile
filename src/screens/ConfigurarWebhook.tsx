import React, { useEffect, useRef, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import { useConfigurarWebhook, useEntregas, usePingWebhook, useWebhooks } from '../hooks/useConfigurarWebhook';
import { Button, Chip, ErrorNotice, Field, Notice, Page, State } from '../components/UI';
import { publicHttps, dateLabel } from '../utils/validation';
import { colors, ui } from '../theme';
export function ConfigurarWebhook() {
  const [url, setUrl] = useState(''); const [description, setDescription] = useState(''); const [validation, setValidation] = useState('');
  const [secret, setSecret] = useState<string>(); const active = useRef(true); const [selected, setSelected] = useState(''); const [page, setPage] = useState(1);
  const create = useConfigurarWebhook(s => { if (active.current) setSecret(s); }); const list = useWebhooks(); const deliveries = useEntregas(selected, page); const ping = usePingWebhook();
  const busy = create.isPending || ping.isPending;
  useEffect(() => {
    active.current = true;
    const sub = AppState.addEventListener('change', state => { if (state !== 'active') setSecret(undefined); });
    return () => { active.current = false; sub.remove(); };
  }, []);
  function submit() {
    if (!publicHttps(url.trim())) { setValidation('Informe uma URL pública HTTPS válida, sem credenciais e sem endereço de rede local.'); return; }
    setValidation(''); setSecret(undefined);
    create.mutate({ url: url.trim(), description: description.trim() || undefined, events: ['*'] }, { onSuccess: value => { setSelected(value.id); setPage(1); } });
  }
  return <Page><Text style={ui.title}>Webhooks</Text>
    <Text style={ui.muted}>O servidor da Mockmerce envia os eventos para sua URL pública. Este aplicativo registra o destino e acompanha as entregas.</Text>
    <View style={ui.card}><Text style={ui.heading}>Registrar destino</Text>
      <Field label="URL pública HTTPS" placeholder="https://seu-dominio.com/webhooks" value={url} onChangeText={setUrl} autoCapitalize="none" keyboardType="url" editable={!busy} />
      <Field label="Descrição (opcional)" value={description} onChangeText={setDescription} editable={!busy} />
      <Text style={ui.muted}>Assinatura: todos os eventos (*), incluindo o ping de teste.</Text>
      {validation && <Notice tone="error" text={validation} />}<ErrorNotice error={create.error} />
      <Button title="Registrar webhook" disabled={busy || !!secret} loading={create.isPending} onPress={submit} />
    </View>
    {secret && <View style={ui.card}><Notice text="Configure este segredo no receptor agora. Ao fechar este aviso, sair da tela ou colocar o app em segundo plano, ele desaparece." />
      <Text selectable accessibilityLabel="Segredo de assinatura, exibido uma única vez" style={ui.body}>{secret}</Text>
      <Button title="Já configurei no receptor · ocultar" onPress={() => setSecret(undefined)} /></View>}
    {create.isSuccess && <Notice tone="success" text="Webhook registrado. Configure o receptor antes de disparar o ping." />}
    <Text style={ui.heading}>Seus destinos</Text>
    {list.isPending || list.error ? <State loading={list.isPending} error={list.error} action={() => void list.refetch()} /> :
      !list.data?.length ? <Notice text="Nenhum webhook cadastrado. Registre sua URL acima." /> :
      list.data.map(item => <Chip key={item.id} title={item.description || item.url} selected={selected === item.id} disabled={busy}
        onPress={() => { setSelected(item.id); setPage(1); ping.reset(); setSecret(undefined); }} />)}
    <Button title="Atualizar destinos" secondary loading={list.isFetching} onPress={() => void list.refetch()} />
    {selected && <><Button title="Disparar ping manual" icon="paper-plane-outline" loading={ping.isPending} disabled={busy || !!secret} onPress={() => ping.mutate(selected)} />
      <ErrorNotice error={ping.error} />{ping.isSuccess && <Notice text="Ping solicitado. Aguarde o processamento e atualize o histórico. Solicitação aceita ainda não significa entrega bem-sucedida." />}
      <Text style={ui.heading}>Histórico de entregas</Text>
      {deliveries.isPending || deliveries.error ? <State loading={deliveries.isPending} error={deliveries.error} action={() => void deliveries.refetch()} /> :
        !deliveries.data?.length ? <Notice text="Nenhuma entrega nesta página." /> : deliveries.data.map(item => <View key={item.id} style={ui.card}>
          <Text style={{ color: item.status === 'SUCCESS' ? colors.success : item.status === 'DEAD_LETTER' ? colors.danger : colors.warning, fontWeight: '800', fontSize: 18 }}>{item.status}</Text>
          <Text style={ui.body}>{item.status === 'SUCCESS' ? 'Entrega bem-sucedida' : item.status === 'DEAD_LETTER' ? 'Falha definitiva. Confira o receptor e seu retorno HTTP.' : 'Entrega aguardando processamento ou nova tentativa.'}</Text>
          {item.createdAt && <Text style={ui.muted}>{dateLabel(item.createdAt)}</Text>}{item.attempts !== undefined && <Text style={ui.muted}>Tentativas: {item.attempts}</Text>}
        </View>)}
      <Button title="Atualizar histórico" secondary loading={deliveries.isFetching} onPress={() => void deliveries.refetch()} />
      <View style={ui.between}><Button title="Anterior" secondary disabled={page === 1 || deliveries.isFetching} onPress={() => setPage(p => p - 1)} />
        <Text style={ui.body}>{page}</Text><Button title="Próxima" secondary disabled={deliveries.data?.length !== 20 || deliveries.isFetching} onPress={() => setPage(p => p + 1)} /></View>
    </>}
  </Page>;
}
