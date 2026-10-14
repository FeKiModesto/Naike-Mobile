import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { colors } from '../theme';

/** O canal precisa existir antes de pedir a permissão (Android 13+) e antes de agendar qualquer aviso. */
export const CANAL_ANDROID = 'default';

// Roda no import, antes de qualquer tela. Sem isso, a notificação que chega com o app aberto some.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export async function prepararCanalAndroid(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
    name: 'Avisos da Naike',
    description: 'Queda de preço dos favoritos, pedidos e novidades da loja.',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: colors.navy,
  });
}