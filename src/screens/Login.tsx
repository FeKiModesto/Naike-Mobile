import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { showAlert } from '../utils/alert';

export function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function entrar() {
    if (!email.trim() || !password.trim()) { showAlert('Atenção', 'Preencha e-mail e senha.'); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigation.goBack();
    } catch (e: any) {
      showAlert('Erro ao entrar', e.message ?? 'Verifique suas credenciais.');
    } finally { setLoading(false); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Entrar</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={entrar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTexto}>Entrar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.link}>Não tenho conta — cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#050061', marginBottom: 24 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 12 },
  btn: { backgroundColor: '#050061', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  btnTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#050061', textAlign: 'center', marginTop: 16 },
});