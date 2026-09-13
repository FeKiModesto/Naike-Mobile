import React, { useState } from 'react';
import { Platform, Text } from 'react-native';
import { useCadastroCliente } from '../hooks/useCadastroCliente';
import { Page, Field, Button, Notice, ErrorNotice } from '../components/UI';
import { ui } from '../theme';
import { validEmail } from '../utils/validation';
export function Cadastro() {
  const register = useCadastroCliente();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [validation, setValidation] = useState('');
  function submit() {
    if (!name.trim() || !validEmail(email) || password.length < 6 || password !== confirm) {
      setValidation('Preencha seu nome, um e-mail válido e uma senha de pelo menos 6 caracteres. As senhas devem ser iguais.'); return;
    }
    setValidation(''); register.mutate({ name: name.trim(), email: email.trim(), password });
  }
  return <Page><Text style={ui.eyebrow}>BEM-VINDO À NAIKE</Text><Text style={ui.title}>Uma conta.{ '\n' }Novas possibilidades.</Text>
    <Text style={ui.muted}>Suas escolhas salvas, seus pedidos sempre por perto.</Text>
    <Field label="Nome" value={name} onChangeText={setName} autoComplete="name" editable={!register.isPending} />
    <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" editable={!register.isPending} />
    <Field label="Senha · mínimo de 6 caracteres" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" editable={!register.isPending} />
    <Field label="Confirme sua senha" value={confirm} onChangeText={setConfirm} secureTextEntry editable={!register.isPending} />
    {validation && <Notice text={validation} tone="error" />}<ErrorNotice error={register.error} />
    <Button title="Criar conta e entrar" onPress={submit} loading={register.isPending} disabled={Platform.OS === 'web'} />
    {Platform.OS === 'web' && <Notice text="Crie sua conta no app Android ou iOS para proteger sua sessão com armazenamento seguro." />}
  </Page>;
}
