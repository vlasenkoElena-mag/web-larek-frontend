import type { Product } from '..';
import type { LoadProductsError } from '../../components/api/errors/product-list-loading-error';

export type LoadProductResult = { error: LoadProductsError; products: null }
  | { error: null; products: Product[] };

export type ProductApi = {
    /** загружает список всех товаров */
    getAll(): Promise<LoadProductResult>;
};
