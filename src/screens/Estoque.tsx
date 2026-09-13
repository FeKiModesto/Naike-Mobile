import React, { useState } from 'react';
import { Text } from 'react-native';
import { useEstoque } from '../hooks/useEstoque';
import { VariantPicker } from '../components/VariantPicker';
import { Button, ErrorNotice, Field, Notice, Page } from '../components/UI';
import { positiveInteger } from '../utils/validation';
import { isRecord } from '../utils/errors';
import { ui } from '../theme';
import type { Variant } from '../types';
export function Estoque() {
  const [variant, setVariant] = useState<Variant>(); const [quantity, setQuantity] = useState(''); const [reason, setReason] = useState(''); const [validation, setValidation] = useState('');
  const stock = useEstoque(); const result = isRecord(stock.data) ? stock.data : undefined;
  function submit() {
    if (!variant || !positiveInteger(quantity)) { setValidation('Selecione uma variante e informe uma quantidade inteira maior que zero.'); return; }
    setValidation(''); stock.mutate({ variantId: variant.id, quantity: Number(quantity), reason: reason.trim() || 'Reposição manual' });
  }
  return <Page><Text style={ui.title}>Entrada de estoque</Text><Text style={ui.muted}>Escolha a variante e registre a reposição. O catálogo será atualizado após a resposta.</Text>
    <VariantPicker selectedId={variant?.id} onSelect={v => { setVariant(v); stock.reset(); }} disabled={stock.isPending} />
    {variant && <Notice text={'Selecionado: ' + variant.sku} />}
    <Field label="Quantidade de entrada" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" editable={!stock.isPending} />
    <Field label="Motivo (opcional)" value={reason} onChangeText={setReason} editable={!stock.isPending} />
    {validation && <Notice tone="error" text={validation} />}<ErrorNotice error={stock.error} />
    {stock.isSuccess && <Notice tone="success" text="Entrada registrada. Consulte abaixo o saldo retornado ou confira o catálogo atualizado." />}
    {result && ['onHand', 'available'].map(key => typeof result[key] === 'number' ? <Text key={key} style={ui.body}>{key === 'onHand' ? 'Estoque físico' : 'Disponível'}: {String(result[key])}</Text> : null)}
    <Button title="Registrar entrada" loading={stock.isPending} disabled={!variant} onPress={submit} />
  </Page>;
}
