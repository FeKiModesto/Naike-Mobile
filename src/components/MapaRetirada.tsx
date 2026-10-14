import React, { useMemo } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../theme';
import { distanciaLabel } from '../utils/geo';
import type { Coordenadas, LojaLocal, PickupPoint } from '../types';

export interface PropsMapa {
  pontos: PickupPoint[];
  loja?: LojaLocal | null;
  usuario?: Coordenadas;
  selectedId?: string;
}

const ALTURA = 240;
const MARGEM = 1.6;
const DELTA_MINIMO = 0.02;

function regiaoQueCabeTudo(coords: Coordenadas[]) {
  const lats = coords.map(c => c.latitude);
  const lngs = coords.map(c => c.longitude);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * MARGEM, DELTA_MINIMO),
    longitudeDelta: Math.max((maxLng - minLng) * MARGEM, DELTA_MINIMO),
  };
}

export function MapaRetirada({ pontos, loja, usuario, selectedId }: PropsMapa) {
  const comLocal = useMemo(() => pontos.flatMap(ponto => ponto.latitude !== undefined && ponto.longitude !== undefined
    ? [{ ponto, coords: { latitude: ponto.latitude, longitude: ponto.longitude } }] : []), [pontos]);
  const regiao = useMemo(() => {
    const todas = [...comLocal.map(item => item.coords), ...(loja ? [loja.coords] : []), ...(usuario ? [usuario] : [])];
    return todas.length ? regiaoQueCabeTudo(todas) : undefined;
  }, [comLocal, loja, usuario]);
  if (!regiao) return null;

  return <View accessibilityLabel="Mapa com a loja e os pontos de retirada" style={{ height: ALTURA, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.line }}>
    <MapView key={`${regiao.latitude.toFixed(4)},${regiao.longitude.toFixed(4)}`} style={{ flex: 1 }} initialRegion={regiao} showsUserLocation={!!usuario}>
      {loja && <Marker coordinate={loja.coords} title={loja.name} description="Nossa loja" pinColor={colors.navy} />}
      {comLocal.map(({ ponto, coords }) => <Marker key={ponto.id} coordinate={coords} title={ponto.name}
        description={ponto.distanceKm !== undefined ? distanciaLabel(ponto.distanceKm) : ponto.address || undefined}
        pinColor={ponto.id === selectedId ? colors.success : undefined} />)}
    </MapView>
  </View>;
}
