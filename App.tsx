import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { queryClient } from './src/lib/queryClient';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { Home } from './src/screens/Home';
import { Detalhe } from './src/screens/Detalhe';
import { Avaliacoes } from './src/screens/Avaliacoes';
import { BoasVindas } from './src/screens/BoasVindas';
import { Login } from './src/screens/Login';
import { Cadastro } from './src/screens/Cadastro';
import { Carrinho } from './src/screens/Carrinho';
import { Favoritos } from './src/screens/Favoritos';
import { Pedidos } from './src/screens/Pedidos';
import { Perfil } from './src/screens/Perfil';
import { Checkout } from './src/screens/Checkout';
import { Pagamento } from './src/screens/Pagamento';
import { PedidoDetalhe } from './src/screens/PedidoDetalhe';
import { Ferramentas } from './src/screens/Ferramentas';
import { ProdutoVariavel } from './src/screens/ProdutoVariavel';
import { Estoque } from './src/screens/Estoque';
import { ConfigurarWebhook } from './src/screens/ConfigurarWebhook';
import { Reembolso } from './src/screens/Reembolso';
import { colors } from './src/theme';
import { useCarrinho } from './src/hooks/useCarrinho';
import type { RootStackParamList, TabParams } from './src/navigation/types';
void SplashScreen.preventAutoHideAsync().catch(() => undefined);
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParams>();
const icons: Record<keyof TabParams, keyof typeof Ionicons.glyphMap> = { Home: 'grid-outline', Favoritos: 'heart-outline', Carrinho: 'bag-outline', Pedidos: 'receipt-outline', Perfil: 'person-outline' };
function Loja() {
  const cart = useCarrinho();
  return <Tabs.Navigator screenOptions={({ route }) => ({
    headerTitle: 'NAIKE.', headerTitleStyle: { color: colors.navy, fontWeight: '900', letterSpacing: 3 },
    headerStyle: { backgroundColor: colors.white }, headerShadowVisible: false,
    tabBarActiveTintColor: colors.navy, tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.line },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} color={color} size={size} />,
  })}>
    <Tabs.Screen name="Home" component={Home} />
    <Tabs.Screen name="Favoritos" component={Favoritos} />
    <Tabs.Screen name="Carrinho" component={Carrinho} options={{ tabBarBadge: cart.data?.itemCount || undefined }} />
    <Tabs.Screen name="Pedidos" component={Pedidos} />
    <Tabs.Screen name="Perfil" component={Perfil} />
  </Tabs.Navigator>;
}
function Root() {
  const { isLoading, customer } = useAuth();
  useEffect(() => { void SplashScreen.hideAsync().catch(() => undefined); }, []);
  if (isLoading) return <View style={{ flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
    <Text style={{ color: colors.white, fontSize: 46, fontWeight: '900', letterSpacing: 6 }}>NAIKE.</Text>
    <ActivityIndicator color={colors.lime} /><Text style={{ color: colors.white }}>Preparando seu próximo passo…</Text></View>;
  return <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.navy, background: colors.paper, card: colors.white, text: colors.ink, border: colors.line } }}>
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy, headerShadowVisible: false, headerTitleStyle: { fontWeight: '700' }, contentStyle: { backgroundColor: colors.paper } }}>
      {customer ? <Stack.Group navigationKey={customer.id}>
        <Stack.Screen name="Loja" component={Loja} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'Revisar compra' }} />
        <Stack.Screen name="Pagamento" component={Pagamento} options={{ title: 'Pagamento' }} />
        <Stack.Screen name="PedidoDetalhe" component={PedidoDetalhe} options={{ title: 'Seu pedido' }} />
        <Stack.Screen name="Ferramentas" component={Ferramentas} options={{ title: 'Ferramentas do grupo' }} />
        <Stack.Screen name="ProdutoVariavel" component={ProdutoVariavel} options={{ title: 'Cadastrar produto' }} />
        <Stack.Screen name="Estoque" component={Estoque} options={{ title: 'Estoque' }} />
        <Stack.Screen name="ConfigurarWebhook" component={ConfigurarWebhook} options={{ title: 'Webhooks' }} />
        <Stack.Screen name="Reembolso" component={Reembolso} options={{ title: 'Reembolso' }} />
        <Stack.Screen name="Avaliacoes" component={Avaliacoes} options={{ title: 'Avaliações' }} />
      </Stack.Group> : <Stack.Group navigationKey="public">
        <Stack.Screen name="BoasVindas" component={BoasVindas} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'NAIKE' }} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Sua nova conta' }} />
        <Stack.Screen name="HomePublica" component={Home} options={{ title: 'Coleção Naike' }} />
      </Stack.Group>}
      <Stack.Screen name="Detalhe" component={Detalhe} navigationKey={customer?.id ?? 'guest'} options={{ title: 'Detalhes da peça' }} />
    </Stack.Navigator>
  </NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><QueryClientProvider client={queryClient}><AuthProvider><StatusBar style="dark" /><Root /></AuthProvider></QueryClientProvider></SafeAreaProvider>;
}