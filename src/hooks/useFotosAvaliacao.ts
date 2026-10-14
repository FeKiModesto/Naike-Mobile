import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import type { FotoSelecionada } from "../types";

export const MAX_FOTOS = 3;
export type EstadoGaleria = "nao-pedida" | "concedida" | "negada";

export function useFotosAvaliacao() {
  const [fotos, setFotos] = useState<FotoSelecionada[]>([]);
  const [estado, setEstado] = useState<EstadoGaleria>("nao-pedida");
  const [podePedirDeNovo, setPodePedirDeNovo] = useState(true);
  const [erro, setErro] = useState("");

  async function adicionar() {
    setErro("");
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        setEstado("negada");
        setPodePedirDeNovo(permissao.canAskAgain);
        return;
      }
      setEstado("concedida");
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, MAX_FOTOS - fotos.length),
        quality: 0.7,
      });
      if (resultado.canceled) return;
      const novas: FotoSelecionada[] = resultado.assets.map((a, i) => ({
        uri: a.uri,
        fileName: a.fileName ?? `avaliacao-${Date.now()}-${i}.jpg`,
        mimeType: a.mimeType ?? "image/jpeg",
      }));
      setFotos((atual) => [...atual, ...novas].slice(0, MAX_FOTOS));
    } catch {
      setErro(
        "Não foi possível abrir a galeria. Você pode enviar a avaliação sem foto.",
      );
    }
  }

  return {
    fotos,
    estado,
    podePedirDeNovo,
    erro,
    adicionar,
    remover: (uri: string) =>
      setFotos((atual) => atual.filter((f) => f.uri !== uri)),
    limpar: () => setFotos([]),
  };
}
export type FotosAvaliacaoState = ReturnType<typeof useFotosAvaliacao>;
