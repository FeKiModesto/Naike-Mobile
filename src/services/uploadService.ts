import api from "./api";
import { AppError, isRecord } from "../utils/errors";
import type { FotoSelecionada } from "../types";

export const uploadService = {
  /** Envia uma foto e devolve o mediaId (não a URL final). */
  enviar: async (
    foto: FotoSelecionada,
    signal?: AbortSignal,
  ): Promise<string> => {
    const form = new FormData();
    // O React Native aceita { uri, name, type } como "arquivo". O tipo do TS não conhece esse formato.
    form.append("file", {
      uri: foto.uri,
      name: foto.fileName,
      type: foto.mimeType,
    } as unknown as Blob);
    const { data } = await api.post<unknown>("/uploads", form, {
      timeout: 60000,
      signal,
    });
    const corpo = isRecord(data) && isRecord(data.data) ? data.data : data;
    const mediaId = isRecord(corpo) ? (corpo.mediaId ?? corpo.id) : undefined;
    if (typeof mediaId !== "string")
      throw new AppError(
        "O envio da foto não retornou um identificador.",
        0,
        "CONTRACT_ERROR",
      );
    return mediaId;
  },
};
