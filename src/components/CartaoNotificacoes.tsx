import React, { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { Button, Notice } from './UI';
import { useNotificacoes } from '../contexts/NotificacoesContext';
import { ui } from '../theme';

export function CartaoNotificacoes() {
  const { status, podePedirDeNovo, pedirPermissao } = useNotificacoes();
  if (status === 'verificando') return null;
  return <View style={ui.card}>
    <Text style={ui.heading}>Avisos da loja</Text>
    {status === 'concedida' && <Notice tone="success" text="Avisos ativados. Você recebe as novidades da loja e, ao tocar, abrimos o produto certo." />}
    {status === 'indefinida' && <>
      <Text style={ui.muted}>Receba um aviso quando a loja tiver novidade ou o preço de um favorito cair. Você decide agora e pode mudar depois nos ajustes.</Text>
      <Button title="Ativar avisos" icon="notifications-outline" onPress={() => void pedirPermissao()} />
    </>}
    {status === 'negada' && <>
      <Notice text="Os avisos estão desativados. O app continua completo: você só deixa de ver as novidades da loja." />
      {/* RF-60: o caminho para reativar aparece sempre. "Tentar de novo" só quando o sistema ainda aceita perguntar. */}
      <Text style={ui.muted}>Para reativar: ajustes do aparelho → Apps → Naike → Notificações.</Text>
      <Button title="Abrir ajustes do aparelho" secondary icon="settings-outline" onPress={() => void Linking.openSettings()} />
      {podePedirDeNovo && <Button title="Tentar ativar de novo" secondary icon="notifications-outline" onPress={() => void pedirPermissao()} />}
    </>}
  </View>;
}

export function ConviteNotificacoes() {
  const { status, pedirPermissao } = useNotificacoes();
  const [dispensado, setDispensado] = useState(false);
  if (status !== 'indefinida' || dispensado) return null;
  return <View style={ui.card}>
    <Text style={ui.heading}>Quer saber quando o preço cair?</Text>
    <Text style={ui.muted}>Ative os avisos e te contamos sobre novidades dos seus favoritos.</Text>
    <Button title="Ativar avisos" icon="notifications-outline" onPress={() => void pedirPermissao()} />
    <Button title="Agora não" secondary onPress={() => setDispensado(true)} />
  </View>;
}