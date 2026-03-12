import type { Product } from '../../types/index.ts';
import type { ProductApi as IProductApi, LoadProductByIdResult, LoadProductResult } from '../../types/api/product.api.ts';
import { Api } from '../base/api';
import { LoadProductsError } from './errors/product-list-loading-error';
import { GetProductError } from './errors/product-getting-error';

export class ProductApi extends Api implements IProductApi {
    async getAll(): Promise<LoadProductResult> {
        try {
            const res = await this.get('/product') as { total: number; items: Product[] };
            console.log('products: ', res);
            return { error: null, products: { total: res.total, items: res.items } };
        }
        catch (error) {
            return { error: new LoadProductsError(error), products: null };
        }
    }

    async getProductById(id: string): Promise<LoadProductByIdResult> {
        try {
            const product = await this.get(`/product/${id}`) as Product;
            return { error: null, product };
        }
        catch (error) {
            return { error: new GetProductError(id, error), product: null };
        }
    }
}
