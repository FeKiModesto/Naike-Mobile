import api from "./api";
import { AppError, isRecord } from "../utils/errors";
import type {
  Review,
  CanReviewResponse,
  CriarAvaliacaoInput,
  CanReviewMotivo,
} from "../types";

function textoOuVazio(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function midias(value: Record<string, unknown>): string[] {
  const campos = [
    "mediaIds",
    "media",
    "medias",
    "images",
    "photos",
    "attachments",
    "files",
  ];
  for (const campo of campos) {
    const lista = value[campo];
    if (!Array.isArray(lista) || lista.length === 0) continue;
    return lista.flatMap((m): string[] => {
      if (typeof m === "string") return [m];
      if (!isRecord(m)) return [];
      const achado = [m.url, m.mediaId, m.id].find(
        (x): x is string => typeof x === "string",
      );
      return achado ? [achado] : [];
    });
  }
  return [];
}

function nomeDoCliente(value: Record<string, unknown>): string {
  const cliente = isRecord(value.customer) ? value.customer : undefined;
  const autor = isRecord(value.author) ? value.author : undefined;
  const usuario = isRecord(value.user) ? value.user : undefined;
  const candidatos = [
    cliente?.name,
    cliente?.fullName,
    cliente?.firstName,
    autor?.name,
    usuario?.name,
    value.customerName,
    value.authorName,
    value.reviewerName,
    value.userName,
    value.name,
  ];
  return (
    candidatos.find(
      (c): c is string => typeof c === "string" && c.trim() !== "",
    ) ?? "Cliente"
  );
}

function reviewFromResponse(value: unknown): Review {
  if (!isRecord(value))
    throw new AppError(
      "Avaliação retornada em formato inválido.",
      0,
      "CONTRACT_ERROR",
    );
  const id =
    typeof value.id === "string"
      ? value.id
      : typeof value.id === "number"
        ? String(value.id)
        : undefined;
  const rating =
    typeof value.rating === "number"
      ? value.rating
      : typeof value.rating === "string" &&
          value.rating.trim() !== "" &&
          Number.isFinite(Number(value.rating))
        ? Number(value.rating)
        : undefined;
  if (id === undefined || rating === undefined) {
    throw new AppError(
      "Avaliação retornada em formato inválido.",
      0,
      "CONTRACT_ERROR",
    );
  }
  return {
    id,
    rating,
    comment: textoOuVazio(value.comment),
    mediaIds: midias(value),
    createdAt: textoOuVazio(value.createdAt),
    customer: { name: nomeDoCliente(value) },
  };
}

const POR_PAGINA = 20;

export const reviewService = {
  list: async (productId: string, signal?: AbortSignal): Promise<Review[]> => {
    const { data } = await api.get<unknown>(
      `/products/${encodeURIComponent(productId)}/reviews`,
      { params: { pageSize: POR_PAGINA }, signal },
    );
    const todas = Array.isArray(data)
      ? data
      : isRecord(data) && Array.isArray(data.data)
        ? data.data
        : [];
    const items = todas.filter(
      (item) => !(isRecord(item) && item.hidden === true),
    );
    const validas = items.flatMap((item): Review[] => {
      try {
        return [reviewFromResponse(item)];
      } catch {
        return [];
      }
    });
    if (items.length > 0 && validas.length === 0) {
      throw new AppError(
        "Avaliação retornada em formato inválido.",
        0,
        "CONTRACT_ERROR",
      );
    }
    return validas;
  },

  canReview: async (
    productId: string,
    signal?: AbortSignal,
  ): Promise<CanReviewResponse> => {
    const { data } = await api.get<unknown>(
      `/products/${encodeURIComponent(productId)}/reviews/can-review`,
      { signal },
    );
    if (!isRecord(data) || typeof data.canReview !== "boolean") {
      throw new AppError(
        "Resposta de can-review inesperada.",
        0,
        "CONTRACT_ERROR",
      );
    }
    const reason =
      typeof data.reason === "string"
        ? (data.reason as CanReviewMotivo)
        : "allowed";
    return { canReview: data.canReview, reason };
  },

  create: async (
    productId: string,
    input: CriarAvaliacaoInput,
  ): Promise<void> => {
    await api.post(`/products/${encodeURIComponent(productId)}/reviews`, input);
  },
};
