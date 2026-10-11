import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { useAction } from "./useAction";
import { catalogService } from "../services/catalogService";
import { AppError } from "../utils/errors";
import type { OrderItem } from "../types";
import type { RootStackParamList } from "../navigation/types";

/** Só quem pagou pode avaliar. Pedido pendente, cancelado ou reembolsado não mostra o botão. */
const STATUS_AVALIAVEIS = ["PAID", "FULFILLED", "SHIPPED", "DELIVERED"];
export const podeAvaliar = (status: string) =>
  STATUS_AVALIAVEIS.includes(status);

async function descobrirProdutoId(item: OrderItem): Promise<string> {
  if (item.productId) return item.productId;
  // A API não mandou o productId no pedido: acha o produto cuja variante foi comprada.
  const { data } = await catalogService.list(1, item.productName);
  const porVariante = data.find((p) =>
    p.variants.some((v) => v.id === item.variantId),
  );
  const achado = porVariante ?? data.find((p) => p.name === item.productName);
  if (!achado)
    throw new AppError(
      "Não encontramos este produto no catálogo para avaliar.",
      0,
      "NOT_FOUND",
    );
  return achado.id;
}

export function useAvaliarItem() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return useAction({
    mutationFn: async (item: OrderItem) => ({
      productId: await descobrirProdutoId(item),
      productName: item.productName,
    }),
    onSuccess: ({ productId, productName }) =>
      navigation.navigate("Avaliacoes", { productId, productName }),
  });
}
