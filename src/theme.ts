import { StyleSheet } from 'react-native';
export const colors = { navy: '#050061', ink: '#191A32', muted: '#646678', paper: '#F6F7FB', white: '#FFFFFF',
  line: '#DDE0EC', blue: '#E8ECFA', lime: '#D8EE8C', success: '#176B48', danger: '#AF253E', warning: '#795300' };
export const ui = StyleSheet.create({
  title: { color: colors.navy, fontSize: 30, fontWeight: '800', letterSpacing: -1 },
  heading: { color: colors.ink, fontSize: 20, fontWeight: '700' },
  body: { color: colors.ink, fontSize: 16, lineHeight: 24 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  eyebrow: { color: colors.navy, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.line, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  section: { gap: 16 },
  separator: { height: 1, backgroundColor: colors.line },
});
