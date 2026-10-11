import React from 'react';
import { Text } from 'react-native';
import { Page } from '../components/UI';
import { PontosRetirada } from '../components/PontosRetirada';
import { ui } from '../theme';

export function Retirada() {
  return <Page>
    <Text style={ui.eyebrow}>RETIRE NA LOJA</Text>
    <Text style={ui.title}>Pontos de retirada</Text>
    <PontosRetirada />
  </Page>;
}