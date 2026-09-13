import React, { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useLogin } from '../hooks/useCadastroCliente';
import { useAuth } from '../contexts/AuthContext';
import { Button, Field, Page, Notice, ErrorNotice } from '../components/UI';
import { colors, ui } from '../theme';
import { validEmail } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';
export function Login() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const login = useLogin();
  const { sessionError } = useAuth();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [validation, setValidation] = useState('');
  function submit() {
    if (!validEmail(email) || !password) { setValidation('Informe um e-mail válido e sua senha.'); return; }
    setValidation(''); login.mutate({ email: email.trim(), password });
  }
  return <Page>
    <View style={{ backgroundColor: colors.navy, borderRadius: 26, padding: 28, gap: 20, minHeight: 260, justifyContent: 'space-between' }}>
      <Text style={{ color: colors.white, fontSize: 29, fontWeight: '900', letterSpacing: 5 }}>NAIKE<Text style={{ color: colors.lime }}>.</Text></Text>
      <View style={{ gap: 10 }}><Text style={{ color: colors.white, fontSize: 36, lineHeight: 40, fontWeight: '800', letterSpacing: -1 }}>Seu estilo.{ '\n' }Seu próximo passo.</Text>
      <Text style={{ color: '#D6D9F0', fontSize: 15 }}>Roupas e tênis para acompanhar seu ritmo.</Text></View>
    </View>
    <View style={ui.section}><Text style={ui.heading}>Que bom ter você por aqui.</Text><Text style={ui.muted}>Entre para guardar suas escolhas e acompanhar seus pedidos.</Text></View>
    {sessionError && <Notice text={sessionError} />}
    {Platform.OS === 'web' && <Notice text="Compras e sessão segura estão disponíveis no app Android e iOS. Você pode explorar o catálogo pelo navegador." />}
    <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="Seu e-mail" autoCapitalize="none" keyboardType="email-address" autoComplete="email" editable={!login.isPending} />
    <Field label="Senha" value={password} onChangeText={setPassword} placeholder="Sua senha" secureTextEntry autoComplete="current-password" editable={!login.isPending} onSubmitEditing={submit} />
    {validation && <Notice text={validation} tone="error" />}<ErrorNotice error={login.error} />
    <Button title="Entrar na Naike" onPress={submit} loading={login.isPending} disabled={Platform.OS === 'web'} icon="arrow-forward" />
    <Button title="Criar minha conta" secondary onPress={() => navigation.navigate('Cadastro')} disabled={login.isPending} />
    <Button title="Explorar a coleção" secondary onPress={() => navigation.navigate('HomePublica')} disabled={login.isPending} />
  </Page>;
}
