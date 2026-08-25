import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Listagem } from './src/screens/listagem';
import { Detalhe } from './src/screens/Detalhe';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Listagem">
          <Stack.Screen name="Listagem" component={Listagem} options={{ title: 'Naike' }} />
          <Stack.Screen name="Detalhe" component={Detalhe} options={{ title: 'Detalhe' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}