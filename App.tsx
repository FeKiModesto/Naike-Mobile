import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './src/screens/Home';
import { Detalhe } from './src/screens/Detalhe';
import { ProdutoVariavel } from './src/screens/ProdutoVariavel';
import { Estoque } from './src/screens/Estoque';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ title: 'Naike' }} />
          <Stack.Screen name="Detalhe" component={Detalhe} options={{ title: 'Produto' }} />
          <Stack.Screen name="ProdutoVariavel" component={ProdutoVariavel} options={{ title: 'Produto Variável' }} />
          <Stack.Screen name="Estoque" component={Estoque} options={{ title: 'Estoque' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}