/** Contratos conferidos no PDF CP4 e Swagger v1. */
export interface Customer { id: string; name: string; email: string }
export interface LoginInput { email: string; password: string }
export interface LoginResponse { token: string; customer: Customer }
export interface CadastroClienteInput extends LoginInput { name: string; document?: string }
export type CadastroClienteResponse = LoginResponse;
export interface Category { id: string; name: string }
export interface Variant { id: string; sku: string; price: number; stock: number; options: Record<string, string> }
export interface Product {
  id: string; name: string; description: string; variants: Variant[];
  images: string[]; categoryId?: string; options: { name: string; values: string[] }[];
}
export interface PaginatedResponse<T> { data: T[]; page: number; pageSize: number; total: number }
export interface VarianteInput { sku: string; price: number; stock: number; options: Record<string, string> }
export interface CriarProdutoVariavelInput {
  name: string; description: string; type: 'VARIABLE'; state: 'PUBLISHED';
  categoryId?: string; options: { name: string; values: string[] }[]; variants: VarianteInput[];
}
export interface CriarProdutoSimplesInput { type: 'SIMPLE'; state: 'PUBLISHED'; name: string; description: string; sku: string; price: number; stock: number; categoryId?: string }
export interface EntradaEstoque { variantId: string; quantity: number; reason?: string }
export interface RespostaEstoque { variantId: string; sku: string; onHand: number; available: number }
export interface AdicionarItemCarrinhoInput { variantId: string; quantity: number }
export interface CartItem { variantId: string; name: string; sku: string; unitPrice: number; quantity: number; subtotal: number }
export interface Cart { id: string; items: CartItem[]; total: number; itemCount: number }
export interface OrderItem { variantId: string; productName: string; variantName: string | null; sku: string; unitPrice: number; quantity: number; subtotal: number }
export interface Order {
  id: string; status: string; total: number; items: OrderItem[]; createdAt: string;
  payment: { status: string; method: string; amount: number; transactionId: string } | null;
}
export type MetodoPagamento = 'PIX' | 'CREDIT_CARD' | 'BOLETO';
export interface PagamentoInput { orderId: string; method: MetodoPagamento; simulate?: 'approve' | 'decline' }
export type PagamentoResponse = Order;
export interface ReembolsoInput { orderId: string }
export interface CotacaoFreteInput { cepDestino: string; orderId?: string; items?: { weightGr: number; quantity: number }[] }
export interface ConfigurarWebhookInput { url: string; description?: string; events: string[] }
export interface ApiError extends Error { status: number; code: string; details?: unknown }
