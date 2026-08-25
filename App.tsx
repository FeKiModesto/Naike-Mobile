import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './src/screens/Home';
import { Detalhe } from './src/screens/Detalhe';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  console.log('🔵 App iniciado');
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ title: 'Naike' }} />
          <Stack.Screen name="Detalhe" component={Detalhe} options={{ title: 'Detalhe' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}