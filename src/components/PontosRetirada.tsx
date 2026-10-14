import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Button, Notice, State } from './UI';
import { useLocalizacao, type EstadoLocalizacao } from '../hooks/useLocalizacao';
import { usePontosRetirada } from '../hooks/usePontosRetirada';
import { useLojaLocal } from '../hooks/useLojaLocal';
import { MapaRetirada } from './MapaRetirada';
import { distanciaLabel, haversineKm } from '../utils/geo';
import { colors, ui } from '../theme';
import type { PickupPoint } from '../types';

function AvisoLocalizacao({ estado, onRetry }: { estado: EstadoLocalizacao; onRetry: () => void }) {
  if (estado.status === 'ok') return <Notice tone="success" text="Pontos ordenados do mais perto para o mais longe de você." />;
  if (estado.status === 'carregando') return <Notice text="Obtendo sua localização. Isso leva poucos segundos…" />;
  const texto = estado.status === 'negada'
    ? 'Você não liberou a localização, então mostramos os pontos na ordem de cadastro da loja, sem calcular a distância.'
    : `${estado.motivo} Mostramos os pontos na ordem de cadastro da loja, sem calcular a distância.`;
  return <View style={{ gap: 10 }}>
    <Notice text={texto} />
    <Button title="Tentar novamente" secondary icon="locate-outline" onPress={onRetry} />
    {estado.status === 'negada' && !estado.podePedirDeNovo &&
      <Button title="Abrir ajustes do aparelho" secondary icon="settings-outline" onPress={() => void Linking.openSettings()} />}
  </View>;
}

function distanciaDoPonto(ponto: PickupPoint, estado: EstadoLocalizacao): string | undefined {
  if (estado.status !== 'ok') return undefined;
  if (ponto.distanceKm !== undefined) return distanciaLabel(ponto.distanceKm);
  if (ponto.latitude !== undefined && ponto.longitude !== undefined) {
    return distanciaLabel(haversineKm(estado.coords, { latitude: ponto.latitude, longitude: ponto.longitude }));
  }
  return undefined;
}

export function PontosRetirada({ selectedId, onSelect, mapa = true }: { selectedId?: string; onSelect?: (id: string | undefined) => void; mapa?: boolean }) {
  const { estado, tentarNovamente } = useLocalizacao();
  const coords = estado.status === 'ok' ? estado.coords : undefined;
  const pontos = usePontosRetirada(coords, estado.status !== 'carregando');
  const loja = useLojaLocal();

  return <View style={{ gap: 14 }}>
    <AvisoLocalizacao estado={estado} onRetry={() => void tentarNovamente()} />
    {mapa && !!pontos.data?.length && <MapaRetirada pontos={pontos.data} loja={loja.data} usuario={coords} selectedId={selectedId} />}
    {pontos.isPending ? <State loading /> :
      pontos.error ? <State error={pontos.error} action={() => void pontos.refetch()} /> :
      !pontos.data?.length ? <State icon="storefront-outline" title="Nenhum ponto de retirada" text="A loja ainda não cadastrou pontos de retirada." actionTitle="Atualizar" action={() => void pontos.refetch()} /> :
      pontos.data.map(ponto => {
        const escolhido = ponto.id === selectedId;
        const distancia = distanciaDoPonto(ponto, estado);
        return <View key={ponto.id} style={[ui.card, escolhido && { borderColor: colors.navy, borderWidth: 2 }]}>
          <View style={ui.between}>
            <Text style={[ui.heading, { flex: 1 }]}>{ponto.name}</Text>
            {distancia ? <Text accessibilityLabel={'Distância ' + distancia} style={{ color: colors.navy, fontWeight: '800' }}>{distancia}</Text> : null}
          </View>
          {ponto.address ? <Text style={ui.muted}>{ponto.address}</Text> : null}
          {ponto.hours ? <Text style={ui.muted}>{ponto.hours}</Text> : null}
          {onSelect && <Button title={escolhido ? 'Ponto escolhido' : 'Retirar aqui'} secondary={!escolhido}
            icon={escolhido ? 'checkmark-circle' : 'storefront-outline'} onPress={() => onSelect(escolhido ? undefined : ponto.id)} />}
        </View>;
      })}
  </View>;
}