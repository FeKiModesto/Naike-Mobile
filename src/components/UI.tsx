import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, ui } from '../theme';
import { errorMessage } from '../utils/errors';
export function Page({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={95}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[{ padding: 22, gap: 22, flexGrow: 1, width: '100%', maxWidth: 850, alignSelf: 'center' }, style]}>{children}</ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
export function Button({ title, onPress, loading, disabled, secondary, icon }: { title: string; onPress: () => void; loading?: boolean; disabled?: boolean; secondary?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  const blocked = !!loading || !!disabled;
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: blocked, busy: !!loading }}
    disabled={blocked} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: secondary ? colors.white : colors.navy, borderColor: colors.navy, opacity: blocked ? .5 : pressed ? .8 : 1 }]}>
    {loading ? <ActivityIndicator color={secondary ? colors.navy : colors.white} /> : icon ? <Ionicons name={icon} size={20} color={secondary ? colors.navy : colors.white} /> : null}
    <Text style={{ color: secondary ? colors.navy : colors.white, fontWeight: '700', fontSize: 15, textAlign: 'center', flexShrink: 1 }}>{title}</Text>
  </Pressable>;
}
export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return <View style={{ gap: 8 }}>
    <Text style={{ color: colors.ink, fontWeight: '600', fontSize: 14 }}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={[styles.input, props.multiline && { minHeight: 100, textAlignVertical: 'top' }, props.style]} />
    {error && <Text accessibilityRole="alert" style={{ color: colors.danger }}>{error}</Text>}
  </View>;
}
export function Notice({ text, tone = 'info' }: { text: string; tone?: 'info' | 'error' | 'success' }) {
  const color = tone === 'error' ? colors.danger : tone === 'success' ? colors.success : colors.navy;
  return <View accessibilityLiveRegion="polite" style={{ borderLeftWidth: 3, borderColor: color, backgroundColor: colors.white, borderRadius: 8, padding: 14 }}>
    <Text style={{ fontSize: 14, lineHeight: 21, color }}>{text}</Text>
  </View>;
}
export function ErrorNotice({ error }: { error: unknown }) { return error ? <Notice text={errorMessage(error)} tone="error" /> : null; }
export function State({ loading, error, title, text, action, actionTitle = 'Tentar novamente', icon = 'bag-outline' }: {
  loading?: boolean; error?: unknown; title?: string; text?: string; action?: () => void; actionTitle?: string; icon?: keyof typeof Ionicons.glyphMap;
}) {
  return <View style={{ padding: 28, gap: 16, alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 240 }}>
    {loading ? <ActivityIndicator size="large" color={colors.navy} /> : <Ionicons name={error ? 'cloud-offline-outline' : icon} size={42} color={colors.navy} />}
    <Text style={[ui.heading, { textAlign: 'center' }]}>{loading ? 'Só um instante…' : error ? 'Não conseguimos carregar' : title}</Text>
    <Text style={[ui.muted, { textAlign: 'center' }]}>{error ? errorMessage(error) : text}</Text>
    {!loading && action && <Button title={actionTitle} onPress={action} secondary />}
  </View>;
}
export function Chip({ title, selected, onPress, disabled }: { title: string; selected?: boolean; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="radio" accessibilityLabel={title} accessibilityState={{ selected: !!selected, disabled: !!disabled }}
    onPress={onPress} disabled={disabled} style={{ minHeight: 44, paddingHorizontal: 17, paddingVertical: 12, justifyContent: 'center',
      borderRadius: 14, borderWidth: 1, borderColor: selected ? colors.navy : colors.line, backgroundColor: selected ? colors.navy : colors.white, opacity: disabled ? .4 : 1 }}>
    <Text style={{ color: selected ? colors.white : colors.ink, fontSize: 14, fontWeight: '600' }}>{title}</Text>
  </Pressable>;
}
export function ProductImage({ uri, name, height = 220 }: { uri?: string; name: string; height?: number }) {
  const [failed, setFailed] = useState(false);
  const lastUri = useRef(uri);
  if (lastUri.current !== uri) { lastUri.current = uri; if (failed) setFailed(false); }
  return <View style={{ height, borderRadius: 18, overflow: 'hidden', backgroundColor: '#ECEEF5', alignItems: 'center', justifyContent: 'center' }}>
    {uri && !failed ? <Image accessibilityLabel={name} source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" onError={() => setFailed(true)} /> :
      <View style={{ gap: 10, alignItems: 'center' }}><Ionicons name="shirt-outline" size={40} color={colors.muted} /><Text style={ui.muted}>Imagem indisponível</Text></View>}
  </View>;
}
export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { PENDING: 'Aguardando pagamento', PAID: 'Pago', CANCELLED: 'Cancelado', REFUNDED: 'Reembolsado', FULFILLED: 'Em preparação', SHIPPED: 'Enviado', DELIVERED: 'Entregue', DECLINED: 'Recusado' };
  return <View style={{ alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: status === 'PAID' ? '#E4F3EB' : colors.blue }}>
    <Text style={{ fontSize: 12, color: status === 'PAID' ? colors.success : colors.navy, fontWeight: '700' }}>{labels[status] ?? status}</Text>
  </View>;
}
const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  input: { minHeight: 52, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 16, color: colors.ink },
});
