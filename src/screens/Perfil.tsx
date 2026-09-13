import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Button, Notice, Page } from '../components/UI';
import { useAction } from '../hooks/useAction';
import { ui, colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';
export function Perfil() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); const { customer, logout, offline, retrySession } = useAuth();
  const exit = useAction({ mutationFn: logout });
  return <Page><Text style={ui.eyebrow}>SEU ESPAÇO</Text><Text style={ui.title}>Olá, {customer?.name.split(' ')[0]}.</Text>
    <View style={ui.card}><View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.white, fontSize: 26, fontWeight: '700' }}>{customer?.name.slice(0, 1).toUpperCase()}</Text></View>
      <Text style={ui.heading}>{customer?.name}</Text><Text style={ui.muted}>{customer?.email}</Text></View>
    {offline && <><Notice text="Sessão em modo offline. Seus favoritos salvos continuam disponíveis." /><Button title="Reconectar" secondary onPress={retrySession} /></>}
    <Button title="Meus pedidos" secondary icon="receipt-outline" onPress={() => navigation.navigate('Loja', { screen: 'Pedidos' })} />
    <Button title="Ferramentas do grupo" secondary icon="construct-outline" onPress={() => navigation.navigate('Ferramentas')} />
    <Button title="Sair da conta" icon="log-out-outline" loading={exit.isPending} onPress={() => exit.mutate(undefined)} />
    <Text style={[ui.muted, { textAlign: 'center' }]}>NAIKE · Vista o seu ritmo.</Text>
  </Page>;
}
