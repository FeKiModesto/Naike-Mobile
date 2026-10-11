import React from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Button, Notice } from './UI';
import { MAX_FOTOS, type FotosAvaliacaoState } from '../hooks/useFotosAvaliacao';
import { colors } from '../theme';

export function FotosAvaliacao({ galeria, desabilitado }: { galeria: FotosAvaliacaoState; desabilitado: boolean }) {
  const { fotos, estado, podePedirDeNovo, erro, adicionar, remover } = galeria;
  return <View style={{ gap: 10 }}>
    <Text style={{ color: colors.ink, fontWeight: '600', fontSize: 14 }}>Fotos (opcional, até {MAX_FOTOS})</Text>
    {fotos.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {fotos.map(f => <View key={f.uri}>
          <Image source={{ uri: f.uri }} style={{ width: 80, height: 80, borderRadius: 10 }} accessibilityLabel="Foto anexada" />
          <Pressable accessibilityRole="button" accessibilityLabel="Remover foto" disabled={desabilitado} onPress={() => remover(f.uri)}
            style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.white, fontWeight: '800' }}>×</Text>
          </Pressable>
        </View>)}
      </View>
    </ScrollView>}
    {estado === 'negada' && <Notice text="Sem acesso à galeria você perde a opção de anexar fotos. Sua nota e seu comentário continuam valendo e serão enviados normalmente." />}
    {estado === 'negada' && !podePedirDeNovo && <Button title="Abrir ajustes do aparelho" secondary icon="settings-outline" onPress={() => void Linking.openSettings()} />}
    {erro ? <Notice tone="error" text={erro} /> : null}
    <Button title={estado === 'negada' ? 'Tentar liberar a galeria' : 'Adicionar foto'} secondary icon="image-outline"
      disabled={desabilitado || fotos.length >= MAX_FOTOS} onPress={() => void adicionar()} />
  </View>;
}