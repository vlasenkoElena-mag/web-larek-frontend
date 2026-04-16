import type { Product } from '../../types/index.ts';
import type { ProductApi as IProductApi, LoadProductResult } from '../../types/api/product.api.ts';
import { Api } from '../base/api';
import { LoadProductsError } from './errors/product-list-loading-error';

export class ProductApi extends Api implements IProductApi {
    async getAll(): Promise<LoadProductResult> {
        try {
            const res = await this.get('/product') as { total: number; items: Product[] };
            return { error: null, products: { total: res.total, items: res.items } };
        }
        catch (error) {
            return { error: new LoadProductsError(error), products: null };
        }
    }
}
