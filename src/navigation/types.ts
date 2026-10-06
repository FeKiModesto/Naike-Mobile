import type { NavigatorScreenParams } from '@react-navigation/native';
export type TabParams = { Home: undefined; Favoritos: undefined; Carrinho: undefined; Pedidos: undefined; Perfil: undefined };
export type RootStackParamList = {
  Loja: NavigatorScreenParams<TabParams> | undefined;
  BoasVindas: undefined; HomePublica: undefined; Login: undefined; Cadastro: undefined; Detalhe: { id: string };
  Avaliacoes: { productId: string; productName: string };
  Checkout: undefined; Pagamento: { orderId: string }; PedidoDetalhe: { id: string };
  Ferramentas: undefined; ProdutoVariavel: undefined; Estoque: undefined;
  ConfigurarWebhook: undefined; Reembolso: undefined; CadastroCliente: undefined;
};