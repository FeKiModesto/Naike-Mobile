import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Button, Notice, Page } from '../components/UI';
import { ui } from '../theme';
import type { RootStackParamList } from '../navigation/types';
export function Ferramentas() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return <Page><Text style={ui.eyebrow}>ÁREA ACADÊMICA</Text><Text style={ui.title}>Ferramentas do grupo</Text>
    <Notice text="As ações são enviadas somente ao tocar nos botões. A participação é atribuída ao RM configurado localmente. Confira sua configuração antes de executar uma missão." />
    <View style={ui.card}><Text style={ui.heading}>Catálogo e estoque</Text>
      <Button title="Cadastrar produto simples ou variável" secondary icon="shirt-outline" onPress={() => navigation.navigate('ProdutoVariavel')} />
      <Button title="Registrar entrada de estoque" secondary icon="cube-outline" onPress={() => navigation.navigate('Estoque')} /></View>
    <View style={ui.card}><Text style={ui.heading}>Eventos e pós-venda</Text>
      <Button title="Configurar e acompanhar webhooks" secondary icon="link-outline" onPress={() => navigation.navigate('ConfigurarWebhook')} />
      <Button title="Reembolsar pedido pago" secondary icon="return-down-back-outline" onPress={() => navigation.navigate('Reembolso')} /></View>
    <Text style={ui.muted}>Para testar uma recusa, monte uma compra e ative “Simular pagamento recusado” na tela de pagamento. A NF-e é solicitada nos detalhes de um pedido pago.</Text>
  </Page>;
}
