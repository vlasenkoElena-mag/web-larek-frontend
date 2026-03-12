import type { Product } from '..';
import type { GetProductError } from '../../components/api/errors/product-getting-error';
import type { LoadProductsError } from '../../components/api/errors/product-list-loading-error';

export type LoadProductResult = { error: LoadProductsError; products: null }
  | { error: null; products: { total: number; items: Product[] } };

export type LoadProductByIdResult = { error: GetProductError; product: null }
  | { error: null; product: Product };

export type ProductApi = {
    /** загружает список всех товаров */
    getAll(): Promise<LoadProductResult>;
    getProductById(id: string): Promise<LoadProductByIdResult>;
};
