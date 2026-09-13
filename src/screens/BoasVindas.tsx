import React from 'react';
import { Image, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Button } from '../components/UI';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';
const LOGO_RATIO = 460 / 543;
export function BoasVindas() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width - 1, 800);
  return <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
    <View style={{ flex: 1, padding: 22, justifyContent: 'center', alignItems: 'center', gap: 40, width: '100%', maxWidth: 850, alignSelf: 'center' }}>
      <Image accessibilityLabel="Naike" source={require('../../assets/Logo_inicial-.png')} style={{ width: logoWidth, height: logoWidth * LOGO_RATIO }} resizeMode="contain" />
      <View style={{ gap: 12, width: '100%' }}>
        <Button title="Entrar" icon="arrow-forward" onPress={() => navigation.navigate('Login')} />
        <Button title="Criar minha conta" secondary onPress={() => navigation.navigate('Cadastro')} />
        <Button title="Explorar a coleção" secondary onPress={() => navigation.navigate('HomePublica')} />
      </View>
    </View>
  </SafeAreaView>;
}
