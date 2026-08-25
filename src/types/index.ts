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