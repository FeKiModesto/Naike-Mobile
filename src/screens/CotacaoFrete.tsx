import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useCotacaoFrete } from '../hooks/useCotacaoFrete';
import { Button, Chip, Field, Notice, ErrorNotice } from '../components/UI';
import { isRecord } from '../utils/errors';
import { money } from '../utils/validation';
import { ui } from '../theme';
/** Mantém as formas já tratadas no projeto. Valores ausentes nunca viram frete grátis. */
export function shippingOptions(value: unknown): { name: string; price: number; days?: number }[] {
  const raw = Array.isArray(value) ? value : isRecord(value) ? value.options ?? value.quotes : undefined;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap(item => {
    if (!isRecord(item)) return [];
    const name = item.service ?? item.name ?? item.carrier; const price = item.price ?? item.value;
    const days = item.estimatedDays ?? item.deliveryDays ?? item.deadline;
    return typeof name === 'string' && typeof price === 'number' ? [{ name, price, days: typeof days === 'number' ? days : undefined }] : [];
  });
}
export function CotacaoFrete({ orderId, disabled = false }: { orderId?: string; disabled?: boolean }) {
  const [cep, setCep] = useState(''); const [validation, setValidation] = useState(''); const [selected, setSelected] = useState<number>();
  const quote = useCotacaoFrete(); const options = shippingOptions(quote.data);
  function submit() {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) { setValidation('Informe um CEP com 8 dígitos.'); return; }
    setValidation(''); setSelected(undefined); quote.mutate({ cepDestino: cleaned, ...(orderId ? { orderId } : {}) });
  }
  return <View style={ui.card}><Text style={ui.heading}>Consulte a entrega</Text>
    <Field label="CEP de destino" placeholder="00000-000" value={cep} maxLength={9} keyboardType="number-pad"
      editable={!quote.isPending && !disabled} onChangeText={value => { setCep(value); quote.reset(); setSelected(undefined); }} />
    {validation && <Notice text={validation} tone="error" />}<ErrorNotice error={quote.error} />
    <Button title="Calcular frete" secondary loading={quote.isPending} disabled={disabled} onPress={submit} />
    {options.map((option, i) => <Chip key={option.name + i} selected={selected === i}
      title={option.name + ' · ' + money(option.price) + (option.days !== undefined ? ' · ' + option.days + ' dias úteis' : '')} onPress={() => setSelected(i)} />)}
    {quote.isSuccess && !options.length && <Notice text="A API respondeu, mas não retornou opções de frete reconhecidas. Confira a disponibilidade com a loja." />}
    <Text style={ui.muted}>Cotação informativa. A API de checkout não inclui o frete no total do pedido. Sem um pedido informado, a estimativa usa o padrão de peso da API.</Text>
  </View>;
}
