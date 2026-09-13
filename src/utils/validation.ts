export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const positiveInteger = (value: string) => /^\d+$/.test(value.trim()) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
export const nonNegativeInteger = (value: string) => /^\d+$/.test(value.trim()) && Number.isSafeInteger(Number(value)) && Number(value) >= 0;
export function moneyValue(value: string): number | null {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const result = Number(value.replace(',', '.'));
  return Number.isFinite(result) && result >= 0 ? result : null;
}
export function publicHttps(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && !url.username && !url.password && host.includes('.') &&
      !host.endsWith('.local') && !host.endsWith('.localhost') && !host.endsWith('.internal') &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(host) && !host.includes(':');
  } catch { return false; }
}
export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const dateLabel = (value: string) => Number.isNaN(Date.parse(value)) ? 'Data não informada' : new Date(value).toLocaleDateString('pt-BR');
