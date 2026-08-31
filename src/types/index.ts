export interface Product {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  categories: Category[];
  images: string[];
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface VarianteInput {
  sku: string;
  price: number;
  stock: number;
  options: Record<string, string>;
}

export interface CriarProdutoVariavelInput {
  name: string;
  description: string;
  type: string;
  options: { name: string; values: string[] }[];
  variants: VarianteInput[];
}

export interface EntradaEstoque {
  variantId: string;
  quantity: number;
  reason?: string;
}

export interface RespostaEstoque {
  variantId: string;
  sku: string;
  onHand: number;
  available: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  [key: string]: any;
}
export interface AdicionarItemCarrinhoInput {
  variantId: string;
  quantity: number;
}

export interface CartItem {
  variantId: string;
  quantity: number;
  [key: string]: any;
}

export interface Cart {
  items: CartItem[];
  [key: string]: any;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | string;

export interface Order {
  id: string;
  status: OrderStatus;
  total?: number;
  items?: any[];
  [key: string]: any;
}

export type MetodoPagamento = 'PIX' | 'CREDIT_CARD' | 'BOLETO';

export interface PagamentoInput {
  orderId: string;
  method: MetodoPagamento;
  simulate?: 'decline';
}

export interface NotaFiscal {
  orderId: string;
  number?: string;
  key?: string;
  issuedAt?: string;
  [key: string]: any;
}

export interface CadastroClienteInput {
  name: string;
  email: string;
  password: string;
  document?: string;
}

export interface CadastroClienteResponse {
  token: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}