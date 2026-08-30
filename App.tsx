import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './src/screens/Home';
import { Detalhe } from './src/screens/Detalhe';
import { ProdutoVariavel } from './src/screens/ProdutoVariavel';
import { Estoque } from './src/screens/Estoque';
import { CadastroCliente } from './src/screens/CadastroCliente';
import { ConfigurarWebhook } from './src/screens/ConfigurarWebhook';
import { CotacaoFrete } from './src/screens/CotacaoFrete';
import { Pagamento } from './src/screens/Pagamento';
import { AuthProvider } from './src/contexts/AuthContext';
import { Login } from './src/screens/Login';
import { Cadastro } from './src/screens/Cadastro';
import { Checkout } from './src/screens/Checkout';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ title: 'Naike' }} />
          <Stack.Screen name="Detalhe" component={Detalhe} options={{ title: 'Produto' }} />
          <Stack.Screen name="ProdutoVariavel" component={ProdutoVariavel} options={{ title: 'Produto Variável' }} />
          <Stack.Screen name="Estoque" component={Estoque} options={{ title: 'Estoque' }} />
          <Stack.Screen name="CadastroCliente" component={CadastroCliente} options={{ title: 'Cadastrar Cliente' }} />
          <Stack.Screen name="ConfigurarWebhook" component={ConfigurarWebhook} options={{ title: 'Configurar Webhook' }} />
          <Stack.Screen name="CotacaoFrete" component={CotacaoFrete} options={{ title: 'Cotar Frete' }} />
          <Stack.Screen name="Pagamento" component={Pagamento} options={{ title: 'Pagamento' }} />
          <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'Checkout' }} />
        </Stack.Navigator>
      </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}