import { Alert, Platform } from "react-native";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[],
) {
  if (Platform.OS === "web") {
    const texto = message ? `${title}\n\n${message}` : title;

    if (buttons && buttons.length > 1) {
      const confirmou = window.confirm(texto);
      if (confirmou) {
        const botaoConfirmar = buttons.find((b) => b.style !== "cancel");
        botaoConfirmar?.onPress?.();
      } else {
        const botaoCancelar = buttons.find((b) => b.style === "cancel");
        botaoCancelar?.onPress?.();
      }
      return;
    }

    window.alert(texto);
    buttons?.[0]?.onPress?.();
    return;
  }

  Alert.alert(title, message, buttons);
}
